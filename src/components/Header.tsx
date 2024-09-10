/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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

  return (
    <header css={headerStyle}>
      <Link to="/" className="logo">archi 백엔드 커뮤니티</Link>
      <div className="menu">
        <Link to="/login" style={{ textDecoration: "none"}}>로그인</Link>
        <Link to="/signup" style={{ textDecoration: "none"}}>회원가입</Link>
        {type === HeaderType.ORIGIN && <button>🔔</button>}
      </div>
    </header>
  );
}

export default Header;
