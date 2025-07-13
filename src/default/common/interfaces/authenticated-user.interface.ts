import { Permission } from '../enums/permission.enum';

export interface AuthenticatedUser {
  sub: string;
  username: string;
  roles: string[]; // Array of role names, e.g., ['admin', 'editor']
  permissions: Permission[]; // Array of permission names, e.g., ['manage:users', 'read:any_document']
}
