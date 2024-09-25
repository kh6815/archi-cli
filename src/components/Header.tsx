/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { userAtom } from '../stores/user';
import { LogoutReqDto, ROLETPYE } from '../api/dto/auth';
import { postLogOut } from '../api/authApi';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
import { getNotificationList, patchUpdateReadNoti } from '@api/notificationApi';
import { NotificationListDto } from '@api/dto/notification';
import NotificationsSharpIcon from '@mui/icons-material/NotificationsSharp';

export enum HeaderType {
    ORIGIN = "ORIGIN",
    LOGIN = "LOGIN",
    SIGNUP = "SIGNUP"
    // MAIN = 'MAIN',
  }

// interface HeaderProps {
//     type: HeaderType;
// }

const headerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #333;
  color: white;
  width: 100%;
  box-sizing: border-box; /* 패딩을 포함하여 너비 계산 */
  
  a {
    color: white;
    text-decoration: none;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    textDecoration: none;
  }

  .menu {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .menu a {
    color: white;
    text-decoration: none;
  }
`;

const userImgContanierStyle = css`
  display: flex;
  flex-direction: flex-start;
  align-items: center;
  justify-content: flex-start;
`

const userImgStyle = css`
  width: 24px;
  height: 24px;
  border-radius: 8px;

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
`;

const userNameTextStyle = css`
  margin-right: 10px;
  font-size: 15px;
`


const dropdownStyle = css`
  position: absolute;
  top: 30px;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  width: 150px;
  z-index: 1000;

  a, button {
    padding: 8px;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;

    &:hover {
      background-color: #f0f0f0;
    }
  }

  li{
    list-style: none; /* 기본 리스트 스타일 제거 */
    border-bottom: 1px solid #ccc; /* 아래쪽에만 선 추가 */
  }  

  .text-style {
    font-size: 14px;
    color: #333;
  }
`;

// 빨간 점 스타일 추가
const notificationIconContainerStyle = css`
  position: relative;
  display: inline-block; /* 아이콘에 맞게 크기를 줄이기 위해 inline-block 사용 */

  .red-dot {
    position: absolute;
    top: 0;
    right: 0;
    width: 8px;
    height: 8px;
    background-color: red;
    border-radius: 50%;
  }
`;

const Header: React.FC<{ type: HeaderType }> = ({ type }) => {

  const [userState, setUserState] = useRecoilState(userAtom);
  const initUserState = useResetRecoilState(userAtom);
  const navigate = useNavigate();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotiDropdownOpen, setIsNotiDropdownOpen] = useState(false);
  const [notificationList, setNotificationList] = useState<NotificationListDto[]>([]);
  const [isNewNoti, setIsNewNoti] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  const logout = async (logoutReqDto: LogoutReqDto) => {
    const res = await postLogOut(logoutReqDto);
    return res;
  }

const { mutate: logoutMutate } = useMutation(
  {
    mutationFn: logout,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        const userData = mutateData.data;
        initUserState();
        navigate("/");
      } else {
        alert(mutateData.header.resultMessage);
      }
    },
    onError: (error: AxiosError) => {
        alert("로그아웃 실패");
    },
  },
);

  const getNotificationListApi = async () => {
    const res = await getNotificationList();
    return res;
  }

  const { mutate: notificationListMutate } = useMutation(
  {
    mutationFn: getNotificationListApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        const data = mutateData.data;

        data.some((noti) => {
          if(noti.readYn === "N"){
            setIsNewNoti(true);
            return;
          }
        });
        
        setNotificationList(data);
      } else {
        alert(mutateData.header.resultMessage);
      }
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 400) {
        alert("알림 업데이트 실패");
      } else {
        alert("서버 오류 발생");
      }
    },
  },
  );

  const patchUpdateReadNotiApi = async (notificationId:number) => {
    const res = await patchUpdateReadNoti(notificationId);
    return res;
  }

  const { mutate: updateReadNotiMutate } = useMutation(
  {
    mutationFn: patchUpdateReadNotiApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        notificationListMutate();
      } else {
        alert(mutateData.header.resultMessage);
      }
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 400) {
        alert("알림 read 업데이트 실패");
      } else {
        alert("서버 오류 발생");
      }
    },
  },
  );

  const handleLogout = () => {
    if(userState.id !== null){
      logoutMutate({
        id: userState.id
      })
    }
  }

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(prev => !prev);
  };

  const closeUserDropdown = () => {
    setIsUserDropdownOpen(false);
  };

  const toggleNotiDropdown = () => {
    setIsNotiDropdownOpen(prev => !prev);
  };

  const closeNotiDropdown = () => {
    setIsNotiDropdownOpen(false);
  };

  const handleClickNoti = (notificationId:number, postId: number) => {

    setIsNewNoti(false);

    notificationList.some((noti) => {
      if(noti.readYn === "N"){
        setIsNewNoti(true);
        return;
      }
    });

    updateReadNotiMutate(notificationId);
    navigate(`/post/${postId}`);
  }

  useEffect(() => {
    closeUserDropdown();
    closeNotiDropdown();

    if(userState.id !== null){
      notificationListMutate();
    }
  }, [])

  useEffect(() => {
    let eventSource: EventSource | undefined;
    if(userState.id !== null){
      eventSource = new EventSource(`${apiUrl}/notifications/subscribe/${userState.id}`);

        eventSource.addEventListener('newComment', function(event) {
          notificationListMutate();
          const data = event.data;
          console.log('New comment notification:', data);
        });

        // 예외 처리
        eventSource.onerror = function(error) {
          console.error('EventSource failed:', error);
        };

        console.log('연결')
    } else {
      if(eventSource){
        eventSource.close();
        console.log('EventSource connection closed');
      }
    }
  }, [userState])

  return (
    <header css={headerStyle}>
      <Link to="/" className="logo">백엔드 커뮤니티</Link>
      <div className="menu">
        { userState.id === null && 
        <>
          <Link to="/login" style={{ textDecoration: "none"}}>로그인</Link>
          <Link to="/signup" style={{ textDecoration: "none"}}>회원가입</Link>
        </>}
        {
          userState.id !== null && 
          <>
              {type === HeaderType.ORIGIN && <>
                <div css={notificationIconContainerStyle} onClick={toggleNotiDropdown}>
                  <NotificationsSharpIcon />
                  {/* 읽지 않은 알림이 있을 경우에만 빨간 점 표시 */}
                  {isNewNoti && <div className="red-dot" />}
                </div>
                {isNotiDropdownOpen && (
                  <div css={dropdownStyle} onMouseLeave={closeNotiDropdown}>
                    {notificationList.length === 0 && <li className='text-style'>새로운 알림이 없습니다.</li>}
                    {notificationList.map(noti => (
                      <li key={noti.id} className='text-style'>
                          <div onClick={() => handleClickNoti(noti.id, noti.contendId)}>
                            <div className='post-content'>{noti.message}</div>
                          </div>
                      </li>
                    ))}
                  </div>
                )}
              </>}
              <div css={userImgContanierStyle}>
                <div css={userNameTextStyle}>{userState.nickName}</div>
                {/* {userState.imgUrl === null && <div css={userImgStyle}><Link to="/my" style={{ textDecoration: "none"}}><PersonIcon /></Link></div>}
                {userState.imgUrl !== null && <div css={userImgStyle}><Link to="/my" style={{ textDecoration: "none"}}><img src={userState.imgUrl} /></Link></div>} */}
                <div css={userImgStyle} onClick={toggleUserDropdown}>
                  {userState.imgUrl === null ? (
                    <PersonIcon />
                  ) : (
                    <img src={userState.imgUrl} alt="User Profile" />
                  )}
                </div>
                {isUserDropdownOpen && (
                  <div css={dropdownStyle} onMouseLeave={closeUserDropdown}>
                    { userState.role === ROLETPYE.ADMIN && <Link to="/admin/setting" style={{ textDecoration: "none"}}><span className='text-style'>페이지 설정</span></Link>}
                    <Link to="/my"><span className='text-style'>마이페이지</span></Link>
                    <button onClick={handleLogout}><span className='text-style'>로그아웃</span></button>
                  </div>
                )}
              </div>
              {/* <button onClick={handleLogout}>로그아웃</button> */}
          </>
        }
      </div>
    </header>
  );
}

export default Header;
