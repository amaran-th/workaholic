export interface MemberSession {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    phone?: string | null;
    confirmed_at?: string | null;
    role?: string;
    // 필요에 따라 추가 필드
  };
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
  centerX: number;
  centerY: number;
  createdAt: string;
  updatedAt: string;
}

export interface ErrorResponse {
  error: string;
}
