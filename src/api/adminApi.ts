import { axiosClient } from "../util/axiosClient";
import { AddCategoryReq, AddNoticeReq, GetAdminCategoryListDto, UpdateCategoryReq } from "./dto/admin";
import { ResponseDto } from "./dto/responseDto";

const apiUrl = process.env.REACT_APP_API_URL;

export const getAdminCategoryList = async (
  ): Promise<ResponseDto<GetAdminCategoryListDto>> => {
    console.log('getAdminCategoryList');
    const url = `${apiUrl}/admin/category/list`;
    const res = await axiosClient.get<ResponseDto<GetAdminCategoryListDto>>(url);
    return res.data;
  };

export const addCategory = async (
    addCategoryReq: AddCategoryReq
  ): Promise<ResponseDto<Boolean>> => {
    console.log('AddCategory');
    const url = `${apiUrl}/admin/category/add`;
    const res = await axiosClient.post<ResponseDto<Boolean>>(url, addCategoryReq);
    return res.data;
  };

export const updateCategory = async (
  updateCategoryReq: UpdateCategoryReq
  ): Promise<ResponseDto<Boolean>> => {
    console.log('AddCategory');
    const url = `${apiUrl}/admin/category/update/category-name`;
    const res = await axiosClient.patch<ResponseDto<Boolean>>(url, updateCategoryReq);
    return res.data;
};

export const deleteCategory = async (
  id: number
): Promise<ResponseDto<Boolean>> => {
  console.log('DeleteCategory');

  const url = `${apiUrl}/admin/category/delete`;
  const res = await axiosClient.delete<ResponseDto<Boolean>>(url, {
    params: { id: id },
  });
  return res.data;
};

export const postAddNotice = async (
  addNoticeReq: AddNoticeReq
): Promise<ResponseDto<number>> => {
  console.log('addNotice');
  const url = `${apiUrl}/admin/notice/add`;
  const res = await axiosClient.post<ResponseDto<number>>(url, addNoticeReq);
  return res.data;
};
