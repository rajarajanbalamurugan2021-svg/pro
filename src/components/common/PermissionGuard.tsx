import React from 'react';
import { UserRole } from '../../types';
import { canAccessModule, normalizeRole } from '../../lib/rbac';
import { AccessDeniedPage } from './AccessDeniedPage';

interface PermissionGuardProps {
  userRole?: UserRole;
  allowedRoles?: UserRole[];
  moduleName?: string;
  checkPermission?: (role: string) => boolean;
  children: React.ReactNode;
  fallback?: 'access_denied' | 'null';
  onReturnHome?: () => void;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  userRole = 'student',
  allowedRoles,
  moduleName,
  checkPermission,
  children,
  fallback = 'access_denied',
  onReturnHome
}) => {
  const normRole = normalizeRole(userRole);

  // SuperAdmin always has full access
  if (normRole === 'super_admin') {
    return <>{children}</>;
  }

  let isAllowed = true;

  if (checkPermission) {
    isAllowed = checkPermission(normRole);
  } else if (allowedRoles && allowedRoles.length > 0) {
    const normAllowed = allowedRoles.map((r) => normalizeRole(r));
    isAllowed = normAllowed.includes(normRole);
  } else if (moduleName) {
    isAllowed = canAccessModule(normRole, moduleName);
  }

  if (!isAllowed) {
    if (fallback === 'null') {
      return null;
    }
    return (
      <AccessDeniedPage
        userRole={userRole}
        moduleName={moduleName || 'Restricted Module'}
        requiredRole={allowedRoles ? allowedRoles.map((r) => r.toUpperCase()).join(' / ') : undefined}
        onReturnHome={onReturnHome}
      />
    );
  }

  return <>{children}</>;
};
