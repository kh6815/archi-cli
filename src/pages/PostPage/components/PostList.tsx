/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState, useEffect } from 'react';
import Pagination from '../../../components/Pagination';
import { Link } from 'react-router-dom';

const postListStyle = css`
  position: relative;
  padding: 20px;

  .notice {
    background-color: #ffeb3b;
    padding: 10px;
    margin-bottom: 20px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  ul li {
    gap: 10px;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  li a {
    display: flex; /* 이미지와 텍스트를 나란히 배치 */
    align-items: center; /* 이미지와 텍스트 수직 중앙 정렬 */
    text-decoration: none;
    color: #333;
  }

  .post-image {
    width: 80px;
    height: 80px;
    object-fit: cover; /* 이미지 크기를 고정 */
    flex-shrink: 0; /* 텍스트 길이에 관계없이 이미지 크기를 유지 */
  }

  .post-content {
    flex-grow: 1; /* 텍스트가 남은 공간을 차지 */
  }
`;

interface Post {
  id: number;
  title: string;
  imageUrl?: string; // 이미지 URL 선택적 추가
}

const PostList: React.FC<{ posts: Post[] }> = ({ posts }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [paginatedPosts, setPaginatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    setPaginatedPosts(posts.slice(indexOfFirstPost, indexOfLastPost));
  }, [currentPage, posts, postsPerPage]);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <section css={postListStyle}>
      <div className="notice">공지사항: 새로운 커뮤니티 기능이 추가되었습니다!</div>
      <ul>
        {paginatedPosts.map(post => (
          <li key={post.id}>
              <Link to={`/post/${post.id}`}>
                {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="post-image" />}
                <div className='post-content'>{post.title}</div>
              </Link>
          </li>
        ))}
      </ul>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={page => setCurrentPage(page)}
      />
    </section>
  );
}

export default PostList;
