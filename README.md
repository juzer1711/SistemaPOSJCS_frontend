# Frontend Sistema POS

Aplicación React 19 con Vite, React Router, Axios y MUI. Este README describe la aplicación actual; ya no utiliza Create React App.

## Ejecución local

Requiere Node.js/npm compatibles con las dependencias declaradas en package.json y acceso al backend. No hay una versión de Node fijada en el repositorio: verificar compatibilidad antes de actualizar dependencias.

Desde esta carpeta:

```powershell
# Solo si todavía no existe el archivo local
Copy-Item .env.example .env
npm.cmd ci
npm.cmd run dev
```

No sobrescribir un .env existente. VITE_API_URL debe incluir /api; normalmente http://localhost:8080/api. Vite solicita el puerto 3000; confirmar el puerto efectivo en terminal y agregar ese origen a CORS del backend.

```powershell
npm.cmd run build
npm.cmd run preview
git diff --check
```

El build genera dist/. preview sirve esa compilación para revisión local. No existen scripts npm start, npm test, lint o eject en el manifiesto actual. No afirmar que se ejecutó una suite frontend inexistente.

## Arquitectura

| Ubicación | Responsabilidad |
| --- | --- |
| src/modules/<dominio>/ | Páginas, componentes, hooks, servicios y validaciones del dominio. |
| src/components/ui/crud/ | CrudPageHeader, CrudFilterBar, CrudFormDialog, CrudDataTable, CrudPagination y hooks compartidos. |
| src/api/apiClient.js | Axios central, Bearer e interceptores. |
| src/context/ | Autenticación, permisos propios, empresa y notificaciones. |
| src/routes/Route.jsx | Registro de rutas; PrivateRoute y PermissionGuard controlan acceso. |
| src/modules/layout/navigationConfig.js | Configuración común para sidebar y dashboard. |
| src/pages/, hooks/, services/, components/ | Incluyen implementaciones legacy aún utilizadas; no eliminar por ubicación. |

useCrudQuery comparte debounce, filtros, orden, paginación, cancelación y recarga entre módulos y usuarios. Los servicios convierten esos parámetros al contrato de cada API. La búsqueda, paginación y ordenamiento son del servidor; no ordenar solo la página visible en el navegador.

El formulario común soporta texto, selectores, contraseña, validación y campos opcionales al editar. CSS Modules es el patrón de estilos nuevos. No duplicar componentes globales ni abstraer reglas específicas del dominio.

## Sesión y autorización

AuthContext mantiene la identidad; sessionStorage guarda pos_access_token. apiClient envía Authorization: Bearer. No se usan roles como modelo de autorización ni cookies para transportar el JWT.

PermissionsContext obtiene únicamente permisos propios desde GET /api/auth/permisos. Cambiar el usuario seleccionado en la matriz no cambia la identidad ni sus permisos. Se refrescan al autenticar, recuperar foco, recibir un 403 y modificar reglas propias; no hay sincronización push entre navegadores.

| Permiso | Comportamiento de la UI adaptada |
| --- | --- |
| CONSULTA | Ruta protegida; sidebar/dashboard deshabilitados sin consulta. |
| INSERCION | Ocultar botón de crear cuando no se permite. |
| ACTUALIZACION | Ocultar lápiz; en usuarios conservar el estado visible y deshabilitado. |
| REPORTE | Mostrar exportaciones de usuarios solo si se permiten. |
| DELETE | Existe en la matriz; no implica ofrecer eliminar en todos los CRUD. |

Un error al cargar permisos no concede acceso. La autorización definitiva se comprueba en backend.

## Estado funcional

- Landing, registro inicial de empresa, autenticación, layout y dashboard administrador modularizados.
- MODULOS: alta/edición sin eliminar; código textual con ejemplo, inmutable al editar, validación de disponibilidad, orden/filtros/paginación del servidor e información de descripción en modal bajo CONSULTA.
- REGLAS: filas por módulo, columnas por permiso; usuario inicial autenticado reemplazable por autocomplete, filtro por módulo y guardado inmediato de cada casilla. Mantiene al usuario seleccionado; permite autorrevocación.
- USUARIOS: misma base CRUD que módulos. Búsqueda parcial por nombre completo, username, documento y correo; filtros por estado/tipo de documento; orden y paginación del servidor.
- Usuarios conserva activos/inactivos, confirmación y reintento de estado, CSV/Excel, catálogo backend de documentos, documento bloqueado y cambio de contraseña opcional al editar. Cambiar username propio o desactivarse cierra sesión.
- La consulta de usuarios de cajas mantiene el adaptador buscarUsuariosRespuesta con respuesta Axios.
- Pendientes de refactor frontend: clientes, productos, ventas/POS, cajas, inventario, reportes, auditoría, perfil de empresa y dashboard cajero. No asumir permisos finos aplicados a estos flujos.

## Comprobaciones y límites

La fase de usuarios registró build correcto y pruebas de navegador con API simulada (formularios, filtros, orden, paginación, permisos, estado, exportación y responsive). No sustituyen una prueba integral con JWT y backend reales. El build emite una advertencia de tamaño de bundle; compilar no acredita rendimiento ni comportamiento funcional.

Conservar package-lock.json, manifiesto, configuración Vite, index.html y recursos referenciados. node_modules/ y dist/ son regenerables y no se versionan. Los archivos de public/ se copian al build; contiene recursos legacy de CRA pendientes de limpieza explícita.

## Colaboración

Leer [AGENTS](AGENTS.md) y la [skill técnica](.cursorrules/frontend-pos-architect/SKILL.md). La separación a repositorios independientes está pendiente; este documento no autoriza copiar ni eliminar archivos.
