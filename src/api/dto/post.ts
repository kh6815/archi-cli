import { CategoryDto } from "./admin";
import { AddFileRes } from "./file";

export interface AddPostReqDto {
    categoryId: number;
    title: string;
    content: string;
    imgFileIdList: number[];
  }
  

//   export interface InitPwReqDto {
//     id: string;
//   }

// export interface ContentPagingReqDto {
//   page: number;
//   size: number;
//   sort: string[];
// }

export interface GetPostReqDto {
  categoryId: number;
  page: number;
  size: number;
}

export interface PostDto {
  id: number;
  categoryName: string;
  // delYn: string;
  title: string;
  content: string;
  updatedAt: string;
  isAvailableUpdate: number;
  contentAuthorNickName: string;
  contentAuthorImgUrl: string;
  like: number;
  likeUserIds: string[];
  fileList: AddFileRes[];
}

export interface PostCommentListDto {
  id: number;
  parentCommentId: number;
  comment: string;
  delYn: string;
  userNickName: string;
  sendUserNickName: string;
  commentAuthorImgUrl: string;
  createdAt: string;
  updatedAt: string;
  like: number;
  likeUserIds: string[];
  isContentAuthor: boolean; // 컨텐츠 작성자 댓글인지
  isWriteUser: boolean; // 현재 접속한 유저가 수정할 수 있는 댓글인지
  children: PostCommentListDto[];
}

export interface PostListDto {
  id: number;
  categoryName: string;
  title: string;
  content: string;
  updatedAt: string;
  like: number;
  imgUrl: string;
}

export interface NoticeDto {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
  isAvailableUpdate: number;
  noticeAuthorNickName: string;
  noticeAuthorImgUrl: string;
  fileList: AddFileRes[];
}

export interface NoticeListDto {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
  imgUrl: string;
}

export interface PopularPostDto {
  id: number;
  categoryName: string;
  title: string;
  content: string;
  updatedAt: string;
  like: number;
  imgUrl: string;
}

export interface UpdateContentLikeReq {
  contentId: number;
}

export interface UpdateCommentLikeReq {
  commentId: number;
}

export interface UpdatePostReq {
  id: number,
  categoryId: number,
  title: string,
  content: string
  addFileIdList: number[]
  updateFileMap: Record<number, string>
  deleteFileIdList: number[]
}

export interface DeletePostReq {
  ids: number[];
}

export interface AddCommentReq{
  contentId: number,
  parentId: number,
  comment: string,
  sendUserNickName: string
}

export interface UpdateCommentReq {
  commentId: number;
  comment: string;
}

export interface DeleteCommentReq {
  ids: number[];
}
  
//   export interface InitPwResDto {
//     message: string;
//     isSuccess: Boolean;
//   }

export interface GetCategoryListDto {
  categoryList: CategoryDto[]
}

export interface UserCommentDto {
  id: number;
  contentId: number;
  contentTitle: string;
  comment: string;
  createAt: string;
  updateAt: string;
  like: number;
}