export interface SignUpReqDto {
  id: string;
  pw: string;
  pwCheck: string;
  email: string;
  nickName: string;
}

export interface SignUpResDto {
  id: string;
}
