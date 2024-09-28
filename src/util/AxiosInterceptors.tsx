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
  let isRefreshing = false;  // 토큰 갱신 상태 관리
  const refreshSubscribers: ((token: string) => void)[] = [];  // 대기 중인 요청 관리
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
    const response = await postRefresh(refreshToken);
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

  const onRefreshed = (newAccessToken: string) => {
    refreshSubscribers.forEach(callback => callback(newAccessToken));
    refreshSubscribers.length = 0; // 대기 중인 요청을 처리한 후 초기화
  };

  const addSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
  };

  useEffect(() => {
    userStateRef.current = userState;
  }, [userState]);

  useEffect(() => {
    axiosClient.interceptors.request.use(
      config => {
        // if (userStateRef.current.accessToken) {
        //   if (isRefresh) {
        //     config.headers.Authorization = userStateRef.current.refreshToken;
        //   } else {
        //     config.headers.Authorization = userStateRef.current.accessToken;
        //   }
        // }
        if (userStateRef.current.accessToken) {
          config.headers.Authorization = `${isRefreshing ? userStateRef.current.refreshToken : userStateRef.current.accessToken}`;
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

          if (!isRefreshing) {
            isRefreshing = true;
            try {
              // 토큰 갱신 요청
              const refreshRes = await handleRefresh(userStateRef.current.refreshToken!);

              // 갱신 성공 시
              if (refreshRes.header.resultCode === 0) {
                initUserState(refreshRes.data);
                isRefreshing = false;
                onRefreshed(refreshRes.data.accessToken); // 대기 중인 요청 처리
                // return axiosClient(originalRequest); // 원래 요청 재시도
                return axiosClient(response.config)
              }

              // 갱신 실패 시 로그아웃 처리
              resetUserState();
              navigate('/login');
              return Promise.reject(new Error('Token refresh failed'));
            } catch (err) {
              isRefreshing = false;
              resetUserState();
              navigate('/login');
              return Promise.reject(err);
            }
          }

          // 토큰 갱신이 진행 중일 때 대기
          return new Promise((resolve) => {
            addSubscriber((newToken: string) => {
              response.config.headers.Authorization = `${newToken}`;
              resolve(axiosClient(response.config)); // 대기 중인 요청 처리
            });
          });

          // if (
          //   userStateRef.current.refreshToken &&
          //   userStateRef.current.accessToken
          // ) {
          //   const refreshRes = await handleRefresh(
          //     userStateRef.current.refreshToken,
          //   );

          //   // refresh 성공 - 응답 다시 요청
          //   if (refreshRes.header.resultCode === 0) {
          //     initUserState(refreshRes.data);
          //     return axiosClient(response.config);
          //   }

          //   // refresh 실패 - 로그인 페이지 이동
          //   navigate('/login');
          // } else if (!userStateRef.current.refreshToken) {
          //   navigate('/login');
          //   throw new axiosClient.Cancel('Operation canceled by the user.');
          // }
        }

        return response;
      },
      async error => {
        if (error.response.status === 401) {
          // const originalRequest = error.config;
          if (!isRefreshing) {
            isRefreshing = true;
            try {
              // 토큰 갱신 요청
              const refreshRes = await handleRefresh(userStateRef.current.refreshToken!);

              // 갱신 성공 시
              if (refreshRes.header.resultCode === 0) {
                initUserState(refreshRes.data);
                isRefreshing = false;
                onRefreshed(refreshRes.data.accessToken); // 대기 중인 요청 처리
                // return axiosClient(originalRequest); // 원래 요청 재시도
                return axiosClient(error.response.config); // 원래 요청 재시도
              }

              // 갱신 실패 시 로그아웃 처리
              resetUserState();
              navigate('/login');
              return Promise.reject(new Error('Token refresh failed'));
            } catch (err) {
              isRefreshing = false;
              resetUserState();
              navigate('/login');
              return Promise.reject(err);
            }
          }

          // 토큰 갱신이 진행 중일 때 대기
          return new Promise((resolve) => {
            addSubscriber((newToken: string) => {
              error.response.config.headers.Authorization = `${newToken}`;
              resolve(axiosClient(error.response.config)); // 대기 중인 요청 처리
            });
          });
          // if (
          //   userStateRef.current.refreshToken &&
          //   userStateRef.current.accessToken
          // ) {
          //   const refreshRes = await handleRefresh(
          //     userStateRef.current.refreshToken,
          //   );

          //   // refresh 성공 - 응답 다시 요청
          //   if (refreshRes.header.resultCode === 0) {
          //     initUserState(refreshRes.data);
          //     return axiosClient(error.response.config);
          //   }

          //   // refresh 실패 - 로그인 페이지 이동
          //   navigate('/login');
          // } else if (!userStateRef.current.refreshToken) {
          //   navigate('login');
          //   throw new axiosClient.Cancel('Operation canceled by the user.');
          // }
        } else {
        }
        return Promise.reject(error);
      },
    );
  }, []);
  return <></>;
}





















// export default function AxiosInterceptors() {
//   const [userState, setUserState] = useRecoilState(userAtom);
//   const resetUserState = useResetRecoilState(userAtom);
//   let isRefreshing = false;  // 토큰 갱신 상태 관리
//   const refreshSubscribers: ((token: string) => void)[] = [];  // 대기 중인 요청 관리
//   const userStateRef = useRef<UserData>({
//     id: null,
//     accessToken: null,
//     refreshToken: null,
//     role: null,
//     imgUrl: null,
//     nickName: null
//   });
//   const navigate = useNavigate();

//   const handleRefresh = async (refreshToken: string) => {
//     const response = await postRefresh(refreshToken);
//     return response;
//   };

//   const initUserState = (refreshRes: LoginDto) => {
//     setUserState({
//       id: refreshRes.id,
//       accessToken: refreshRes.accessToken,
//       refreshToken: refreshRes.refreshToken,
//       role : refreshRes.role,
//       imgUrl: refreshRes.imgUrl,
//       nickName: refreshRes.nickName
//     });
//   };

//   const onRefreshed = (newAccessToken: string) => {
//     refreshSubscribers.forEach(callback => callback(newAccessToken));
//     refreshSubscribers.length = 0; // 대기 중인 요청을 처리한 후 초기화
//   };

//   const addSubscriber = (callback: (token: string) => void) => {
//     refreshSubscribers.push(callback);
//   };

//   useEffect(() => {
//     userStateRef.current = userState;
//   }, [userState]);

//   useEffect(() => {
//     axiosClient.interceptors.request.use(
//       config => {
//         if (userStateRef.current.accessToken) {
//           config.headers.Authorization = `Bearer ${isRefreshing ? userStateRef.current.refreshToken : userStateRef.current.accessToken}`;
//         }
//         return config;
//       },
//       error => {
//         return Promise.reject(error);
//       },
//     );

//     axiosClient.interceptors.response.use(
//       response => response, // 성공 응답 처리
//       async error => {
//         const originalRequest = error.config;

//         // 401 Unauthorized 또는 토큰 문제 발생 시
//         if (error.response?.status === 401 && !originalRequest._retry) {
//           originalRequest._retry = true;

//           if (!isRefreshing) {
//             isRefreshing = true;
//             try {
//               // 토큰 갱신 요청
//               const refreshRes = await handleRefresh(userStateRef.current.refreshToken!);

//               // 갱신 성공 시
//               if (refreshRes.header.resultCode === 0) {
//                 initUserState(refreshRes.data);
//                 isRefreshing = false;
//                 onRefreshed(refreshRes.data.accessToken); // 대기 중인 요청 처리
//                 return axiosClient(originalRequest); // 원래 요청 재시도
//               }

//               // 갱신 실패 시 로그아웃 처리
//               resetUserState();
//               navigate('/login');
//               return Promise.reject(new Error('Token refresh failed'));
//             } catch (err) {
//               isRefreshing = false;
//               resetUserState();
//               navigate('/login');
//               return Promise.reject(err);
//             }
//           }

//           // 토큰 갱신이 진행 중일 때 대기
//           return new Promise((resolve) => {
//             addSubscriber((newToken: string) => {
//               originalRequest.headers.Authorization = `Bearer ${newToken}`;
//               resolve(axiosClient(originalRequest)); // 대기 중인 요청 처리
//             });
//           });
//         }

//         return Promise.reject(error);
//       },
//     );
//   }, []);

//   return <></>;
// }
