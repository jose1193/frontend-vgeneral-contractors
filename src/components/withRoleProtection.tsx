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

export function withRoleProtection<P extends object>(
  WrappedComponent: ComponentType<P>,
  config: ProtectionConfig,
  CustomFallback?: ComponentType<P>
) {
  return function WithRoleProtection(props: P) {
    const { hasRole, hasPermission, canAccessPath, isLoading, userRole } =
      useRoleCheck();

    // Si el rol del usuario aún no se ha cargado, mostrar loading
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
      // Si no hay rol de usuario, no tiene acceso
      if (!userRole) return false;

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

    // Renderizar el layout de la página siempre, pero con el contenido apropiado
    return (
      <Box sx={{ width: "100%", minHeight: "100vh" }}>
        {hasAccess() ? (
          <WrappedComponent {...props} />
        ) : (
          <Box sx={{ pt: 4 }}>
            {CustomFallback ? <CustomFallback {...props} /> : <Forbidden />}
          </Box>
        )}
      </Box>
    );
  };
}
