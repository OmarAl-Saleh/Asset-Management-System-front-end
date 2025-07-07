export interface User {
  id: number;
  username: string;
  role: string;
  isActive: boolean;
}

export interface CreateUserDto {
  username: string | null;
  password: string | null;
  role: string | null;
}
