import { Injectable, UnauthorizedException } from '@nestjs/common';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: 'admin' | 'trainer';
}

const USERS = [
  { username: 'admin', password: 'admin123', role: 'admin' as const },
  { username: 'trainer', password: 'trainer123', role: 'trainer' as const },
];

@Injectable()
export class AuthService {
  login(payload: LoginPayload): AuthResponse {
    const user = USERS.find(
      (entry) =>
        entry.username === payload.username &&
        entry.password === payload.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = Buffer.from(`${user.username}:${user.role}`).toString(
      'base64',
    );

    return { token, role: user.role };
  }
}
