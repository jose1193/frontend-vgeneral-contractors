import { ComponentType } from "react";
import { useRoleCheck } from "../hooks/useRoleCheck";
import { RoleName } from "../config/roles";
import { PermissionType } from "../config/permissions";
import Forbidden from "./Forbidden";
import { CircularProgress, Box } from "@mui/material";

type ProtectionConfig = {
  roles?: RoleName[];
  permissions?: PermissionType[];
  paths?: string[];
};

/**
 * HOC para proteger componentes basado en roles, permisos o rutas
 * @param WrappedComponent Componente a proteger
 * @param config Configuración de protección (roles, permisos o rutas permitidas)
 * @param CustomFallback Componente opcional personalizado a mostrar cuando no hay acceso
 */
export function withRoleProtection<P extends object>(
  WrappedComponent: ComponentType<P>,
  config: ProtectionConfig,
  CustomFallback?: ComponentType<P>
) {
  return function WithRoleProtection(props: P) {
    const { hasRole, hasPermission, canAccessPath, isLoading } = useRoleCheck();

    // Componente de loading centralizado
    if (isLoading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      );
    }

    // Verificar acceso
    const hasAccess = () => {
      // Verificar roles si se especificaron
      if (config.roles?.length) {
        const hasAllowedRole = config.roles.some((role) => hasRole(role));
        if (!hasAllowedRole) return false;
      }

      // Verificar permisos si se especificaron
      if (config.permissions?.length) {
        const hasAllPermissions = config.permissions.every((permission) =>
          hasPermission(permission)
        );
        if (!hasAllPermissions) return false;
      }

      // Verificar rutas si se especificaron
      if (config.paths?.length) {
        const canAccessAllPaths = config.paths.every((path) =>
          canAccessPath(path)
        );
        if (!canAccessAllPaths) return false;
      }

      return true;
    };

    // Si no tiene acceso, mostrar el fallback apropiado
    if (!hasAccess()) {
      const FallbackComponent = CustomFallback || Forbidden;
      return <FallbackComponent {...props} />;
    }

    // Si tiene acceso, mostrar el componente protegido
    return <WrappedComponent {...props} />;
  };
}
