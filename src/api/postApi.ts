import { axiosClient } from "@util/axiosClient";
import { AddCommentReq, AddPostReqDto, DeletePostReq, GetCategoryListDto, GetPostReqDto, NoticeListDto, PopularPostDto, PostCommentListDto, PostDto, PostListDto, UpdateCommentLikeReq, UpdateCommentReq, UpdateContentLikeReq, UpdatePostReq } from "@api/dto/post";
import { ResponseDto, ResponsePaingDto } from "@api/dto/responseDto";

const apiUrl = process.env.REACT_APP_API_URL;

export const getCategoryList = async (
): Promise<ResponseDto<GetCategoryListDto>> => {
  console.log('getCategoryList');
  const url = `${apiUrl}/content/list/category`;
  const res = await axiosClient.get<ResponseDto<GetCategoryListDto>>(url);
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

export const GetPost = async (
  postId: number
): Promise<ResponseDto<PostDto>> => {
  console.log('GetPost');
  const url = `${apiUrl}/content/get/${postId}`;
  const res = await axiosClient.get<ResponseDto<PostDto>>(url);
  return res.data;
};

export const GetPostList = async (
  getPostReqDto: GetPostReqDto
): Promise<ResponsePaingDto<PostListDto[]>> => {
  console.log('GetPostList');
  const url = `${apiUrl}/content/list/${getPostReqDto.categoryId}`;
  const res = await axiosClient.get<ResponsePaingDto<PostListDto[]>>(url, {
    params: {
      page: getPostReqDto.page,
      size: getPostReqDto.size
    }
  });
  return res.data;
};

export const GetCommentList = async (
  contentId: number
): Promise<ResponseDto<PostCommentListDto[]>> => {
  console.log('GetCommentList');
  const url = `${apiUrl}/comment/list/${contentId}`;
  const res = await axiosClient.get<ResponseDto<PostCommentListDto[]>>(url);
  return res.data;
};

export const GetNoticeList = async (
): Promise<ResponseDto<NoticeListDto[]>> => {
  console.log('GetNoticeList');
  const url = `${apiUrl}/content/list/notice`;
  const res = await axiosClient.get<ResponseDto<NoticeListDto[]>>(url);
  return res.data;
};

export const GetPopularPostList = async (
): Promise<ResponseDto<PopularPostDto[]>> => {
  console.log('getPopularPostList');
  const url = `${apiUrl}/content/list/popular`;
  const res = await axiosClient.get<ResponseDto<PopularPostDto[]>>(url);
  return res.data;
};

export const postAddPost = async (
    addPostInfo: AddPostReqDto,
  ): Promise<ResponseDto<number>> => {
    console.log('postAddPost');
    const url = `${apiUrl}/content/add`;
    const res = await axiosClient.post<ResponseDto<number>>(url, addPostInfo);
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


export const postUpdateContentLike = async (
  updateContentLikeInfo: UpdateContentLikeReq,
): Promise<ResponseDto<Boolean>> => {
  console.log('postUpdateContentLike');
  const url = `${apiUrl}/content/like`;
  const res = await axiosClient.post<ResponseDto<Boolean>>(url, updateContentLikeInfo);
  return res.data;
};

export const postUpdateCommentLike = async (
  updateCommentLikeInfo: UpdateCommentLikeReq,
): Promise<ResponseDto<Boolean>> => {
  console.log('postUpdateCommentLike');
  const url = `${apiUrl}/comment/like`;
  const res = await axiosClient.post<ResponseDto<Boolean>>(url, updateCommentLikeInfo);
  return res.data;
};

export const postAddComment = async (
  addCommentReq: AddCommentReq,
): Promise<ResponseDto<number>> => {
  console.log('postAddComment');
  const url = `${apiUrl}/comment/add`;
  const res = await axiosClient.post<ResponseDto<number>>(url, addCommentReq);
  return res.data;
};

export const patchUpdateComment = async (
  updateCommentInfo: UpdateCommentReq,
): Promise<ResponseDto<Boolean>> => {
  console.log('postUpdateComment');
  const url = `${apiUrl}/comment/update`;
  const res = await axiosClient.patch<ResponseDto<Boolean>>(url, updateCommentInfo);
  return res.data;
};

export const deleteComment = async (
  commentId: number,
): Promise<ResponseDto<Boolean>> => {
  console.log('deleteComment');
  const url = `${apiUrl}/comment/delete/${commentId}`;
  const res = await axiosClient.delete<ResponseDto<Boolean>>(url);
  return res.data;
};

export const updatePost = async (
  updatePostReq: UpdatePostReq,
): Promise<ResponseDto<Boolean>> => {
  console.log('updatePost');

  // const formData = new FormData();

  // // Append JSON data to formData
  // const data = {
  //   categoryId: updatePostReq.categoryId,
  //   title: updatePostReq.title,
  //   content: updatePostReq.content,
  //   updateFileMap: updatePostReq.updateFileMap,    // 파일 업데이트용 맵
  //   deleteFileIdList: updatePostReq.deleteFileIdList // 삭제할 파일 ID 리스트
  // };

  // formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

  // // Append files to formData (if there are files to upload)
  // if (updatePostReq.addFileList.length > 0) {
  //   Array.from(updatePostReq.addFileList).forEach((file, index) => {
  //     formData.append('addFileList', file);
  //   });
  // }

  const url = `${apiUrl}/content/update`;
  // const res = await axiosClient.patch(url, formData, {
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //   },
  // });
  const res = await axiosClient.patch<ResponseDto<Boolean>>(url, updatePostReq);
  return res.data;
};

export const deletePost = async (
  deletePostReq: DeletePostReq,
): Promise<ResponseDto<Boolean>> => {
  console.log('deletePost');
  const url = `${apiUrl}/content/delete`;
  const res = await axiosClient.delete<ResponseDto<Boolean>>(url, {
    data: deletePostReq
  });
  return res.data;
};