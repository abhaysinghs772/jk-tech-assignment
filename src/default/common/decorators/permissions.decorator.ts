import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permissions';
export const Permissions = (...permisisons: string[]) =>
  SetMetadata(PERMISSION_KEY, permisisons);
