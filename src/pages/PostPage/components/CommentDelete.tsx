/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { deleteComment } from '../../../api/postApi';
import { useMutation } from '@tanstack/react-query';
import { DeleteCommentReq, PostCommentListDto } from '../../../api/dto/post';
import { AxiosError } from 'axios';

// Props 타입 정의
interface CommentDeleteProps {
    comment: PostCommentListDto;
    close: (isSuccess: boolean) => void;
}

const modalStyle = css`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
  z-index: 1000;
`;

const titleStyle = css`
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const commentStyle = css`
  margin: 0;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
`;

const buttonContainerStyle = css`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const buttonStyle = css`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #fff;
  background: #007bff;
  transition: background 0.3s;
  
  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #d6d6d6;
    cursor: not-allowed;
  }
`;

const secondaryButtonStyle = css`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #fff;
  background: #6c757d;
  transition: background 0.3s;
  
  &:hover {
    background: #5a6268;
  }
`;

const CommentDelete: React.FC<CommentDeleteProps> = ({ comment, close }) => {
  const deleteCommentApi = async (deleteCommentReq: DeleteCommentReq) => {
    const res = await deleteComment(deleteCommentReq);
    return res;
  }
  
  const { mutate: deleteCommentMutate } = useMutation({
    mutationFn: deleteCommentApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        close(true);
      } else {
        alert(mutateData.header.resultMessage);
      }
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 400) {
        alert("댓글 삭제 실패");
      } else {
        alert("서버 오류 발생");
      }
    },
  });

  return (
    <div css={modalStyle}>
      <h2 css={titleStyle}>댓글 삭제</h2>
      <div css={commentStyle}>{comment.comment}</div>
      <div css={buttonContainerStyle}>
        <button
          onClick={() => deleteCommentMutate({
            ids: [comment.id]
          })}
          css={buttonStyle}
        >
          삭제
        </button>
        <button
          onClick={() => close(false)}
          css={secondaryButtonStyle}
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default CommentDelete;
