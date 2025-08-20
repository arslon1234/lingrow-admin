declare interface LoginResponse {
  token: string;
  refreshToken: string;
  user: UserAuth;
}