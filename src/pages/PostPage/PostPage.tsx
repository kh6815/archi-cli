/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

const postPageStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  min-height: 100vh;
  background-color: #f4f4f4;
`;

const postContainerStyle = css`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 800px;
  padding: 20px;
  margin: 20px 0;
`;

const postTitleStyle = css`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const postContentStyle = css`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 30px;
`;

const commentSectionStyle = css`
  width: 100%;
  margin-top: 40px;
  border-top: 1px solid #ddd;
  padding-top: 20px;
`;

const commentStyle = css`
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const PostPage: React.FC = () => {
  return (
    <>
      <div css={postPageStyle}>
        <div css={postContainerStyle}>
          <h1 css={postTitleStyle}>게시글 제목</h1>
          <div css={postContentStyle}>
            여기에 게시글 내용이 들어갑니다. 긴 내용도 잘 보여지도록 설정되어 있습니다.
          </div>
          <div css={commentSectionStyle}>
            <h3>댓글</h3>
            <div css={commentStyle}>첫 번째 댓글</div>
            <div css={commentStyle}>두 번째 댓글</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostPage;
