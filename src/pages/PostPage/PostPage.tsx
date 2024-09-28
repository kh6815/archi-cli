/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GetCommentList, GetPost, postUpdateCommentLike, postUpdateContentLike } from '@api/postApi';
import { useMutation } from '@tanstack/react-query';
import { PostCommentListDto, PostDto, UpdateCommentLikeReq, UpdateContentLikeReq } from '@api/dto/post';
import { AxiosError } from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Folder as FolderIcon, Delete as DeleteIcon, Edit as EditIcon, ExpandLess, ExpandMore, Add as AddIcon } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import { useRecoilState } from 'recoil';
import { userAtom } from '@stores/user';
import Modal from '@components/Modal';
import CommentUpdate from '@pages/PostPage/components/CommentUpdate';
import CommentDelete from '@pages/PostPage/components/CommentDelete';
import PostDelete from '@pages/PostPage/components/PostDelete';
import PostUpdate from './components/PostUpdate';
import CommentAdd from './components/CommenAdd';

const postPageStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 40px 20px;
  min-height: 100vh;
  background-color: #f7f7f7;
`;

const postContainerStyle = css`
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 900px;
  padding: 30px;
  margin: 30px 0;
`;

const postInfoStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
  color: #777;
`;

const postInfoImgStyle = css`
  width: 24px;
  height: 24px;
  border-radius: 8px;

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
`;

const postInfoUserContanierStyle = css`
  display: flex;
  flex-direction: flex-start;
  align-items: center;
  justify-content: flex-start;
`

const postInfoTextStyle = css`
  margin-left: 5px;
  font-size: 15px;
`

const postContentAuthorTextStyle = css`
  margin-left: 5px;
  font-size: 15px;
  color: green;
`

const postInfoDateTextStyle = css`
  font-size: 12px;
`

const postMenuStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
`;

const postMenuLikeStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #f06292;
  cursor: pointer;
  svg {
    font-size: 2rem;
  }
`;

const postMenuSettingStyle = css`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #777;
  cursor: pointer;

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;
  }

  span:hover {
    color: #424242;
  }
`;

const postCategoryStyle = css`
  font-size: 1.1rem;
  font-weight: 500;
  margin-right: 10px;
  color: #424242;
`;

const postTitleStyle = css`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 25px;
  color: #333;
`;

const postContentStyle = css`
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 40px;
  color: #444;

  img {
    max-width: 100%;
  }
`;

const commentSectionStyle = css`
  width: 100%;
  margin-top: 50px;
  border-top: 1px solid #ddd;
  padding-top: 20px;

  h3 {
    font-size: 1.6rem;
    font-weight: 600;
    color: #333;
  }
`;

const commentContainerStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fafafa;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const subCommentContainerStyle = css`
  display: flex;
  flex-direction: column;
  margin-left: 30px;
  margin-bottom: 15px;
  padding: 12px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const commentMenuStyle = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #777;
  svg {
    font-size: 1.3rem;
    cursor: pointer;
  }
  svg:hover {
    color: #f06292;
  }
`;

const commentInfoStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #555;
`;

const commentInfoUserContanierStyle = css`
  display: flex;
  flex-direction: flex-start;
  align-items: center;
  justify-content: flex-start;
`

const commentInfoImgStyle = css`
  width: 24px;
  height: 24px;
  border-radius: 8px;

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
`;

const commentInfoTextStyle = css`
  margin-left: 5px;
  font-size: 15px;
`
const commentInfoDateTextStyle = css`
  font-size: 12px;
`

const sendUserNickNameStyle = css`
  display: flex;
  padding-left: 5px;
  font-size: 1rem;
  color: blue;
  text-decoration: underline;
`;

const commentStyle = css`
  display: flex;
  padding-left: 5px;
  font-size: 1rem;
  color: #555;
`;

const commentfooterStyle = css`
  display: flex;
  align-items: end;
  justify-content: flex-start;

  div {
    margin-right: 10px;
  }
`

const commentMenuLikeStyle = css`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  color: #f06292;
  svg {
    margin-right: 5px;
  }
`;

const commentMenuLikeDivStyle = css`
  margin-left: 5px;
`;

const deleteTextStyle = css`
  color: red;
`

export interface SelectClickComment {
  commentParentId: number;
  sendUserName: string;
}

const PostPage: React.FC = () => {
  const [post, setPost] = useState<PostDto>();
  const [commentList, setCommentList] = useState<PostCommentListDto[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [userState, setUserState] = useRecoilState(userAtom);
  const [selectComment, setSelectComment] = useState<PostCommentListDto>();
  const [selectClickComment, setSelectClickComment] = useState<SelectClickComment>();

  const [isUpdatePostModalOpen, setIsUpdatePostModalOpen] = useState(false);
  const closeUpdatePostModal = () => setIsUpdatePostModalOpen(false);

  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const closeDeletePostModal = () => setIsDeletePostModalOpen(false);

  const [isAddCommentModalOpen, setIsAddCommentModalOpen] = useState(false);
  const closeAddCommentModal = () => setIsAddCommentModalOpen(false);

  const [isUpdateCommentModalOpen, setIsUpdateCommentModalOpen] = useState(false);
  const closeUpdateCommentModal = () => setIsUpdateCommentModalOpen(false);

  const [isDeleteCommentModalOpen, setIsDeleteCommentModalOpen] = useState(false);
  const closeDeleteCommentModal = () => setIsDeleteCommentModalOpen(false);

  const getPostApi = async (postId: number) => {
    const res = await GetPost(postId);
    return res;
  }
  
  const { mutate: getPostMutate } = useMutation(
  {
    mutationFn: getPostApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        const data = mutateData.data;

        setPost(data);
        getCommentListMutate(data.id);
      } else if(mutateData.header.resultCode === 2001) {
        alert("삭제되었거나, 존재하지 않는 게시글입니다.");
        navigate('/');
      } else {
        alert(mutateData.header.resultMessage);
      }
    },
    onError: (error: AxiosError) => {
        if (error.response?.status === 400) {
            alert("게시글 조회 실패");
          } else {
            alert("서버 오류 발생");
          }
    },
  },
  );

  const getCommentListApi = async (postId: number) => {
    const res = await GetCommentList(postId);
    return res;
  }
  
  const { mutate: getCommentListMutate } = useMutation(
  {
    mutationFn: getCommentListApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        const data = mutateData.data;

        setCommentList(data);
      } else {
        alert(mutateData.header.resultMessage);
      }
    },
    onError: (error: AxiosError) => {
        if (error.response?.status === 400) {
            alert("댓글 조회 실패");
          } else {
            alert("서버 오류 발생");
          }
    },
  },
  );

  const postUpdateContentLikeApi = async (updateContentLikeInfo: UpdateContentLikeReq) => {
    const res = await postUpdateContentLike(updateContentLikeInfo);
    return res;
  }
  
  const { mutate: postUpdateContentLikeMutate } = useMutation(
  {
    mutationFn: postUpdateContentLikeApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        const data = mutateData.data;

        if(userState.id !== null && post !== undefined) {
          if(post.likeUserIds.includes(userState.id)){
            const newLikeUserIds = post.likeUserIds.filter((e) => e !== userState.id);
            post.likeUserIds = newLikeUserIds;
            --post.like;
          } else {
            post.likeUserIds.push(userState.id);
            ++post.like;
          }
        }
      } else {
        alert(mutateData.header.resultMessage);
      }
    },
    onError: (error: AxiosError) => {
        if (error.response?.status === 400) {
            alert("게시글 좋아요 업데이트 실패");
          } else {
            alert("서버 오류 발생");
          }
    },
  },
  );

  const postUpdateCommentLikeApi = async (updateCommentLikeInfo: UpdateCommentLikeReq) => {
    const res = await postUpdateCommentLike(updateCommentLikeInfo);
    return res;
  }
  
  const { mutate: postUpdateCommentLikeMutate } = useMutation(
  {
    mutationFn: postUpdateCommentLikeApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        const data = mutateData.data;

        if(userState.id !== null && selectComment !== undefined){
          findSelectComment(commentList, selectComment.id);
        }

      } else {
        alert(mutateData.header.resultMessage);
      }
    },
    onError: (error: AxiosError) => {
        if (error.response?.status === 400) {
            alert("게시글 좋아요 업데이트 실패");
          } else {
            alert("서버 오류 발생");
          }
    },
  },
  );

  const findSelectComment = (commentList:PostCommentListDto[], findCommentId: number) => {
    // 댓글은 1뎁스 까지 밖에 없음   
    commentList.forEach((comment) => {
      if(comment.id === findCommentId){
        if(userState.id !== null){
          if(comment.likeUserIds.includes(userState.id)){
            const newLikeUserIds = comment.likeUserIds.filter((e) => e !== userState.id);
            comment.likeUserIds = newLikeUserIds;
            --comment.like;
          } else {
            comment?.likeUserIds.push(userState!.id);
            ++comment.like;
          }
        }
        return;
      }

      if(comment.children.length > 0){
        findSelectComment(comment.children, findCommentId);
      }
    })
  }

  const RenderCommentList: React.FC<{ commentList: PostCommentListDto[], depth: number}> = ({ commentList, depth }) => {
    return (
       <>
          {commentList.map(comment => (
             <React.Fragment key={comment.id}>
              <div css={depth === 1 ? commentContainerStyle : subCommentContainerStyle}>
                {
                  comment.isWriteUser && comment.delYn === 'N' &&
                  <div css = {commentMenuStyle}>
                    <span onClick={() => {
                      handleUpdateComment(comment)
                    }}><EditIcon /></span>
                    <span onClick={() => {
                      handleDeleteComment(comment)
                    }}><DeleteIcon /></span>
                  </div>
                }
                <div css={commentInfoStyle}>
                  {/* <div>작성자 : {comment.userNickName}</div>
                  <div>{comment.updatedAt}</div> */}
                  <div css={commentInfoUserContanierStyle}>
                    {comment.commentAuthorImgUrl === null && <div css={commentInfoImgStyle}><PersonIcon /></div>}
                    {comment.commentAuthorImgUrl !== null && <div css={commentInfoImgStyle}><img src={comment.commentAuthorImgUrl} /></div>}
                    <div css={postInfoTextStyle}>{comment.userNickName}</div>
                    {comment.isContentAuthor && <div css={postContentAuthorTextStyle}>[작성자]</div>}
                  </div>
                  <div css={postInfoDateTextStyle}>{comment.updatedAt}</div>
                </div>
                {depth !== 1 && comment.sendUserNickName !== null && <div css={sendUserNickNameStyle}>@{comment.sendUserNickName}</div>}
                <div css={[commentStyle, comment.delYn === "Y" ? deleteTextStyle : {}]}>{comment.comment}</div>
                <div css={commentfooterStyle}>
                  <div css={commentMenuLikeStyle} onClick={() => handleCommentLike(comment)}>
                    {userState.id === null && <FavoriteBorderIcon />}
                    {userState.id !== null && comment.likeUserIds.includes(userState.id) && <FavoriteIcon />}
                    {userState.id !== null && !comment.likeUserIds.includes(userState.id) && <FavoriteBorderIcon />}
                    <div css={commentMenuLikeDivStyle}>{comment.like}</div>
                  </div>
                  {userState.id !== null && !comment.isWriteUser && <span onClick={() => {
                    let sendUserName = "";
                    let parentCommentId = -1;
                    if(depth === 1){
                      sendUserName = comment.userNickName;
                      parentCommentId = comment.id;
                    } else {
                      sendUserName = comment.userNickName;
                      parentCommentId = comment.parentCommentId;
                    }
                    handleAddComment(parentCommentId, sendUserName);
                  }}>답글쓰기</span>}
                </div>
                {/* {userState.id !== null && depth === 1 && <span onClick={() => {handleAddComment(comment.id)}}><AddIcon /></span>} */}
              </div>
              {comment.children.length > 0 && <RenderCommentList commentList={comment.children} depth={depth + 1}/>}
              </React.Fragment>
          ))} 
      </>
    );
}

  const handleContentLike = () => {
    if(post?.id !== undefined){
      const contentLikeReq:UpdateContentLikeReq = {
        contentId: post?.id
      }
      postUpdateContentLikeMutate(contentLikeReq);
    }
  }

  const handleCommentLike = (comment: PostCommentListDto) => {
    const commentLikeReq: UpdateCommentLikeReq = {
      commentId: comment.id
    }
    setSelectComment(comment);
    postUpdateCommentLikeMutate(commentLikeReq);
  }

  const handleUpdatePost = () => {
    setIsUpdatePostModalOpen(true)
  }

  const handleDeletePost = () => {
    setIsDeletePostModalOpen(true)
  }

  const handleAddComment = (commentParentId: number, sendUserName: string) => {
    setSelectClickComment({
      commentParentId: commentParentId,
      sendUserName: sendUserName,
    })
    setIsAddCommentModalOpen(true)
  }

  const handleUpdateComment = (comment: PostCommentListDto) => {
    setSelectComment(comment)
    setIsUpdateCommentModalOpen(true)
  }

  const handleDeleteComment = (comment: PostCommentListDto) => {
    setSelectComment(comment)
    setIsDeleteCommentModalOpen(true)
  }

  useEffect(() => {
    if (location.pathname.includes('/post')) {
      const postIdStr = location.pathname.split('/post/')[1];
      getPostMutate(Number(postIdStr));
    }
  }, [ location ])
  return (
    <>{
      post !== undefined && 
      <>
        <div css={postPageStyle}>
          <div css={postContainerStyle}>
            <div css={postInfoStyle}>
              <div css={postInfoUserContanierStyle}>
                {post.contentAuthorImgUrl === null && <div css={postInfoImgStyle}><PersonIcon /></div>}
                {post.contentAuthorImgUrl !== null && <div css={postInfoImgStyle}><img src={post.contentAuthorImgUrl} /></div>}
                <div css={commentInfoTextStyle}>{post.contentAuthorNickName}</div>
              </div>
              <div css={commentInfoDateTextStyle}>{post.updatedAt}</div>
            </div>
            <div css = {postMenuStyle}>
              <div css={postCategoryStyle}>카테고리 &gt; {post?.categoryName}</div>
              <div>
                {post.isAvailableUpdate && <>
                  <span onClick={handleUpdatePost}><EditIcon /></span>
                  <span onClick={handleDeletePost}><DeleteIcon /></span>
                </>}
              </div>
            </div>
            <h1 css={postTitleStyle}>{post?.title}</h1>
            <div css={postContentStyle} dangerouslySetInnerHTML={{ __html: post!.content }}></div>
            {/* {post.delYn === "Y" && <div css={[postContentStyle, deleteTextStyle]}>{post.content}</div>} */}
            <div css={postMenuLikeStyle} onClick={handleContentLike}>
              {userState.id === null && <FavoriteBorderIcon />}
              {userState.id !== null && post.likeUserIds.includes(userState.id) && <FavoriteIcon />}
              {userState.id !== null && !post.likeUserIds.includes(userState.id) && <FavoriteBorderIcon />}
              <span>{post.like}</span>
            </div>
          </div>
          <div css={commentSectionStyle}>
            <h3>댓글</h3>
            {userState.id !== null && <span onClick={() => {handleAddComment(0, post.contentAuthorNickName)}}><AddIcon /></span>}
            <RenderCommentList commentList={commentList} depth={1}/>
          </div>
        </div>
        <Modal isOpen={isUpdatePostModalOpen} onClose={closeUpdatePostModal}>
            <PostUpdate postData={post} close={(isSuccess: boolean) => {
              if(isSuccess){
                alert("게시글이 수정되었습니다.");
                getPostMutate(post.id);
              }
              closeUpdatePostModal()
            }}/>
        </Modal>
        <Modal isOpen={isDeletePostModalOpen} onClose={closeDeletePostModal}>
            <PostDelete post={post} close={(isSuccess: boolean) => {
              if(isSuccess){
                alert("게시글이 삭제되었습니다.");
                navigate('/');
              }
              closeDeletePostModal()
            }}/>
        </Modal>
        {
          selectClickComment &&         
          <Modal isOpen={isAddCommentModalOpen} onClose={closeAddCommentModal}>
            <CommentAdd postId={post.id} selectClickComment={selectClickComment} close={(isSuccess: boolean) => {
              if(isSuccess){
                getCommentListMutate(post.id)
              }
              closeAddCommentModal()
            }}/>
          </Modal>
        }
        { selectComment !== undefined &&         
        <>
          <Modal isOpen={isUpdateCommentModalOpen} onClose={closeUpdateCommentModal}>
            <CommentUpdate comment={selectComment} close={(isSuccess: boolean) => {
              if(isSuccess){
                getCommentListMutate(post.id)
              }
              closeUpdateCommentModal()
            }}/>
          </Modal>
          <Modal isOpen={isDeleteCommentModalOpen} onClose={closeDeleteCommentModal}>
            <CommentDelete comment={selectComment} close={(isSuccess: boolean) => {
              if(isSuccess){
                getCommentListMutate(post.id)
              }
              closeDeleteCommentModal()
            }}/>
          </Modal>
        </>
        }
      </>}
    </>
  )
}

export default PostPage;
