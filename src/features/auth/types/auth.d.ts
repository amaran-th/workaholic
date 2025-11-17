export interface MemberSession {
  id: string;
  email: string;
  name: string | null;
}

export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

export interface SignupResponse {
  id: string;
  email: string;
  name?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ErrorResponse {
  error: string;
}
