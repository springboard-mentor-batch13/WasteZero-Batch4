export type Role = 'volunteer' | 'ngo' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  skills: string[];
  location: string;
  bio: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: Role;
  location?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
