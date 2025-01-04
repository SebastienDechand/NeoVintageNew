
export interface AdminCredentials {
  email: string;
  password: string;
}

export interface AdminResponse {
  token: string;
  admin: {
    email: string;
    firstname: string;
    lastname: string;
    role: string;
  };
}
