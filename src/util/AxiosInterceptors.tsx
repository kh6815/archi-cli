import { useEffect, useRef } from 'react';
import { useRecoilState, useResetRecoilState } from "recoil";
import { userAtom, UserData } from "../stores/user";
import { useNavigate } from "react-router-dom";
import { postRefresh } from "../api/authApi";
import { LoginDto } from '../api/dto/auth';
import { axiosClient } from "../util/axiosClient";
import React from 'react';

export default function AxiosInterceptors() {
  const [userState, setUserState] = useRecoilState(userAtom);
  const resetUserState = useResetRecoilState(userAtom);
  let isRefresh = false;
  const userStateRef = useRef<UserData>({
    id: null,
    accessToken: null,
    refreshToken: null,
    role: null,
    imgUrl: null,
    nickName: null
  });
  const navigate = useNavigate();


  const handleRefresh = async (refreshToken: string) => {
    isRefresh = true;
    const response = await postRefresh(refreshToken);
    isRefresh = false;

    return response;
  };

  const initUserState = (refreshRes: LoginDto) => {
    setUserState({
      id: refreshRes.id,
      accessToken: refreshRes.accessToken,
      refreshToken: refreshRes.refreshToken,
      role : refreshRes.role,
      imgUrl: refreshRes.imgUrl,
      nickName: refreshRes.nickName
    });
  };

  useEffect(() => {
    userStateRef.current = userState;
  }, [userState]);

  useEffect(() => {
    axiosClient.interceptors.request.use(
      config => {
        if (userStateRef.current.accessToken) {
          if (isRefresh) {
            config.headers.Authorization = userStateRef.current.refreshToken;
          } else {
            config.headers.Authorization = userStateRef.current.accessToken;
          }
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      },
    );

    axiosClient.interceptors.response.use(
      async response => {
        const resultCode = response.data.header.resultCode;

        if (resultCode === 2060 || resultCode === 2064) {
          // INVALID_TOKEN
          // MALFORMED_TOKEN
          if (
            userStateRef.current.refreshToken &&
            userStateRef.current.accessToken
          ) {
            const refreshRes = await handleRefresh(
              userStateRef.current.refreshToken,
            );

            // refresh 성공 - 응답 다시 요청
            if (refreshRes.header.resultCode === 0) {
              initUserState(refreshRes.data);
              return axiosClient(response.config);
            }

            // refresh 실패 - 로그인 페이지 이동
            navigate('/login');
          } else if (!userStateRef.current.refreshToken) {
            navigate('/login');
            throw new axiosClient.Cancel('Operation canceled by the user.');
          }
        }

        return response;
      },
      async error => {
        if (error.response.status === 401) {
          if (
            userStateRef.current.refreshToken &&
            userStateRef.current.accessToken
          ) {
            const refreshRes = await handleRefresh(
              userStateRef.current.refreshToken,
            );

            // refresh 성공 - 응답 다시 요청
            if (refreshRes.header.resultCode === 0) {
              initUserState(refreshRes.data);
              return axiosClient(error.response.config);
            }

            // refresh 실패 - 로그인 페이지 이동
            navigate('/login');
          } else if (!userStateRef.current.refreshToken) {
            navigate('login');
            throw new axiosClient.Cancel('Operation canceled by the user.');
          }
        } else {
        }
        return Promise.reject(error);
      },
    );
  }, []);
  return <></>;
}
