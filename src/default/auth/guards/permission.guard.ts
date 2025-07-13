import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSION_KEY } from "src/default/common/decorators/permissions.decorator";
import { Permission } from "src/default/common/enums/permission.enum";
import { AuthenticatedUser } from "src/default/common/interfaces/authenticated-user.interface";

@Injectable()
export class PermissionGuard implements CanActivate{
    constructor(private reflactor: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const reQuiredPermissions = this.reflactor.getAllAndOverride<Permission[]>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if(!reQuiredPermissions) {
            return true; // No specific permissions required for this route, allow access
        }

        const { user } = context.switchToHttp().getRequest<{user: AuthenticatedUser}>();

        if(!user || !user.permissions) {
            throw new ForbiddenException('user permissions not found: authentication required.');
        }

        // check if the user has all required permisisons or not 
        const hasAllRequiredPermissions = reQuiredPermissions.every((permission) => user.permissions.includes(permission));

        if(!hasAllRequiredPermissions) {
            throw new ForbiddenException('You do not have sufficient permissions to access this resource.');
        }

        return true;
    }
}