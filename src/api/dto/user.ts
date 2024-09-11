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

export interface SignUpResDto {
  id: string;
}

export interface InitPwResDto {
  message: string;
  isSuccess: Boolean;
}
