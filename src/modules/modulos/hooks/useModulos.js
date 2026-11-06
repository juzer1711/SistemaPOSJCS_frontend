import { useCallback, useState } from "react";
import { useSnackbar } from "../../../context/SnackBarProvider.jsx";
import useCrudQuery from "../../../components/ui/crud/useCrudQuery.js";
import { actualizarModulo, crearModulo, listarModulos } from "../services/modulosApi.js";

const EMPTY_FILTERS = { nombreModulo: "", zona: "" };
const INITIAL_SORT = { field: "nombreModulo", direction: "asc" };

export default function useModulos() {
  const query = useCrudQuery({ load: listarModulos, initialFilters: EMPTY_FILTERS,
    initialSort: INITIAL_SORT, errorMessage: "No fue posible cargar los módulos." });
  const [formOpen, setFormOpen] = useState(false);
  const [selectedModulo, setSelectedModulo] = useState(null);
  const { showSnackbar } = useSnackbar();
  const closeForm = useCallback(() => { setFormOpen(false); setSelectedModulo(null); }, []);
  const saveModulo = async (values) => {
    if (selectedModulo) await actualizarModulo(selectedModulo.idModulo, values);
    else await crearModulo(values);
    showSnackbar(selectedModulo ? "Módulo actualizado correctamente." : "Módulo creado correctamente.", "success");
    closeForm(); query.refresh();
  };
  return {
    ...query, modulos: query.rows, formOpen, selectedModulo, saveModulo, closeForm, retryLoad: query.refresh,
    openCreateForm: () => { setSelectedModulo(null); setFormOpen(true); },
    openEditForm: (modulo) => { setSelectedModulo(modulo); setFormOpen(true); },
  };
}