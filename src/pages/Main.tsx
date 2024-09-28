/** @jsxImportSource @emotion/react */
import React from 'react';
import CategoryBar from '../components/CategoryBar';
import PostList from './PostPage/components/PostList';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PopularPosts from './PostPage/components/PopularPosts';
import { css } from '@emotion/react';

const mainPageStyle = css`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: visible; /* CategoryBar의 하위 카테고리가 잘리지 않도록 설정 */
`;

const contentStyle = css`
  flex: 1; /* 중앙 콘텐츠가 화면을 꽉 채우게 함 */
  padding: 20px;
`;

const MainPage: React.FC = () => {
  return (
    <div css={mainPageStyle}>
      <CategoryBar />
      <div css={contentStyle}>
        <PopularPosts />
        <PostList categoryId={0} />
      </div>
      <Footer />
    </div>
  );
}

export default MainPage;
