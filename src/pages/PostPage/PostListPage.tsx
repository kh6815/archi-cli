/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import CategoryBar from '../../components/CategoryBar';
import PostList from './components/PostList';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PopularPosts from './components/PopularPosts';
import { css } from '@emotion/react';
import { useLocation } from 'react-router-dom';

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

const PostListPage: React.FC = () => {
  const location = useLocation();
  const [categoryId, setCategoryId] = useState<number>();

  useEffect(() => {
    if (location.pathname.includes('/category')) {
      const categoryIdStr = location.pathname.split('/category/')[1];
      setCategoryId(Number(categoryIdStr));
    }
  }, [ location ])

  return (
    <>
      {categoryId &&     
      <div css={mainPageStyle}>
        <CategoryBar />
        <div css={contentStyle}>
          <PostList categoryId={categoryId} />
        </div>
      </div>
      }
    </>
  );
}

export default PostListPage;
