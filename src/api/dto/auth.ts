export interface LoginReqDto {
  id: string;
  pw: string;
}

export interface OAuthLoginReqDto {
  snsType: string;
  providerId: string;
  email: string;
  name: string;
}

export interface LogoutReqDto {
  id: string;
}

export interface LoginDto {
  id: string;
  accessToken: string;
  refreshToken: string;
  role: string;
  imgUrl: string;
  nickName: string;
}

export const ROLETPYE = {
  ADMIN: "ADMIN",
  USER: "USER"
}

export const SNSTPYE = {
  GOOGLE: "GOOGLE",
}