export const getAccionColor = (accion = "") => {
  const a = accion.toUpperCase();

  switch (a) {
    // autenticación
    case "LOGIN":
      return "success";
    case "LOGOUT":
      return "warning";

    // creación
    case "CREAR":
    case "CREADO":
      return "success";

    // actualización
    case "EDITAR":
    case "ACTUALIZAR":
    case "UPDATE":
      return "info";

    // eliminación
    case "ELIMINAR":
    case "DELETE":
      return "error";

    // caja / dinero
    case "ENTRADA":
      return "success";
    case "SALIDA":
      return "error";

    // empresa / config
    case "ACTUALIZAR LOGO":
      return "secondary";

    // estados usuario
    case "ACTIVAR":
      return "success";
    case "DESACTIVAR":
      return "error";

    default:
      return "default";
  }
};