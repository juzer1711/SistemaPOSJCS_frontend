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

CrudPageHeader admite `actions` como contenido React opcional para acciones de página (por ejemplo, exportaciones), junto al botón principal configurado con `actionLabel`, `onAction` y `actionDisabled`. El dominio define los botones, permisos y estados de carga; el encabezado solo organiza su presentación y adapta el grupo a pantallas pequeñas. Mantener filtros en una fila independiente debajo. Usuarios implementa esta referencia con Excel, CSV y Nuevo usuario; reutilizarla al adaptar otros CRUD que necesiten acciones, sin añadir exportaciones a dominios que no las tengan.

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
- EMPRESA: perfil único dentro del dominio, sin tabla ni paginación. Formulario con nueve campos generales y selección de responsabilidad de IVA; validación general compartida con el registro inicial y validación tributaria específica del perfil. Acceso bajo CONSULTA y cambios de datos/logo bajo ACTUALIZACION. GET /api/empresa y EmpresaContext siguen disponibles para personalización pública.
- El contrato del perfil incluye `responsableIva`: true/false se conservan como booleanos en el payload y contexto; null o ausencia se muestran como "Pendiente de configurar", sin asumir false. Para guardar el perfil se exige seleccionar Responsable o No responsable según el RUT. El selector está deshabilitado sin ACTUALIZACION o mientras hay una escritura en curso; participa en cambios pendientes, descarte y errores por campo. El registro inicial conserva sus campos actuales y puede dejar esta condición pendiente para configurarla en el perfil. Este cambio no modifica el cálculo de ventas ni los tiquetes.
- Empresa conserva un borrador separado del contexto. El logo se guarda inmediatamente y no reemplaza campos sin guardar; ambas escrituras se excluyen entre sí en la pantalla. Las respuestas confirmadas actualizan el contexto sin otra consulta, y las lecturas obsoletas se cancelan. Ante error transitorio de consulta se conserva la personalización ya confirmada.
- Navbar y landing mantienen su presentación actual: navbar usa la marca estática POS JCS y nombre comercial; landing usa existencia/nombre, y los tiquetes conservan sus campos actuales. No se añadió logo empresarial a esos consumidores.
- MODULOS: alta/edición sin eliminar; código textual con ejemplo, inmutable al editar, validación de disponibilidad, orden/filtros/paginación del servidor e información de descripción en modal bajo CONSULTA.
- REGLAS: filas por módulo, columnas por permiso; usuario inicial autenticado reemplazable por autocomplete, filtro por módulo y guardado inmediato de cada casilla. Mantiene al usuario seleccionado; permite autorrevocación.
- USUARIOS: misma base CRUD que módulos. Búsqueda parcial por nombre completo, username, documento y correo; filtros por estado/tipo de documento; orden y paginación del servidor.
- Usuarios conserva activos/inactivos, confirmación y reintento de estado, CSV/Excel, catálogo backend de documentos, documento bloqueado y cambio de contraseña opcional al editar. Cambiar username propio o desactivarse cierra sesión.
- La consulta de usuarios de cajas mantiene el adaptador buscarUsuariosRespuesta con respuesta Axios.
- Pendientes de refactor frontend: clientes, productos, ventas/POS, cajas, inventario, reportes, auditoría y dashboard cajero. No asumir permisos finos aplicados a estos flujos.

## Comprobaciones y límites

Empresa: `node --test tests/empresa.test.js` ejecuta ocho pruebas de payload, validación, errores y borrador, incluyendo responsabilidad de IVA, false explícito y selección pendiente; `npm.cmd run build` comprueba compilación. Las comprobaciones históricas de navegador con API simulada cubrieron guardado, logo sin perder borrador, errores por campo, permisos y revocación, sesión ausente, registro inicial, reintento y viewport móvil de 390 px. No equivalen a persistencia real, JWT válido ni Cloudinary real, ni validan por sí solas el nuevo selector tributario.

La fase de usuarios registró build correcto y pruebas de navegador con API simulada (formularios, filtros, orden, paginación, permisos, estado, exportación y responsive). No sustituyen una prueba integral con JWT y backend reales. El build emite una advertencia de tamaño de bundle; compilar no acredita rendimiento ni comportamiento funcional.

Conservar package-lock.json, manifiesto, configuración Vite, index.html y recursos referenciados. node_modules/ y dist/ son regenerables y no se versionan. Los archivos de public/ se copian al build; contiene recursos legacy de CRA pendientes de limpieza explícita.

## Colaboración

Leer [AGENTS](AGENTS.md) y la [skill técnica](.cursorrules/frontend-pos-architect/SKILL.md). La separación a repositorios independientes está pendiente; este documento no autoriza copiar ni eliminar archivos.
