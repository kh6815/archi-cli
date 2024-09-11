import { axiosClient } from "../util/axiosClient";
import { ResponseDto } from "./dto/responseDto";
import { SignUpReqDto, SignUpResDto } from "./dto/user";

const apiUrl = process.env.REACT_APP_API_URL;

export const getIdCheck = async (
  id: string,
): Promise<ResponseDto<boolean>> => {
  console.log('getIdCheck');

  const url = `${apiUrl}/user/check-id`;
  const res = await axiosClient.get<ResponseDto<boolean>>(url, {
    params: { id: id },
  });
  return res.data;
};

export const getEmailCheck = async (
    email: string,
  ): Promise<ResponseDto<boolean>> => {
    console.log('getEmailCheck');
  
    const url = `${apiUrl}/user/check-email`;
    const res = await axiosClient.get<ResponseDto<boolean>>(url, {
        params: { email: email },
      });
    return res.data;
};

export const getNickNameCheck = async (
    nickName: string,
  ): Promise<ResponseDto<boolean>> => {
    console.log('getNickNameCheck');
  
    const url = `${apiUrl}/user/check-nickname`;
    const res = await axiosClient.get<ResponseDto<boolean>>(url, {
        params: { nickName: nickName },
    });
    return res.data;
};

export const postSignUp = async (
  signUpInfo: SignUpReqDto,
): Promise<ResponseDto<SignUpResDto>> => {
  console.log('postSignUp');
  const url = `${apiUrl}/user/signup`;
  const res = await axiosClient.post<ResponseDto<SignUpResDto>>(url, signUpInfo);
  return res.data;
//   const res: ResponseDto<SignUpResDto> = {
//     header: {
//       resultCode: 0,
//       resultMessage: 'SUCCESS',
//     },
//     data: {
//       id: 'kkk',
//     },
//     errorData: null,
//   };

//   return res;
};
