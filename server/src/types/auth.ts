export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  session: {
    token: string;
  };
}

export interface SignUpRequest extends AuthCredentials {
  name: string;
}

export interface SignInRequest extends AuthCredentials {}
