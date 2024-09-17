export interface LoginReqDto {
  id: string;
  pw: string;
}

export interface LogoutReqDto {
  id: string;
}

export interface LoginDto {
  id: string;
  accessToken: string;
  refreshToken: string;
  role: string;
}

export const ROLETPYE = {
  ADMIN: "ADMIN",
  USER: "USER"
}