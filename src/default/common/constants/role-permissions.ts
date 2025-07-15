// src/auth/constants/role-permissions.ts
import { UserRoles } from '../../common/enums/role.enum';
import { Permission } from '../../common/enums/permission.enum';

export const ROLE_PERMISSIONS: Record<UserRoles, Permission[]> = {
  [UserRoles.Admin]: [
    Permission.ManageUsers,
    Permission.CreateDocument,
    Permission.ReadAnyDocument,
    Permission.UpdateAnyDocument,
    Permission.DeleteAnyDocument,
    Permission.UploadDocument,
    Permission.TriggerIngestion,
    Permission.ManageIngestionProcesses,
    Permission.ViewIngestionStatus,
  ],
  [UserRoles.Editor]: [
    Permission.CreateDocument,
    Permission.ReadAnyDocument, // Or just ReadOwnDocument if more restrictive
    Permission.UpdateOwnDocument,
    Permission.DeleteOwnDocument,
    Permission.UploadDocument,
    Permission.TriggerIngestion,
    Permission.ViewIngestionStatus,
  ],
  [UserRoles.Viewer]: [
    Permission.ReadAnyDocument,
    Permission.ViewIngestionStatus, // If viewers can see ingestion status
  ],
};
