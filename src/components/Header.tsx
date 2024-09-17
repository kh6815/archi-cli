/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userAtom } from '../stores/user';
import { LogoutReqDto, ROLETPYE } from '../api/dto/auth';
import { postLogOut } from '../api/authApi';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

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

const Header: React.FC<{ type: HeaderType }> = ({ type }) => {

  const [userState, setUserState] = useRecoilState(userAtom);
  const navigate = useNavigate();

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
        setUserState({
          id: userData.id,
          accessToken: userData.accessToken,
          refreshToken: userData.refreshToken,
          role: userData.role
        });
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

  const handleLogout = () => {
    if(userState.id !== null){
      logoutMutate({
        id: userState.id
      })
    }
  }

  return (
    <header css={headerStyle}>
      <Link to="/" className="logo">archi 백엔드 커뮤니티</Link>
      <div className="menu">
        { userState.id === null && 
        <>
          <Link to="/login" style={{ textDecoration: "none"}}>로그인</Link>
          <Link to="/signup" style={{ textDecoration: "none"}}>회원가입</Link>
        </>}
        {
          userState.id !== null && 
          <>
              { userState.role === ROLETPYE.ADMIN && <Link to="/admin/setting" style={{ textDecoration: "none"}}>페이지 세팅 설정</Link>}
              <Link to="/my" style={{ textDecoration: "none"}}>마이페이지</Link>
              {type === HeaderType.ORIGIN && <button>🔔</button>}
              <button onClick={handleLogout}>로그아웃</button>
          </>
        }
      </div>
    </header>
  );
}

export default Header;
