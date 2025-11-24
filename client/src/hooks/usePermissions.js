import { useMemo } from "react";
import { useAuth } from "./useAuth";

/**
 * Custom hook for checking permissions
 */
export const usePermissions = () => {
  const { user, role } = useAuth();

  const hasPermission = useMemo(() => {
    return (resource, action) => {
      // Super admin has all permissions
      if (role === "super_admin") return true;

      // Admin and principal have all permissions
      if (role === "admin" || role === "principal") {
        // Check if user has permissions object
        if (user?.permissions) {
          const resourcePermissions = user.permissions[resource];
          if (resourcePermissions) {
            return resourcePermissions[action] === true;
          }
        }
        // Default: admins and principals have all permissions
        return true;
      }

      // Students can only view their own data
      if (role === "student") {
        if (
          resource === "profile" ||
          resource === "courses" ||
          resource === "sports" ||
          resource === "attendance" ||
          resource === "results" ||
          resource === "library"
        ) {
          return action === "view";
        }
        return false;
      }

      // Teachers can manage their classes
      if (role === "teacher") {
        if (resource === "attendance" || resource === "results") {
          return ["view", "create", "edit"].includes(action);
        }
        if (resource === "notices") {
          return ["view", "create"].includes(action);
        }
        return false;
      }

      // Coaches can manage their sports
      if (role === "coach") {
        if (resource === "sports" || resource === "participants") {
          return ["view", "edit"].includes(action);
        }
        return false;
      }

      return false;
    };
  }, [user, role]);

  const canView = (resource) => hasPermission(resource, "view");
  const canCreate = (resource) => hasPermission(resource, "create");
  const canEdit = (resource) => hasPermission(resource, "edit");
  const canDelete = (resource) => hasPermission(resource, "delete");

  return {
    hasPermission,
    canView,
    canCreate,
    canEdit,
    canDelete,
    role,
    isAdmin: role === "admin" || role === "principal" || role === "super_admin",
    isStudent: role === "student",
    isTeacher: role === "teacher",
    isCoach: role === "coach",
  };
};

export default usePermissions;
