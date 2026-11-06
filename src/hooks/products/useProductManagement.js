import { useEffect, useState } from "react";
import {
  searchProducts,
  deactivateProduct,
  activateProduct,
  getCategorias
} from "../../services/productService";
import { useExport } from "../export/useExport";
import { exportProductosExcel, exportProductosCSV } from "../../services/exportService";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const [filter, setFilter] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  const [open, setOpen] = useState(false);
  const [openCategoria, setOpenCategoria] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({});
  const [selectedId, setSelectedId] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const ALL_COLUMNS = {
    idProducto: "ID",
    nombre: "Nombre",
    categoria: "Categoria",
    codigoBarras: "Codigo de Barras",
    descripcion: "Descripción",
    costo: "Costo",
    precioventa: "Precio de Venta",
    iva: "IVA",
    precioSinIva: "Precio sin Iva",
    estado: "Estado",
    acciones: "Acciones",
  };

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const defaults = {};
    Object.keys(ALL_COLUMNS).forEach((k) => (defaults[k] = true));
    return defaults;
  });

  const [sortBy, setSortBy] = useState({ key: "nombre", direction: "asc" });
  const [advancedFilters, setAdvancedFilters] = useState({
    categoria: "",
    estado: "",
  });

    const { handleExport: handleExportExcel, loadingExport: loadingExcel } =
      useExport(exportProductosExcel, "productos.xlsx");
  
    const { handleExport: handleExportCSV, loadingExport: loadingCSV } =
      useExport(exportProductosCSV, "productos.csv");

  const handleShowAll = () => {
    const all = {};
    Object.keys(visibleColumns).forEach(k => all[k] = true);
    setVisibleColumns(all);
  };

  useEffect(() => {
    loadProducts();
  }, [page, pageSize, sortBy, filter, advancedFilters, showInactive]);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadProducts = async () => {
    try {
      const params = {
        page,
        size: pageSize,
        sort: `${sortBy.key},${sortBy.direction}`,
        search: filter || undefined,
        categoria: advancedFilters.categoria || undefined,
        estado: showInactive ? false : true
      };

      const res = await searchProducts(params);

      setProducts(res.data.content || []);
      setTotalRows(res.data.totalElements || 0);

      const lowStock = res.data.content.filter(
        p => p.stockActual <= p.stockMinimo
      );

      if (lowStock.length > 0) {
        showMessage(`⚠ ${lowStock.length} productos con stock bajo`, "warning");
      }

    } catch (error) {
      console.error(error);
    }
  };

  const loadCategorias = async () => {
    const res = await getCategorias();
    setCategorias(res.data);
  };

  const handleAdd = () => {
    setEditing(false);
    setSelectedProduct(null);
    setOpen(true);
  };

  const handleAddCategoria = () => {
    setEditingCategoria(false);
    setSelectedCategoria(null);
    setOpenCategoria(true);
  };

  const handleEdit = (product) => {
    setEditing(true);
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleEditCategoria = (categoria) => {
    setEditingCategoria(true);
    setSelectedCategoria(categoria);
    setOpenCategoria(true);
  };

  const openDeactivateDialog = (id) => {
    setSelectedId(id);
    setDialogInfo({
      title: "¿Desactivar producto?",
      message: "Usted no podrá acceder a los datos del producto.",
      confirmText: "Desactivar",
      confirmColor: "error",
    });
    setDialogOpen(true);
  };

  const openActivateDialog = (id) => {
    setSelectedId(id);
    setDialogInfo({
      title: "¿Activar producto?",
      message: "Usted podrá acceder a los datos del producto nuevamente.",
      confirmText: "Activar",
      confirmColor: "primary",
    });
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    setDialogOpen(false);

    if (dialogInfo.confirmText === "Desactivar") {
      await deactivateProduct(selectedId);
      showMessage("Producto desactivado correctamente");
    } else {
      await activateProduct(selectedId);
      showMessage("Producto activado correctamente");
    }

    loadProducts();
  };

  const showMessage = (msg, type = "success") => {
    setSnackbar({ open: true, message: msg, severity: type });
  };

  const getExportParams = () => ({
    search:    filter            || undefined,
    categoria: advancedFilters.categoria  || undefined,
    estado:    showInactive ? false : true,
  });

  const exportExcel = () => handleExportExcel(getExportParams());
  const exportCSV   = () => handleExportCSV(getExportParams());

  return {
    products,
    categorias,

    page, setPage,
    pageSize, setPageSize,
    totalRows,

    filter, setFilter,
    showInactive, setShowInactive,

    open, editing, selectedProduct,
    setOpen, setEditing, setSelectedProduct,

    openCategoria, editingCategoria, selectedCategoria,
    setOpenCategoria, setEditingCategoria, setSelectedCategoria,

    dialogOpen, dialogInfo,
    setDialogOpen,
    handleConfirm,

    snackbar, showMessage,

    visibleColumns, setVisibleColumns,
    handleShowAll,
    ALL_COLUMNS,

    sortBy, setSortBy,
    advancedFilters, setAdvancedFilters,

    loadProducts,
    loadCategorias,

    handleAdd,
    handleEdit,
    handleAddCategoria,
    handleEditCategoria,
    openDeactivateDialog,
    openActivateDialog,
    exportExcel,
    exportCSV,
    loadingExcel,
    loadingCSV
  };
}