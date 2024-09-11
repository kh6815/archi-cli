/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import axios, { AxiosError } from 'axios';
import { LoginDto, LoginReqDto } from '../../api/dto/auth';
import { postLogin } from '../../api/authApi';
import { useMutation } from '@tanstack/react-query';
import { useRecoilState } from 'recoil';
import { userAtom } from '../../stores/user';
import { ResponseDto } from '../../api/dto/responseDto';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';

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
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();
  const [userState, setUserState] = useRecoilState(userAtom);

  const login = async (loginUserInfo: LoginReqDto) => {
    // 뭔가 데이터 가져오는 함수
    const res = await postLogin(loginUserInfo);
    return res;
  }

const { mutate: loginMutate } = useMutation(
  {
    mutationFn: login,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        const userData = mutateData.data;
        setUserState({
          id: userData.id,
          accessToken: userData.accessToken,
          refreshToken: userData.refreshToken,
        });
        navigate("/");
      } else {
        setErrorMessage(mutateData.header.resultMessage);
      }
      setIsLoading(false);
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 400) {
        setErrorMessage("로그인 실패");
      } else {
        // 다른 서버 에러 처리
      }
      setIsLoading(false);
    },
  },
);


  const handleLogin = async(event: React.FormEvent) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }
    // 입력 값 검증
    if (!id || !pw) {
      setErrorMessage('아이디와 비밀번호를 확인해주세요.');
      return;
    }

    const request: LoginReqDto = {
      id: id,
      pw: pw,
    };

    setIsLoading(true);
    setTimeout(() => {
      loginMutate(request);
    }, 1000);
  };

  return (
    <div css={loginPageStyle}>
      {isLoading && <TailSpin color="#00BFFF" height={80} width={80} />}
      <form css={loginFormStyle} onSubmit={handleLogin}>
        <h2>로그인</h2>
        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <button type="submit">로그인</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
