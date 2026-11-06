import { useEffect, useState, useRef } from "react";
import { getActiveProducts, updateStockMinimo } from "../../services/productService";
import { useSnackbar } from "../../context/SnackBarProvider";
import { formatDateForApi } from "../../utils/formats";
import {
  registrarEntrada,
  registrarSalida,
  getMovimientos,
} from "../../services/inventarioService";

export const useInventarioManagement = () => {
  // ================= ESTADOS =================

  const [productos, setProductos] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [motivo, setMotivo] = useState("");
  const { showSnackbar } = useSnackbar();

  // paginación
  const [pageInv, setPageInv] = useState(0);
  const [pageMov, setPageMov] = useState(0);
  const size = 10;
  const [totalRowsMov, setTotalRowsMov] = useState(0);

  // filtros movimientos
  const [filtroMov, setFiltroMov] = useState({
    search: "",
    fechaInicio: "",
    fechaFin: "",
  });
  const debounceRef = useRef(null);
  const isFirstRender = useRef(true);
  const skipPageResetRef = useRef(false);
  // form movimiento
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [tipoMovimiento, setTipoMovimiento] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [loadingMovimiento, setLoadingMovimiento] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState(null);
  const [openDetalle, setOpenDetalle] = useState(false);
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);
  // filtros inventario
  const [filtroInv, setFiltroInv] = useState({
    texto: "",
  });


  // ================= HELPERS =================

  // ================= LOADERS =================

  useEffect(() => {
    loadProductos();
  }, []);


// Primer load
useEffect(() => {
  loadMovimientos();
}, []); // ← solo al montar

// Filtros cambian → resetea página → dispara el de abajo
useEffect(() => {
  if (isFirstRender.current) {
    isFirstRender.current = false;
    return;
  }
  setPageMov(0);                                              // si ya era 0...
  loadMovimientos(filtroMov, tipoFiltro, 0);                  // ...igual recarga
}, [filtroMov.search, filtroMov.fechaInicio, filtroMov.fechaFin, tipoFiltro]);

// Página cambia manualmente (usuario clickea siguiente)
useEffect(() => {
  if (isFirstRender.current) return;
  loadMovimientos(filtroMov, tipoFiltro, pageMov);
}, [pageMov]);
  

  const loadProductos = async () => {
    const res = await getActiveProducts();
    const data = res.data.content || [];
    setProductos(data);
    setInventario(data); // reutilizamos producto como inventario
  };

// Recibe los valores como parámetros para evitar closures stale
  const loadMovimientos = async (filtros = filtroMov, tipo = tipoFiltro, page = pageMov) => {
    try {
      const res = await getMovimientos({
        page,
        size,
        search:      filtros.search      || undefined,
        tipo:        tipo                || undefined,
        fechaInicio: filtros.fechaInicio ? `${filtros.fechaInicio}T00:00:00` : undefined,
        fechaFin:    filtros.fechaFin    ? `${filtros.fechaFin}T23:59:59`    : undefined,
      });

      const data = res.data.content || [];
      setMovimientos(data);
      setTotalRowsMov(res.data.totalElements);
    } catch (error) {
      console.error(error);
      showSnackbar("Error al cargar movimientos", "error");
    }
  };

  // ================= ACCIONES =================

  const handleRegistrarMovimiento = async () => {
    if (!productoSeleccionado || !tipoMovimiento || !cantidad) {
      showSnackbar("Completa todos los campos", "warning");
      return;
    }

    try {
      setLoadingMovimiento(true);

      const body = {
        idProducto: productoSeleccionado.idProducto,
        cantidad: Number(cantidad),
        motivo: motivo || "Movimiento manual",
      };

      if (tipoMovimiento === "ENTRADA") {
        await registrarEntrada(body);
      } else {
        await registrarSalida(body);
      }

      showSnackbar("Movimiento registrado correctamente", "success");

      // reset
      setProductoSeleccionado(null);
      setCantidad("");
      setTipoMovimiento("");
      setMotivo("");

      await loadProductos();
      await loadMovimientos();
    } catch (error) {
      console.error(error);
      showSnackbar("Error al registrar movimiento", "error");
    } finally {
      setLoadingMovimiento(false);
    }
  };

  const handleSearchMovimientos = (value) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFiltroMov((prev) => ({ ...prev, search: value }));
    }, 400);
  };

  const handleUpdateStockMinimo = async (producto, nuevoStockMinimo) => {
    try {
      await updateStockMinimo(producto.idProducto, nuevoStockMinimo);

      showSnackbar("Stock mínimo actualizado", "success");

      await loadProductos(); // 🔥 refresca inventario automáticamente
    } catch (error) {
      console.error(error);
      showSnackbar(error.message || "Error al actualizar stock mínimo", "error");
    }
  };

  const handleRowClick = (row) => {
    setMovimientoSeleccionado(row);
    setOpenDetalle(true);
  };

  // ================= DERIVADOS =================

  const lowStockProducts = inventario.filter(
    (p) => p.stockActual <= p.stockMinimo
  );

  const inventarioFiltrado = inventario.filter((p) => {
    const cumpleStock = showOnlyLowStock
      ? p.stockMinimo > 0 && p.stockActual <= p.stockMinimo
      : true;

    const texto = filtroInv.texto.trim().toLowerCase();

    if (!texto) return cumpleStock;

    const nombreMatch = p.nombre?.toLowerCase().includes(texto);
    const codigoMatch = p.codigoBarras?.toLowerCase().includes(texto);

    return cumpleStock && (nombreMatch || codigoMatch);
  });

  const buscarProductoPorCodigo = (texto) => {
    if (!texto.trim()) {
      setFiltroMov((prev) => ({ ...prev, producto: null }));
      return;
    }

    const encontrado = productos.find(
      (p) =>
        p.codigoBarras?.toLowerCase() === texto.trim().toLowerCase()
    );

    if (encontrado) {
      setFiltroMov((prev) => ({ ...prev, producto: encontrado }));
    }
  };

  return {
    // Datos
    productos,
    movimientos,
    movimientoSeleccionado,
    lowStockProducts,
    inventarioFiltrado,
    // Paginación
    pageInv,
    setPageInv,
    pageMov,
    setPageMov,
    totalRowsMov,
    // Filtros
    filtroMov,
    setFiltroMov,
    tipoFiltro,
    setTipoFiltro,
    // Formulario movimiento
    productoSeleccionado,
    setProductoSeleccionado,
    tipoMovimiento,
    setTipoMovimiento,
    cantidad,
    setCantidad,
    motivo,
    setMotivo,
    loadingMovimiento,
    // Dialog detalle movimiento
    openDetalle,
    setOpenDetalle,
    handleRowClick,
    // Stock bajo
    showOnlyLowStock,
    setShowOnlyLowStock,
    // Handlers
    handleRegistrarMovimiento,
    handleUpdateStockMinimo,
    handleSearchMovimientos,
    filtroInv,
    setFiltroInv,
  };
};