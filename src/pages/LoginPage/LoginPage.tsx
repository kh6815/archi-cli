/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import Header, { HeaderType } from '../../components/Header';

const loginPageStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f4;
`;

const loginFormStyle = css`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;

  input {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  button {
    padding: 10px;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #555;
  }
`;

const LoginPage: React.FC = () => {
  return (
    <>
        <div css={loginPageStyle}>
            <form css={loginFormStyle}>
                <h2>로그인</h2>
                <input type="text" placeholder="아이디" />
                <input type="password" placeholder="비밀번호" />
                <button type="submit">로그인</button>
            </form>
        </div>
    </>
  );
};

export default LoginPage;
