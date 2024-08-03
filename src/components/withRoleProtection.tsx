// components/withRoleProtection.tsx
import { ComponentType } from "react";
import { useRoleCheck } from "../hooks/useRoleCheck";

export function withRoleProtection<P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles: string[]
) {
  return function WithRoleProtection(props: P) {
    const { checkAccess } = useRoleCheck();

    if (!checkAccess(allowedRoles)) {
      return null; // O un componente de acceso denegado
    }

    return <WrappedComponent {...props} />;
  };
}
