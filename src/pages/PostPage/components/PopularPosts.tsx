/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { Link } from 'react-router-dom';

// 게시물 타입 정의
interface Post {
  id: number;
  title: string;
  imageUrl: string; // 이미지 URL 추가
}

interface PopularPostsProps {
  posts: Post[];
}

const popularPostsStyle = css`
  position: relative;
  padding: 20px;

  h3 {
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
  }

  .posts-container {
    display: flex;
    gap: 10px;
    margin-top: 40px;
    overflow-x: auto;
    padding-bottom: 10px;
  }

  .post-item {
    min-width: 200px;
    background-color: #f4f4f4;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    white-space: nowrap;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .post-image {
    width: 100px;
    height: 100px;
    object-fit: cover; /* 이미지 크기를 고정 */
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .post-item a {
    text-decoration: none;
    color: #333;
  }
`;

const PopularPosts: React.FC<PopularPostsProps> = ({ posts }) => {
  return (
    <section css={popularPostsStyle}>
      <h3>인기 게시물</h3>
      <div className="posts-container">
        {posts.map(post => (
          <div className="post-item" key={post.id}>
            <Link to={`/post/${post.id}`}>
                <img src={post.imageUrl} alt={post.title} className="post-image" />
                {post.title}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PopularPosts;
