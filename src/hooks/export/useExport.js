import { useState } from "react";
import { useSnackbar } from "../../context/SnackBarProvider";

export const useExport = (exportFn, filename) => {
  const [loadingExport, setLoadingExport] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleExport = async (params = {}) => {
    try {
      setLoadingExport(true);

      // Limpiar params vacíos para no mandar strings vacíos al backend
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
      );

      const response = await exportFn(cleanParams);

      const url = window.URL.createObjectURL(response.data);
      const a   = document.createElement("a");
      a.href     = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      showSnackbar(`${filename} exportado correctamente`);
    } catch (error) {
      console.error(error);
      showSnackbar("Error al exportar", "error");
    } finally {
      setLoadingExport(false);
    }
  };

  return { handleExport, loadingExport };
};