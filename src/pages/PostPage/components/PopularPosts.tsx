/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PopularPostDto } from '../../../api/dto/post';
import { GetPopularPostList } from '../../../api/postApi';
import { AxiosError } from 'axios';

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

const PopularPosts: React.FC = ({}) => {

  const [popularPostList, setPopularPostList] = useState<PopularPostDto[]>([]);

  const getPopularPostListApi = async () => {
    const res = await GetPopularPostList();
    return res;
  }
  
  const { mutate: getPopularPostListMutate } = useMutation(
  {
    mutationFn: getPopularPostListApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        const data = mutateData.data;

        setPopularPostList(data);
      } else {
        alert(mutateData.header.resultMessage);
      }
    },
    onError: (error: AxiosError) => {
        if (error.response?.status === 400) {
            alert("인기 게시글 조회 실패");
          } else {
            alert("서버 오류 발생");
          }
    },
  },
  );

  useEffect(() => {
    getPopularPostListMutate();
  }, [])

  return (
    <section css={popularPostsStyle}>
      <h3>인기 게시물</h3>
      <div className="posts-container">
        {popularPostList.map(post => (
          <div className="post-item" key={post.id}>
            <Link to={`/post/${post.id}`}>
                {post.imgUrl !== "" && <img src={post.imgUrl} alt={post.title} className="post-image" />}
                {post.title}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PopularPosts;
