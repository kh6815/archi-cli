import { axiosClient } from "../util/axiosClient";
import { AddFileReqDto, AddFileRes } from "./dto/file";
import { ResponseDto } from "./dto/responseDto";

const apiUrl = process.env.REACT_APP_API_URL;

export const postAddFile = async (
    fileReq: AddFileReqDto,
  ): Promise<ResponseDto<AddFileRes>> => {
    console.log('postAddFile');

    // FormData 객체 생성
    const formData = new FormData();
    formData.append('file', fileReq.file);

    const url = `${apiUrl}/file/add`;

    const res = await axiosClient.post<ResponseDto<AddFileRes>>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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