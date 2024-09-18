export interface SignUpReqDto {
  id: string;
  pw: string;
  pwCheck: string;
  email: string;
  nickName: string;
}

export interface InitPwReqDto {
  id: string;
}

export interface ChangePasswordReq{
  beforePassword: string;
  newPassword: string;
  checkPassword: string;
}

export interface ChangeNickNameReq{
  newNickName: string;
}

export interface ChangeProfileImageReq{
  fileId: number;
}

export interface SignUpResDto {
  id: string;
}

export interface InitPwResDto {
  message: string;
  isSuccess: Boolean;
}