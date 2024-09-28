/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GetNotice } from '@api/postApi';
import { useMutation } from '@tanstack/react-query';
import { NoticeDto } from '@api/dto/post';
import { AxiosError } from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Folder as FolderIcon, Delete as DeleteIcon, Edit as EditIcon, ExpandLess, ExpandMore, Add as AddIcon } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import { useRecoilState } from 'recoil';
import { userAtom } from '@stores/user';
import Modal from '@components/Modal';
import NoticeDelete from './components/NoticeDelete';
import NoticeUpdate from './components/NoticeUpdate';

const noticePageStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 40px 20px;
  min-height: 100vh;
  background-color: #f7f7f7;
`;

const noticeContainerStyle = css`
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 900px;
  padding: 30px;
  margin: 30px 0;
`;

const noticeInfoStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
  color: #777;
`;

const noticeInfoImgStyle = css`
  width: 24px;
  height: 24px;
  border-radius: 8px;

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
`;

const noticeInfoUserContanierStyle = css`
  display: flex;
  flex-direction: flex-start;
  align-items: center;
  justify-content: flex-start;
`

const noticeInfoTextStyle = css`
  margin-left: 5px;
  font-size: 15px;
`
const noticeInfoDateTextStyle = css`
  font-size: 12px;
`

const noticeMenuStyle = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 25px;
`;

const noticeMenuLikeStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #f06292;
  cursor: pointer;
  svg {
    font-size: 2rem;
  }
`;

const noticeMenuSettingStyle = css`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #777;
  cursor: pointer;

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;
  }

  span:hover {
    color: #424242;
  }
`;

const noticeCategoryStyle = css`
  font-size: 1.1rem;
  font-weight: 500;
  margin-right: 10px;
  color: #424242;
`;

const noticeTitleStyle = css`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 25px;
  color: #333;
`;

const noticeContentStyle = css`
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 40px;
  color: #444;

  img {
    max-width: 100%;
  }
`;

const commentSectionStyle = css`
  width: 100%;
  margin-top: 50px;
  border-top: 1px solid #ddd;
  padding-top: 20px;

  h3 {
    font-size: 1.6rem;
    font-weight: 600;
    color: #333;
  }
`;

const commentContainerStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fafafa;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const subCommentContainerStyle = css`
  display: flex;
  flex-direction: column;
  margin-left: 30px;
  margin-bottom: 15px;
  padding: 12px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const commentMenuStyle = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #777;
  svg {
    font-size: 1.3rem;
    cursor: pointer;
  }
  svg:hover {
    color: #f06292;
  }
`;

const commentInfoStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #555;
`;

const commentInfoUserContanierStyle = css`
  display: flex;
  flex-direction: flex-start;
  align-items: center;
  justify-content: flex-start;
`

const commentInfoImgStyle = css`
  width: 24px;
  height: 24px;
  border-radius: 8px;

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
`;

const commentInfoTextStyle = css`
  margin-left: 5px;
  font-size: 15px;
`
const commentInfoDateTextStyle = css`
  font-size: 12px;
`

const commentStyle = css`
  display: flex;
  padding-left: 5px;
  font-size: 1rem;
  color: #555;
`;

const commentMenuLikeStyle = css`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  color: #f06292;
  svg {
    margin-right: 5px;
  }
`;

const commentMenuLikeDivStyle = css`
  margin-left: 5px;
`;

const deleteTextStyle = css`
  color: red;
`

const NoticePage: React.FC = () => {
  const [notice, setNotice] = useState<NoticeDto>();
  const location = useLocation();
  const navigate = useNavigate();
  const [userState, setUserState] = useRecoilState(userAtom);

  const [isUpdateNoticeModalOpen, setIsUpdateNoticeModalOpen] = useState(false);
  const closeUpdateNoticeModal = () => setIsUpdateNoticeModalOpen(false);

  const [isDeleteNoticeModalOpen, setIsDeleteNoticeModalOpen] = useState(false);
  const closeDeleteNoticeModal = () => setIsDeleteNoticeModalOpen(false);

  const getNoticeApi = async (noticeId: number) => {
    const res = await GetNotice(noticeId);
    return res;
  }
  
  const { mutate: getNoticeMutate } = useMutation(
  {
    mutationFn: getNoticeApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        const data = mutateData.data;

        setNotice(data);
      } else if(mutateData.header.resultCode === 2001) {
        alert("삭제되었거나, 존재하지 않는 공지사항입니다.");
        navigate('/');
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


  const handleUpdatenotice = () => {
    setIsUpdateNoticeModalOpen(true)
  }

  const handleDeletenotice = () => {
    setIsDeleteNoticeModalOpen(true)
  }

  useEffect(() => {
    if (location.pathname.includes('/notice')) {
      const noticeIdStr = location.pathname.split('/notice/')[1];
      getNoticeMutate(Number(noticeIdStr));
    }
  }, [ location ])
  return (
    <>{
      notice !== undefined && 
      <>
        <div css={noticePageStyle}>
          <div css={noticeContainerStyle}>
            <div css={noticeInfoStyle}>
              <div css={noticeInfoUserContanierStyle}>
                {notice.noticeAuthorImgUrl === null && <div css={noticeInfoImgStyle}><PersonIcon /></div>}
                {notice.noticeAuthorImgUrl !== null && <div css={noticeInfoImgStyle}><img src={notice.noticeAuthorImgUrl} /></div>}
                <div css={commentInfoTextStyle}>{notice.noticeAuthorNickName}</div>
              </div>
              <div css={commentInfoDateTextStyle}>{notice.updatedAt}</div>
            </div>
            <div css = {noticeMenuStyle}>
              <div>
                {notice.isAvailableUpdate && <>
                  <span onClick={handleUpdatenotice}><EditIcon /></span>
                  <span onClick={handleDeletenotice}><DeleteIcon /></span>
                </>}
              </div>
            </div>
            <h1 css={noticeTitleStyle}>{notice?.title}</h1>
            <div css={noticeContentStyle} dangerouslySetInnerHTML={{ __html: notice!.content }}></div>
          </div>
        </div>
        <Modal isOpen={isUpdateNoticeModalOpen} onClose={closeUpdateNoticeModal}>
            <NoticeUpdate noticeData={notice} close={(isSuccess: boolean) => {
              if(isSuccess){
                alert("공지사항이 수정되었습니다.");
                getNoticeMutate(notice.id);
              }
              closeUpdateNoticeModal()
            }}/>
        </Modal>
        <Modal isOpen={isDeleteNoticeModalOpen} onClose={closeDeleteNoticeModal}>
            <NoticeDelete notice={notice} close={(isSuccess: boolean) => {
              if(isSuccess){
                alert("게시글이 삭제되었습니다.");
                navigate('/');
              }
              closeDeleteNoticeModal()
            }}/>
        </Modal>
      </>}
    </>
  )
}

export default NoticePage;
