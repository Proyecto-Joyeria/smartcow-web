export type UserRole = 'OPERATOR' | 'VET' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  farmId: string;
  twoFactorEnabled: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  farmName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
  requiresTwoFactor?: boolean;
}

export interface TwoFASetupResponse {
  qrCodeUrl: string;
  secret: string;
}

export interface TwoFAVerifyRequest {
  code: string;
}
