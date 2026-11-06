import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveProducts } from "../../services/productService";
import { getActiveClients } from "../../services/clientService";
import {
  abrirCaja,
  cerrarCaja,
  getCajasAbiertas,
  getCajaActivaByUsuario,
} from "../../services/cajaService";
import { useSnackbar } from "../../context/SnackBarProvider";

export const useVentaPOS = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  // ================= DATOS =================

  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);

  // ================= CAJA =================

  const [cajaActual, setCajaActual] = useState(null);
  const [cajaActiva, setCajaActiva] = useState(null);
  const [loadingCaja, setLoadingCaja] = useState(true);
  const [openCajaModal, setOpenCajaModal] = useState(false);
  const [openCerrarCaja, setOpenCerrarCaja] = useState(false);
  const [reporteCierre, setReporteCierre] = useState(null);
  const [openMovimiento, setOpenMovimiento] = useState(false);

  // ================= CARRITO (persistido en localStorage) =================

  const [items, setItems] = useState(() => {
    const data = localStorage.getItem("pos_venta");
    return data ? JSON.parse(data).items || [] : [];
  });

  const [clienteSeleccionado, setClienteSeleccionado] = useState(() => {
    const data = localStorage.getItem("pos_venta");
    return data ? JSON.parse(data).clienteSeleccionado || null : null;
  });

  const [metodoPago, setMetodoPago] = useState(() => {
    const data = localStorage.getItem("pos_venta");
    return data ? JSON.parse(data).metodoPago || "" : "";
  });

  const [montoRecibido, setMontoRecibido] = useState(() => {
    const data = localStorage.getItem("pos_venta");
    return data ? JSON.parse(data).montoRecibido || "" : "";
  });

  const [observaciones, setObservaciones] = useState(() => {
    const data = localStorage.getItem("pos_venta");
    return data ? JSON.parse(data).observaciones || "" : "";
  });

  // ================= EFECTOS =================

  // Cargar caja por usuario (para el header)
  useEffect(() => {
    const cargarCaja = async () => {
      try {
        const response = await getCajasAbiertas();
        const cajas = response.data.content;
        const idUsuario = localStorage.getItem("id_usuario");
        const caja = cajas.find(
          (c) => String(c.idUsuario) === String(idUsuario)
        );
        setCajaActual(caja);
      } catch (error) {
        console.error("Error cargando caja:", error);
      }
    };
    cargarCaja();
  }, []);

  // Cargar productos y clientes
  useEffect(() => {
    const loadData = async () => {
      try {
        const [p, c] = await Promise.all([
          getActiveProducts(),
          getActiveClients(),
        ]);
        setProductos(p.data.content || []);
        setClientes(c.data.content || []);
      } catch (err) {
        console.error("Error cargando datos POS", err);
      }
    };
    loadData();
  }, []);

  // Persistir carrito en localStorage
  useEffect(() => {
    const data = {
      items,
      clienteSeleccionado,
      metodoPago,
      montoRecibido,
      observaciones,
    };
    localStorage.setItem("pos_venta", JSON.stringify(data));
  }, [items, clienteSeleccionado, metodoPago, montoRecibido, observaciones]);

  const fetchCajaActiva = async () => {
      const idUsuario = localStorage.getItem("id_usuario");
      try {
        const res = await getCajaActivaByUsuario(Number(idUsuario));
        setCajaActiva(res.data);
      } catch (error) {
        setCajaActiva(null);
      } finally {
        setLoadingCaja(false);
      }
    };

  // Verificar caja activa del cajero
  useEffect(() => {
    fetchCajaActiva();
  }, []);

  // Abrir modal de caja si no hay caja activa
  useEffect(() => {
    if (!loadingCaja && !cajaActiva) {
      setOpenCajaModal(true);
    }
  }, [loadingCaja, cajaActiva]);

  // ================= ACCIONES DEL CARRITO =================

  const addItem = (producto) => {
    if (!producto?.idProducto) return;

    if (producto.stockActual <= 0) {
      showSnackbar("⚠ Producto sin stock (venta permitida)", "warning");
    } else if (producto.stockActual <= producto.stockMinimo) {
      showSnackbar("⚠ Stock bajo", "warning");
    }

    setItems((prev) => {
      const found = prev.find((i) => i.idProducto === producto.idProducto);
      if (found) {
        return prev.map((i) =>
          i.idProducto === producto.idProducto
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        );
      }
      return [
        ...prev,
        {
          idProducto: producto.idProducto,
          nombre: producto.nombre,
          precioUnitario: Number(producto.precioventa),
          ivaPorcentaje: producto.iva.value,
          precioSinIva: Number(producto.precioSinIva),
          cantidad: 1,
        },
      ];
    });
  };

  const updateQuantity = (idProducto, cantidad) => {
    setItems((prev) =>
      prev.map((i) => (i.idProducto === idProducto ? { ...i, cantidad } : i))
    );
  };

  const removeItem = (idProducto) => {
    setItems((prev) => prev.filter((i) => i.idProducto !== idProducto));
  };

  const clearCart = () => {
    setItems([]);
    setClienteSeleccionado(null);
    setMetodoPago("");
    setMontoRecibido("");
    setObservaciones("");
    localStorage.removeItem("pos_venta");
  };

  // ================= ACCIONES DE CAJA =================

  const loadProductos = async () => {
    try {
      const res = await getActiveProducts();
      setProductos(res.data.content || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAbrirCaja = async (montoInicial) => {
    try {
      const idUsuario = Number(localStorage.getItem("id_usuario"));
      await abrirCaja({ idUsuario, montoInicial: Number(montoInicial) });
      setOpenCajaModal(false);
      const res = await getCajaActivaByUsuario(idUsuario);
      setCajaActiva(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCerrarCaja = async (efectivoReal, transferenciaReal) => {
    try {
      const idUsuario = localStorage.getItem("id_usuario");
      const res = await cerrarCaja({ idUsuario, efectivoReal, transferenciaReal });
      setReporteCierre(res);
      showSnackbar("Caja cerrada correctamente", "success");
      setOpenCerrarCaja(false);
      clearCart();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCierreReporteClose = () => {
    setReporteCierre(null);
    navigate("/admin-dashboard");
  };

  return {
    // Datos
    productos,
    clientes,
    // Carrito
    items,
    clienteSeleccionado,
    setClienteSeleccionado,
    metodoPago,
    setMetodoPago,
    montoRecibido,
    setMontoRecibido,
    observaciones,
    setObservaciones,
    // Caja
    cajaActiva,
    fetchCajaActiva,
    loadingCaja,
    openCajaModal,
    openCerrarCaja,
    setOpenCerrarCaja,
    reporteCierre,
    openMovimiento,
    setOpenMovimiento,
    // Handlers carrito
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    loadProductos,
    // Handlers caja
    handleAbrirCaja,
    handleCerrarCaja,
    handleCierreReporteClose,
  };
};