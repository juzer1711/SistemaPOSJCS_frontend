import { NavLink } from "react-router-dom";
import { usePermissions } from "../../context/PermissionsContext.jsx";

export default function PermissionLink({ modulo, className, title, children, onClick, ...props }) {
  const { can } = usePermissions();
  if (modulo && !can(modulo, "CONSULTA")) return (
    <span
      className={typeof className === "function" ? className({ isActive: false }) : className}
      role="link" aria-disabled="true" tabIndex={0} title="Sin permiso de consulta"
      aria-label={props["aria-label"]}
    >{children}</span>
  );
  return <NavLink {...props} className={className} title={title} onClick={onClick}>{children}</NavLink>;
}