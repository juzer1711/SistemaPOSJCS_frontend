import { usePermissions } from "../../../context/PermissionsContext.jsx";
import { useState } from "react";
import { Box } from "@mui/material";
import { EditOutlined, InfoOutlined } from "@mui/icons-material";
import CrudDataTable from "../../../components/ui/crud/CrudDataTable.jsx";
import CrudFilterBar from "../../../components/ui/crud/CrudFilterBar.jsx";
import CrudFormDialog from "../../../components/ui/crud/CrudFormDialog.jsx";
import CrudPageHeader from "../../../components/ui/crud/CrudPageHeader.jsx";
import ManagementToolbar from "../../../components/ui/ManagementToolbar.jsx";
import useModulos from "../hooks/useModulos.js";
import ModuloInfoDialog from "../components/ModuloInfoDialog.jsx";
import { consultarCodigoDisponible } from "../services/modulosApi.js";
import styles from "./ModulosPage.module.css";

const FILTER_FIELDS = [
  { name: "nombreModulo", label: "Nombre del módulo", placeholder: "Buscar por nombre…" },
  { name: "zona", label: "Zona", placeholder: "Buscar por zona…" },
];

const FORM_FIELDS = [
  {
    name: "codigoModulo",
    label: "Código identificador del módulo",
    placeholder: "Ej.: GESTION_PRODUCTOS",
    validateAsync: consultarCodigoDisponible,
    availableMessage: "Código disponible.",
    required: true,
    maxLength: 50,
    pattern: /^[A-Z][A-Z0-9_]*$/,
    patternMessage: "Usa mayúsculas, números o guion bajo; debe iniciar con letra.",
    helperText: "Texto en mayúsculas, por ejemplo GESTION_PRODUCTOS. Identifica permisos y no se cambia al editar.",
    disabledWhenEditing: true,
  },
  {
    name: "archivo",
    label: "Archivo",
    required: true,
    maxLength: 255,
    helperText: "Ruta o identificador asociado al módulo.",
  },
  {
    name: "nombreModulo",
    label: "Nombre del módulo",
    required: true,
    maxLength: 100,
  },
  {
    name: "zona",
    label: "Zona",
    required: true,
    maxLength: 100,
  },
  {
    name: "comentarios",
    label: "Descripción / comentarios (opcional)",
    maxLength: 1000,
    multiline: true,
    minRows: 3,
  },
];

const COLUMNS = [
  { field: "idModulo", headerName: "ID", sortable: true },
  { field: "codigoModulo", headerName: "Código", sortable: true },
  { field: "archivo", headerName: "Archivo" },
  { field: "nombreModulo", headerName: "Nombre", sortable: true },
  { field: "zona", headerName: "Zona", sortable: true },
];

const emptyValues = {
  codigoModulo: "",
  archivo: "",
  nombreModulo: "",
  zona: "",
  comentarios: "",
};

export default function ModulosPage() {
  const modulos = useModulos();
  const { can } = usePermissions();
  const canCreate = can("MODULOS", "INSERCION");
  const canUpdate = can("MODULOS", "ACTUALIZACION");
  const [infoId, setInfoId] = useState(null);

  return (
    <Box className={styles.page}>
      <CrudPageHeader
        title="Gestión de módulos"
        subtitle="Administra las áreas funcionales disponibles en el sistema."
        actionLabel={canCreate ? "Nuevo módulo" : undefined}
        onAction={modulos.openCreateForm}
      />

      <ManagementToolbar>
        <CrudFilterBar
          fields={FILTER_FIELDS}
          values={modulos.filters}
          onChange={modulos.handleFilterChange}
          onClear={modulos.clearFilters}
        />
      </ManagementToolbar>

      <CrudDataTable
        columns={COLUMNS}
        sort={modulos.sort}
        onSortChange={modulos.handleSortChange}
        rows={modulos.modulos}
        rowKey="idModulo"
        page={modulos.page}
        rowsPerPage={modulos.pageSize}
        totalRows={modulos.totalRows}
        onPageChange={(_, page) => modulos.setPage(page)}
        onRowsPerPageChange={(event) => {
          modulos.setPageSize(Number(event.target.value));
          modulos.setPage(0);
        }}
        actions={[
          {
            id: "info",
            label: "Mostrar información",
            Icon: InfoOutlined,
            onClick: (modulo) => setInfoId(modulo.idModulo),
          },
          ...(canUpdate ? [{
            id: "edit",
            label: "Editar",
            Icon: EditOutlined,
            onClick: modulos.openEditForm,
          }] : []),
        ]}
        loading={modulos.loading}
        error={modulos.error}
        onRetry={modulos.retryLoad}
        emptyMessage="No se encontraron módulos. Ajusta los filtros o crea uno nuevo."
      />

      {infoId !== null && <ModuloInfoDialog key={infoId} idModulo={infoId} onClose={() => setInfoId(null)} />}

      {(modulos.selectedModulo ? canUpdate : canCreate) && <CrudFormDialog
        open={modulos.formOpen}
        title={modulos.selectedModulo ? "Editar módulo" : "Crear módulo"}
        fields={FORM_FIELDS}
        initialValues={modulos.selectedModulo || emptyValues}
        editing={Boolean(modulos.selectedModulo)}
        onClose={modulos.closeForm}
        onSubmit={modulos.saveModulo}
      />}
    </Box>
  );
}
