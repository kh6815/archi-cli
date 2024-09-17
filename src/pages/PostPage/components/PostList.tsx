/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState, useEffect } from 'react';
import Pagination from '../../../components/Pagination';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userAtom } from '../../../stores/user';
import { ROLETPYE } from '../../../api/dto/auth';
import { GetNoticeList, GetPostList } from '../../../api/postApi';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { GetPostReqDto, NoticeListDto, PostListDto } from '../../../api/dto/post';

const postListStyle = css`
  position: relative;
  padding: 20px;

  .notice {
    background-color: #ffeb3b;
  }

  a {
    text-decoration: none;
    color: #333;
  }

  .create-post-container {
    display: flex;
    justify-content: flex-end; /* 오른쪽 끝으로 배치 */
    margin-bottom: 20px; /* 아래 요소와의 간격 */
  }

  .create-notice {
    margin-right: 10px;
    padding: 10px 20px;
    background-color: red; /* 배경색 */
    color: white; /* 텍스트 색 */
    border-radius: 5px; /* 모서리 둥글게 */
    cursor: pointer;
  }

  .create-post {
    padding: 10px 20px;
    background-color: #4CAF50; /* 배경색 */
    color: white; /* 텍스트 색 */
    border-radius: 5px; /* 모서리 둥글게 */
    cursor: pointer;
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

const PostList: React.FC<{ categoryId: number }> = ({ categoryId }) => {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [paginatedPosts, setPaginatedPosts] = useState<PostListDto[]>([]);
  const [noticeList, setNoticeList] = useState<NoticeListDto[]>([]);
  const [userState, setUserState] = useRecoilState(userAtom);

  const getNoticeListApi = async () => {
    const res = await GetNoticeList();
    return res;
  }
  
  const { mutate: getNoticeListMutate } = useMutation(
  {
    mutationFn: getNoticeListApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        const data = mutateData.data;

        setNoticeList(data);
      } else {
        alert(mutateData.header.resultMessage);
      }
    },
    onError: (error: AxiosError) => {
        if (error.response?.status === 400) {
            alert("공지사항 조회 실패");
          } else {
            alert("서버 오류 발생");
          }
    },
  },
  );

  const getPostListApi = async (getPostReqDto: GetPostReqDto) => {
    const res = await GetPostList(getPostReqDto);
    return res;
  }
  
  const { mutate: getPostListMutate } = useMutation(
  {
    mutationFn: getPostListApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        const data = mutateData.data;

        setPaginatedPosts(data.content);
        setTotalPages(data.totalPages);

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

  useEffect(() => {
    if(categoryId === 0){
      getNoticeListMutate();
    }
    getPostListMutate({
      categoryId: categoryId,
      page: currentPage - 1,
      size: pageSize,
    });
  }, [categoryId, currentPage])

  // useEffect(() => {
  //   const indexOfLastPost = currentPage * postsPerPage;
  //   const indexOfFirstPost = indexOfLastPost - postsPerPage;
  //   setPaginatedPosts(posts.slice(indexOfFirstPost, indexOfLastPost));
  // }, [currentPage, posts, postsPerPage]);

  // const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <section css={postListStyle}>
      {userState.id !== null &&       
      <div className="create-post-container">
        {userState.role === ROLETPYE.ADMIN && <Link to={"/create/notice"}><div className='create-notice'>{"공지사항 등록"}</div></Link>}
        <Link to={"/create/post"}><div className='create-post'>{"게시글 등록"}</div></Link>
      </div>}
      {/* <div className="notice">공지사항: 새로운 커뮤니티 기능이 추가되었습니다!</div> */}
      <ul>
        {
          categoryId === 0 && <>
            {noticeList.map(notice => (
              <li key={notice.id} className="notice">
                  <Link to={`/notice/${notice.id}`}>
                    {notice.imgUrl && <img src={notice.imgUrl} alt={notice.title} className="post-image" />}
                    <div className='post-content'>{notice.title}</div>
                  </Link>
              </li>
            ))} 
          </>
        }
        {paginatedPosts.map(post => (
          <li key={post.id}>
              <Link to={`/post/${post.id}`}>
                {post.imgUrl && <img src={post.imgUrl} alt={post.title} className="post-image" />}
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
