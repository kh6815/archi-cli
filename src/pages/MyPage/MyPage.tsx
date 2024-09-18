/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userAtom } from '@stores/user';
import { PagingDto } from '@api/dto/responseDto';
import { deleteComment, deletePost, GetUserCommentList, GetUserPostList } from '@api/postApi';
import { useMutation } from '@tanstack/react-query';
import { DeleteCommentReq, DeletePostReq, PostListDto, UserCommentDto } from '@api/dto/post';
import { AxiosError } from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Folder as FolderIcon, Delete as DeleteIcon, Edit as EditIcon, ExpandLess, ExpandMore, Add as AddIcon } from '@mui/icons-material';
import Pagination from '@components/Pagination';
import { ChangeNickNameReq, ChangePasswordReq, ChangeProfileImageReq } from '@api/dto/user';
import { getNickNameCheck, patchChangeNickName, patchChangeProfileImg, patchChangePw } from '@api/userApi';
import { AddFileReqDto, AddFileRes } from '@api/dto/file';
import { postAddFile } from '@api/fileApi';

const containerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const sectionStyle = css`
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  
  li {
    list-style: none;
    gap: 10px;
    display: flex; /* 이미지와 텍스트를 나란히 배치 */
    align-items: center; /* 이미지와 텍스트 수직 중앙 정렬 */
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  .post-a {
    flex-grow: 1; /* 텍스트가 남은 공간을 차지 */
    display: flex; /* 이미지와 텍스트를 나란히 배치 */
    align-items: center; /* 이미지와 텍스트 수직 중앙 정렬 */
    text-decoration: none;
    color: #333;
  }

  .comment-a {
    flex-grow: 1; /* 텍스트가 남은 공간을 차지 */
    text-decoration: none;
    color: #333;
  }

  .post-commnon-img-tab {
    width: 80px;
    height: 80px;
    background-color: lightgray;
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

  .post-like-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .comment-content-title {
    display:flex;
    justify-content: flex-start;
  }

  .comment-content-title span{
    color: blue;
  }
  
  .comment-text-contianer {
    display: flex; /* 이미지와 텍스트를 나란히 배치 */
    align-items: center; /* 이미지와 텍스트 수직 중앙 정렬 */
    flex-grow: 1; /* 텍스트가 남은 공간을 차지 */
  }

  .comment-content {
    flex-grow: 1; /* 텍스트가 남은 공간을 차지 */
  }

  .delete-container {
    display: flex;
    justify-content: flex-end;
    padding-right: 10px;
  }

  .delete-button {
    cursor: pointer;
    color: red;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const inputStyle = css`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const buttonStyle = css`
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const errorMessageStyle = css`
  color: red;
  font-size: 12px;
  margin-bottom: 10px;
`;

const possibleMessageStyle = css`
  color: green;
  font-size: 12px;
  margin-bottom: 10px;
`;

const MyPage = () => {
  const [userState, setUserState] = useRecoilState(userAtom);
  const navigate = useNavigate();

  const pageSize = 10;
  const [postCurrentPage, setPostCurrentPage] = useState(1);
  const [postTotalPages, setPostTotalPages] = useState(0);
  const [posts, setPosts] = useState<PostListDto[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);

  const [commentCurrentPage, setCommentCurrentPage] = useState(1);
  const [commentTotalPages, setCommentTotalPages] = useState(0);
  const [comments, setComments] = useState<UserCommentDto[]>([]);
  const [selectedComments, setSelectedComments] = useState<number[]>([]);

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [pwErrorMessage, setPwErrorMessage] = useState('');


  const [newNickname, setNewNickname] = useState('');
  const [nickNameCheck, setNickNameCheck] = useState<Boolean | null>(null);
  const [nickNameCheckMessage, setNickNameCheckMessage] = useState('');

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [changeNewFileInfo, setChangeNewFileInfo] = useState<AddFileRes>();

  const pwRegex = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).{8,20}/;

  const getUserPostListApi = async (pagingDto: PagingDto) => {
    const res = await GetUserPostList(pagingDto);
    return res;
  }
  
  const { mutate: getUserPostListMutate } = useMutation(
  {
    mutationFn: getUserPostListApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        const data = mutateData.data;

        setPosts(data.content);
        setPostTotalPages(data.totalPages);
        setSelectedPosts([]);

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

  const getUserCommentListApi = async (pagingDto: PagingDto) => {
    const res = await GetUserCommentList(pagingDto);
    return res;
  }
  
  const { mutate: getUserCommentListMutate } = useMutation(
  {
    mutationFn: getUserCommentListApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        const data = mutateData.data;

        setComments(data.content);
        setCommentTotalPages(data.totalPages);
        setSelectedComments([]);

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

  const deletePostApi = async (deletePostReq: DeletePostReq) => {
    const res = await deletePost(deletePostReq);
    return res;
  }
  
  const { mutate: deletePostMutate } = useMutation({
    mutationFn: deletePostApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        setSelectedPosts([]);
        alert('선택한 글이 삭제되었습니다.');

        getUserPostListMutate({
            page: postCurrentPage - 1,
            size: pageSize,
        })
      } else {
        alert(mutateData.header.resultMessage);
      }
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 400) {
        alert("게시글 삭제 실패");
      } else {
        alert("서버 오류 발생");
      }
    },
  });

  const deleteCommentApi = async (deleteCommentReq: DeleteCommentReq) => {
    const res = await deleteComment(deleteCommentReq);
    return res;
  }
  
  const { mutate: deleteCommentMutate } = useMutation({
    mutationFn: deleteCommentApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        setSelectedComments([]);
        alert('선택한 댓글이 삭제되었습니다.');

        getUserCommentListMutate({
            page: commentCurrentPage - 1,
            size: pageSize,
        })
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

  const changePwApi = async (changePasswordReq: ChangePasswordReq) => {
    const res = await patchChangePw(changePasswordReq);
    return res;
  }
  
  const { mutate: changePwMutate } = useMutation({
    mutationFn: changePwApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        setCurrentPassword('');
        setPassword('');
        setCheckPassword('');
        setPwErrorMessage('');
    
        alert('비밀번호가 변경되었습니다.');
      } else {
        alert(mutateData.header.resultMessage);
      }
    },
    onError: (error: AxiosError<any, any>) => {
      if (error.response?.status === 400) {
        if(error.response.data.errorData){
            alert(error.response.data.errorData)
        } else {
            alert("비밀번호 변경 실패");
        }
      } else {
        alert("서버 오류 발생");
      }
    },
  });

  const checkNickNameApi = async (nickName: string) => {
    const res = await getNickNameCheck(nickName);
    return res;
  }

  const { mutate: checkNickNameMutate } = useMutation(
    {
      mutationFn: checkNickNameApi,
      onSuccess: mutateData => {
        if (mutateData.header.resultCode === 0) {
            setNickNameCheck(true)
            setNickNameCheckMessage("사용가능한 닉네임입니다.");
        } else {
            setNickNameCheckMessage(mutateData.header.resultMessage);
            setNickNameCheck(false)
        }
      },
      onError: (error: AxiosError) => {
        setNickNameCheck(null)
        if (error.response?.status === 400) {
          alert("닉네임 체크 실패")
        } else {
          alert("서버 오류 발생");
        }
      },
    },
  );

  const changeNickNameApi = async (changeNickNameReq: ChangeNickNameReq) => {
    const res = await patchChangeNickName(changeNickNameReq);
    return res;
  }
  
  const { mutate: changeNickNameMutate } = useMutation({
    mutationFn: changeNickNameApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        setNewNickname('');
        setNickNameCheck(null);
        setNickNameCheckMessage('');
    
        setUserState((prev) => ({ ...prev, nickName: newNickname }));
        alert('닉네임이 변경되었습니다.');
      } else {
        alert(mutateData.header.resultMessage);
      }
    },
    onError: (error: AxiosError<any, any>) => {
      if (error.response?.status === 400) {
        if(error.response.data.errorData){
            alert(error.response.data.errorData)
        } else {
            alert("닉네임 변경 실패");
        }
      } else {
        alert("서버 오류 발생");
      }
    },
  });

  const addFileApi = async (addFileApi: AddFileReqDto) => {
    const res = await postAddFile(addFileApi);
    return res;
  }

  const { mutate: addImgMutate } = useMutation({
    mutationFn: addFileApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        const fileRes = mutateData.data;
        setChangeNewFileInfo(fileRes);
        changeProfileImgMutate({
            fileId: fileRes.fileId
        })
      } else {
        alert(mutateData.header.resultMessage);
      }
    },
    onError: (error: AxiosError<any, any>) => {
      if (error.response?.status === 400) {
        if(error.response.data.errorData){
            alert(error.response.data.errorData)
        } else {
            alert("파일 등록 실패");
        }
      } else {
        alert("서버 오류 발생");
      }
    },
  });

  const changeProfileImgApi = async (changeProfileImageReq: ChangeProfileImageReq) => {
    const res = await patchChangeProfileImg(changeProfileImageReq);
    return res;
  }
  
  const { mutate: changeProfileImgMutate } = useMutation({
    mutationFn: changeProfileImgApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        setProfileImage(null);
    
        if(changeNewFileInfo !== undefined){
            setUserState((prev) => ({ ...prev, imgUrl: changeNewFileInfo?.fileUrl }));
        }
        alert('프로필 사진이 변경되었습니다.');
      } else {
        alert(mutateData.header.resultMessage);
      }
    },
    onError: (error: AxiosError<any, any>) => {
      if (error.response?.status === 400) {
        alert("프로필 사진 변경 실패");
      } else {
        alert("서버 오류 발생");
      }
    },
  });
  

  const handlePostSelect = (postId: number) => {
    setSelectedPosts(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const handleCommentSelect = (commentId: number) => {
    setSelectedComments(prev => 
      prev.includes(commentId) ? prev.filter(id => id !== commentId) : [...prev, commentId]
    );
  };

  const handleDeletePosts = async () => {
    if (selectedPosts.length > 0) {
        if (window.confirm('선택한 게시글을 삭제하시겠습니까?')) {
            await deletePostMutate({
                ids: selectedPosts
            });
        }
    }
  };

  const handleDeleteComments = async () => {
    if (selectedComments.length > 0) {
        if (window.confirm('선택한 댓글을 삭제하시겠습니까?')) {
            await deleteCommentMutate({
                ids: selectedComments
            });
        }
    }
  };

  const handlePasswordChange = async () => {
    // await updatePassword(userState.id, password);
    if(password !== checkPassword){
        setPwErrorMessage('두 비밀번호가 다릅니다.')
        return
    }

    if(!pwRegex.test(password)){
        setPwErrorMessage('비밀번호는 영문, 숫자, 특수문자를 포함하여 8자에서 20자 사이여야 합니다.');
        return;
    }

    changePwMutate({
        beforePassword: currentPassword,
        newPassword: password,
        checkPassword: checkPassword
    });
  };

  const handleNicknameChange = async () => {
    // await updateNickname(userState.id, newNickname);
    if(!(newNickname.length >= 2 && newNickname.length <= 10)){
        setNickNameCheck(false);
        setNickNameCheckMessage("2글자 이상, 10글자 이하로 입력해야 합니다.");
        return;
    }

    changeNickNameMutate({
        newNickName: newNickname
    })
  };

  const handleProfileImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleProfileImageSubmit = async () => {
    if (profileImage) {
        const fileReq: AddFileReqDto = { 
            file: profileImage
        };
       await addImgMutate(fileReq);
    }
  };

  useEffect(() => {
    // 내가 쓴 글과 댓글을 불러오기
    if(userState.id === null){
        alert('로그인 후 접근 가능한 페이지 입니다.');
        navigate("/");
        return;
    }

    getUserPostListMutate({
        page: postCurrentPage - 1,
        size: pageSize,
    })

    getUserCommentListMutate({
        page: commentCurrentPage - 1,
        size: pageSize,
    })

  }, []);

  useEffect(() => {
    getUserPostListMutate({
        page: postCurrentPage - 1,
        size: pageSize,
    })
  }, [postCurrentPage]);

  useEffect(() => {
    getUserCommentListMutate({
        page: commentCurrentPage - 1,
        size: pageSize,
    })
  }, [commentCurrentPage]);

  return (
    <>
        {userState.id !== null && 
            <div css={containerStyle}>
            {/* 내가 쓴 글 */}
            <div css={sectionStyle}>
                <h2>내가 쓴 글</h2>
                <div className='delete-container'>
                    <div className="delete-button" onClick={() => handleDeletePosts()}>
                        <DeleteIcon />
                    </div>
               </div>  
                {posts.map(post => (
                <li key={post.id}>
                    <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => handlePostSelect(post.id)}
                    />
                    <Link className='post-a' to={`/post/${post.id}`}>
                        {!post.imgUrl && <div className='post-commnon-img-tab'/>}
                        {post.imgUrl && <img src={post.imgUrl} alt={post.title} className="post-image" />}
                        <div className='post-content'>{post.title}</div>
                        <div className={'post-like-container'}>
                            <div>좋아요</div>
                            <div>{post.like}</div>
                        </div>
                    </Link>
                </li>
                ))}
                <Pagination
                    currentPage={postCurrentPage}
                    totalPages={postTotalPages}
                    onPageChange={page => setPostCurrentPage(page)}
                />
            </div>
      
            {/* 내가 쓴 댓글 */}
            <div css={sectionStyle}>
              <h2>내가 쓴 댓글</h2>
              <div className='delete-container'>
                    <div className="delete-button" onClick={() => handleDeleteComments()}>
                        <DeleteIcon />
                    </div>
               </div>  
              {comments.map(comment => (
                <li key={comment.id}>
                    <input
                    type="checkbox"
                    checked={selectedComments.includes(comment.id)}
                    onChange={() => handleCommentSelect(comment.id)}
                    />
                    <Link className='comment-a' to={`/post/${comment.contentId}`}>
                        <div className='comment-content-title'><span>{comment.contentTitle}</span></div>
                        <div className='comment-text-contianer'>
                            <div className='comment-content'>{comment.comment}</div>
                            <div>
                                <div>좋아요</div>
                                <div>{comment.like}</div>
                            </div>
                        </div>
                    </Link>
                </li>
                ))}
                <Pagination
                    currentPage={commentCurrentPage}
                    totalPages={commentTotalPages}
                    onPageChange={page => setCommentCurrentPage(page)}
                />
            </div>
      
            {/* 비밀번호 변경 */}
            <div css={sectionStyle}>
              <h2>비밀번호 변경</h2>
              <div className='input-container'>
                <input
                    type="password"
                    placeholder="현재 비밀번호"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    css={inputStyle}
                />
                <input
                    type="password"
                    placeholder="새 비밀번호(비밀번호는 영문, 숫자, 특수문자를 포함하여 8자에서 20자 사이여야 합니다.)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    css={inputStyle}
                />
                <input
                    type="password"
                    placeholder="새 비밀번호(비밀번호는 영문, 숫자, 특수문자를 포함하여 8자에서 20자 사이여야 합니다.)"
                    value={checkPassword}
                    onChange={(e) => setCheckPassword(e.target.value)}
                    css={inputStyle}
                />
                {pwErrorMessage !== '' && <p css={errorMessageStyle}>{pwErrorMessage}</p>}
                <div>
                    <button onClick={handlePasswordChange} css={buttonStyle}>비밀번호 변경</button>
                </div>
              </div>
            </div>
      
            {/* 닉네임 변경 */}
            <div css={sectionStyle}>
              <h2>닉네임 변경</h2>
              <div className='input-container'>
                <input
                    type="text"
                    placeholder="새 닉네임"
                    value={newNickname}
                    onChange={(e) => {
                        setNickNameCheck(null);
                        setNewNickname(e.target.value)
                    }}
                    onBlur={(e) => {
                        if(e.target.value.length >= 2 && e.target.value.length <= 10){
                        checkNickNameMutate(e.target.value)
                        }
                    }}
                    css={inputStyle}
                />
                {nickNameCheck !== null && <p css={nickNameCheck ? possibleMessageStyle : errorMessageStyle}>{nickNameCheckMessage}</p>}
              </div>
              <button onClick={handleNicknameChange} css={buttonStyle}>닉네임 변경</button>
            </div>
      
            {/* 프로필 사진 변경 */}
            <div css={sectionStyle}>
              <h2>프로필 사진 변경</h2>
              <div className='input-container'>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    css={inputStyle}
                />
              </div>
              <button onClick={handleProfileImageSubmit} css={buttonStyle}>프로필 사진 변경</button>
            </div>
          </div>}
    </>
  );
};

export default MyPage;
