/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { css } from '@emotion/react';
import { patchUpdateComment } from '../../../api/postApi';
import { useMutation } from '@tanstack/react-query';
import { PostCommentListDto, UpdateCommentReq } from '../../../api/dto/post';
import { AxiosError } from 'axios';

// Props 타입 정의
interface CommentUpdateProps {
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

const textareaStyle = css`
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  box-sizing: border-box; /* Ensure padding and border are included in the total width */
  resize: vertical; /* Allow vertical resizing */
  height: 100px; /* Initial height for the textarea */
`;

const buttonContainerStyle = css`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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

const CommentUpdate: React.FC<CommentUpdateProps> = ({ comment, close }) => {
  const [commentValue, setCommentValue] = useState<string>(comment.comment);

  const patchCommentApi = async (updateCommentInfo: UpdateCommentReq) => {
    const res = await patchUpdateComment(updateCommentInfo);
    return res;
  }

  const { mutate: patchCommentMutate } = useMutation({
    mutationFn: patchCommentApi,
    onSuccess: (mutateData) => {
      if (mutateData.header.resultCode === 0) {
        close(true);
      } else {
        alert(mutateData.header.resultMessage);
      }
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 400) {
        alert("댓글 업데이트 실패");
      } else {
        alert("서버 오류 발생");
      }
    },
  });

  return (
    <div css={modalStyle}>
      <h2 css={titleStyle}>댓글 수정</h2>
      <textarea
        placeholder="댓글을 입력하세요"
        value={commentValue}
        onChange={(e) => setCommentValue(e.target.value)}
        css={textareaStyle}
      />
      <div css={buttonContainerStyle}>
        <button
          onClick={() => {
            patchCommentMutate({
              commentId: comment.id,
              comment: commentValue
            });
          }}
          css={buttonStyle}
        >
          수정
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

export default CommentUpdate;
