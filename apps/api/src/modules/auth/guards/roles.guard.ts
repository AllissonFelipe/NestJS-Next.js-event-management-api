import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_HIERARCHY, ROLES_KEY } from '../decorators/roles.decorator';
import { PersonRoleEnum } from '../../person-role/domain/person-role.enum';
import { AuthRequest } from '../types/auth-request';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<PersonRoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const userRole = request.user?.role;

    if (!userRole) {
      throw new ForbiddenException('Role não encontrada');
    }

    // pega o MENOR nível exigido pela rota
    const minRequiredLevel = Math.min(
      ...requiredRoles.map((role) => ROLE_HIERARCHY[role]),
    );

    const userLevel = ROLE_HIERARCHY[userRole];
    if (!ROLE_HIERARCHY[userRole]) {
      throw new ForbiddenException('Role inválida');
    }

    if (userLevel < minRequiredLevel) {
      throw new ForbiddenException('Acesso negado');
    }

    return true;
  }
}
