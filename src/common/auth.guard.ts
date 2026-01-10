import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

export interface AuthUser {
  username: string;
  role: 'admin' | 'trainer';
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const header: string | undefined = request.headers['authorization'];

    if (!header) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [username, role] = decoded.split(':');
    if (!username || (role !== 'admin' && role !== 'trainer')) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = { username, role } satisfies AuthUser;
    return true;
  }
}
