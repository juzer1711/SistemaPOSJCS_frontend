---
name: frontend-pos-architect
description: Implementar o refactorizar React/Vite del POS por dominios, reutilizando la base CRUD, CSS Modules y permisos usuario-módulo.
---

# Refactor frontend POS

## Preparación

Leer [AGENTS](../../AGENTS.md) y [README](../../README.md). Revisar Git, rutas, API, hooks, componentes equivalentes y contrato backend. El usuario define el orden y aprueba el alcance; no implementar si solo solicita diagnóstico. Conservar cambios previos y comportamiento legacy.

El README mantiene el estado de avance; no duplicar una hoja de ruta futura como si estuviera aprobada. La referencia actual de CRUD es módulos + usuarios; reglas utiliza una matriz particular.

## Arquitectura aplicable

- Código por dominio en src/modules/<dominio>/ con pages, components, hooks, services y validation cuando aporten separación.
- UI transversal en src/components/ui/; base CRUD en src/components/ui/crud/.
- Mantener las reglas y campos específicos en el dominio, no codificarlos dentro de los componentes compartidos.
- Usar apiClient central y VITE_API_URL con /api. No crear clientes Axios paralelos.
- CSS Modules para estilos nuevos; MUI para controles/iconos. Etiquetas, foco, teclado, errores claros y diseño responsive.
- No crear una carpeta shared paralela ni una tabla genérica nueva sin revisar lo existente.

## Procedimiento para adaptar otro CRUD

1. Inspeccionar DTO, filtros, paginación, sort, validación, unicidad y permisos backend. Revisar consumidores legacy.
2. Identificar qué comportamiento existente se conserva y qué pidió cambiar el usuario.
3. Crear/adaptar servicio de dominio y hook. Reutilizar useCrudQuery cuando el contrato sea paginado: debounce conjunto, reinicio de página, AbortController y descarte de respuestas obsoletas.
4. Configurar CrudPageHeader, CrudFilterBar, CrudDataTable, CrudPagination y CrudFormDialog. Compartir estado de consulta, no las mutaciones de entidades distintas.
5. Agregar selectores/contraseña a través del formulario común si son reutilizables. Mantener validadores y payload en el dominio.
6. Integrar ruta, navigationConfig y acciones con permisos. Probar acceso directo además de navegación.
7. Comprobar referencias y paridad antes de borrar piezas legacy. Mantener adaptadores cuando consumidores pendientes necesiten otro formato.
8. Validar build, diff y flujos relevantes. Informar límites de mocks.

Ejemplo: usuarios usa listarUsuarios que devuelve datos de página; cajas conserva buscarUsuariosRespuesta que devuelve respuesta Axios. Un cambio de estructura del servicio no debe romper ese consumidor.

## Contratos que deben conservarse

- Módulos: código textual con ejemplo, inmutable al editar; validación asíncrona de disponibilidad sin sustituir validación final del backend. Alta/edición, sin eliminar. Descripción extensa mediante modal bajo CONSULTA.
- Usuarios: búsqueda parcial por nombre completo, username, documento y correo; catálogo de tipos desde backend, filtros activos/inactivos/todos. Documento bloqueado; contraseña requerida al crear y opcional al editar. Conservar confirmación y reintento de estado y exportaciones.
- Estado de usuario visible como información aunque falte ACTUALIZACION: deshabilitar, no ocultar.
- Al cambiar username propio o desactivarse, cerrar sesión porque JWT identifica por username.
- Matriz: inicializar con autenticado, permitir reemplazar selección y filtrar módulos. Guardar inmediatamente una casilla, conservar selección y permitir autorrevocación.

## Seguridad

AuthContext y PermissionsContext tienen responsabilidades distintas. sessionStorage guarda pos_access_token; apiClient agrega Bearer. No sustituir por cookies, localStorage o roles.

La matriz puede mostrar otro usuario, pero el contexto de permisos sigue perteneciendo al autenticado. No conceder acceso si falla su carga. Mantener refresco en foco/403 y tras modificación propia.

Aplicar CONSULTA a ruta/sidebar/dashboard; INSERCION a crear; ACTUALIZACION al lápiz y cambio de estado; REPORTE a exportar. Los permisos son independientes y la UI no reemplaza la comprobación del servidor. No extender DELETE a todos los CRUD por aparecer en la matriz.

## Verificación y aprendizajes

- Ordenar únicamente la página descargada no equivale a ordenar el conjunto: enviar sort al backend y mantener flecha/aria coherentes desde el primer clic.
- Al cambiar filtros desde otra página, aplicar filtro y reiniciar página juntos; evitar consultas intermedias y resultados viejos.
- Modales MUI tienen transición de salida: esperar que el diálogo desaparezca antes de comprobar accesibilidad de los controles del fondo.
- Deshabilitar dobles envíos y cerrar solo tras éxito. Ante error conservar información útil y permitir reintento.
- Ejecutar npm.cmd run build y git diff --check para cambios de código. No hay script npm test configurado.
- Distinguir navegador con API simulada, SQL real y flujo autenticado real. Build correcto no demuestra login, permisos o persistencia.
