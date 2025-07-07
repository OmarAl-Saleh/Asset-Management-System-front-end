export interface ApiResponse<T> {
  obj: T;
  code: number;
  strMessage: string;
}
