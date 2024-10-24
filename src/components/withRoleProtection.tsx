import { ComponentType } from "react";
import { useRoleCheck } from "../hooks/useRoleCheck";
import { RoleName } from "../config/roles";
import { PermissionType } from "../config/permissions";

type ProtectionConfig = {
  roles?: RoleName[];
  permissions?: PermissionType[];
  paths?: string[];
};

/**
 * HOC para proteger componentes basado en roles, permisos o rutas
 * @param WrappedComponent Componente a proteger
 * @param config Configuración de protección (roles, permisos o rutas permitidas)
 * @param FallbackComponent Componente opcional a mostrar cuando no hay acceso
 */
export function withRoleProtection<P extends object>(
  WrappedComponent: ComponentType<P>,
  config: ProtectionConfig,
  FallbackComponent?: ComponentType<P>
) {
  return function WithRoleProtection(props: P) {
    const { hasRole, hasPermission, canAccessPath, isLoading } = useRoleCheck();

    // Si está cargando, puedes mostrar un loading o null
    if (isLoading) {
      return null;
    }

    // Verificar roles si se especificaron
    if (config.roles?.length) {
      const hasAllowedRole = config.roles.some((role) => hasRole(role));
      if (!hasAllowedRole) {
        return FallbackComponent ? <FallbackComponent {...props} /> : null;
      }
    }

    // Verificar permisos si se especificaron
    if (config.permissions?.length) {
      const hasAllPermissions = config.permissions.every((permission) =>
        hasPermission(permission)
      );
      if (!hasAllPermissions) {
        return FallbackComponent ? <FallbackComponent {...props} /> : null;
      }
    }

    // Verificar rutas si se especificaron
    if (config.paths?.length) {
      const canAccessAllPaths = config.paths.every((path) =>
        canAccessPath(path)
      );
      if (!canAccessAllPaths) {
        return FallbackComponent ? <FallbackComponent {...props} /> : null;
      }
    }

    return <WrappedComponent {...props} />;
  };
}
