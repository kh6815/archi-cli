
import { axiosClient } from "../util/axiosClient";
import { LoginDto, LoginReqDto, LogoutReqDto, OAuthLoginReqDto } from "./dto/auth";
import { ResponseDto } from "./dto/responseDto";

const apiUrl = process.env.REACT_APP_API_URL;

export const postLogin = async (
    loginUserInfo: LoginReqDto,
  ): Promise<ResponseDto<LoginDto>> => {
    console.log('postLogin');
    const url = `${apiUrl}/auth/login`;
    const res = await axiosClient.post<ResponseDto<LoginDto>>(url, loginUserInfo);
    return res.data;
    // const res: ResponseDto<LoginDto> = {
    //   header: {
    //     resultCode: 0,
    //     resultMessage: 'SUCCESS',
    //   },
    //   data: {
    //     id: 'kh6815',
    //     accessToken: 'accessToken',
    //     refreshToken: 'refreshToken',
    //   },
    //   errorData: null,
    // };
  
    // return res;
  };

  export const postOAuthLogin = async (
    oauthloginUserInfo: OAuthLoginReqDto,
  ): Promise<ResponseDto<LoginDto>> => {
    console.log('postpostOAuthLoginogin');
    const url = `${apiUrl}/auth/oauth-login`;
    const res = await axiosClient.post<ResponseDto<LoginDto>>(url, oauthloginUserInfo);
    return res.data;
  };

  export const postRefresh = async (
    refreshToken: string,
  ): Promise<ResponseDto<LoginDto>> => {
    console.log('postRefresh');
    const url = `${apiUrl}/auth/refresh`;
    const res = await axiosClient.post<ResponseDto<LoginDto>>(url, {
      headers: {
        Authorization: `${refreshToken}`,
      },
    });
    return res.data;
    // const res: ResponseDto<LoginDto> = {
    //   header: {
    //     resultCode: 200,
    //     resultMessage: 'SUCCESS',
    //   },
    //   data: {
    //     id: 'kh6815',
    //     accessToken: 'accessToken',
    //     refreshToken: 'refreshToken',
    //   },
    //   errorData: null,
    // };
  
    // return res;
  };
  
  export const postLogOut = async (
    logoutReqDto: LogoutReqDto,
  ): Promise<ResponseDto<LoginDto>> => {
    console.log('postLogout');
    const url = `${apiUrl}/auth/logout`;
    const res = await axiosClient.post<ResponseDto<LoginDto>>(url, logoutReqDto);
    return res.data;
    // const res: ResponseDto<LoginDto> = {
    //   header: {
    //     resultCode: 200,
    //     resultMessage: 'SUCCESS',
    //   },
    //   data: {
    //     id: 'kh6815',
    //     accessToken: '',
    //     refreshToken: '',
    //   },
    //   errorData: null,
    // };
  
    // return res;
  };