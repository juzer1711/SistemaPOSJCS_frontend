# Instrucciones frontend POS

Esta aplicación usa React 19, Vite, Axios, React Router y MUI. Su manifiesto es la fuente de versiones y scripts.

Leer la [skill frontend-pos-architect](.cursorrules/frontend-pos-architect/SKILL.md) para tareas de implementación o refactor. Consultar [README](README.md) para ejecución, arquitectura y estado. Estas instrucciones son autosuficientes para la futura separación de repositorios.

- Trabajar por alcance aprobado y conservar el worktree. Un diagnóstico no autoriza implementar.
- Antes de editar, revisar rutas, servicios, hooks, componentes compartidos y contratos backend. Si el backend está separado y no está disponible, no inventar su contrato.
- Código nuevo por dominio en src/modules/. UI común en src/components/ui/; no crear un segundo sistema de CRUD.
- Compartir tabla, paginación, encabezado, filtros, formulario y consulta cuando corresponda. La lógica y campos de cada entidad permanecen en su dominio.
- Estilos nuevos en CSS Modules, con accesibilidad de teclado, etiquetas, errores y diseño responsive.
- Mantener JWT Bearer y sessionStorage; no cambiar a cookies/localStorage ni introducir roles sin solicitud explícita.
- Consultar permisos de usuario-módulo desde el contexto existente. El backend es la autoridad; ocultar un botón no garantiza autorización.
- Usuarios: estado visible pero deshabilitado sin ACTUALIZACION; edición de contraseña opcional y documento bloqueado.
- No borrar legacy antes de verificar referencias y paridad, incluidas las integraciones con cajas.
- No incluir secretos en variables VITE_: son públicas en el bundle.
- Verificar código con npm.cmd run build y git diff --check. Probar interacciones relevantes y declarar si la API fue simulada o real.
- Mantener documentación directamente afectada. No realizar migraciones, commits o pushes fuera del alcance solicitado.
