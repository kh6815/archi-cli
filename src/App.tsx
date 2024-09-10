import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header, { HeaderType } from './components/Header';
import Main from './pages/Main';
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import PostListPage from './pages/PostPage/PostListPage';
import PostPage from './pages/PostPage/PostPage';

function App() {
  const [urlPath, setUrlPath] = useState(HeaderType.ORIGIN);
  const location = useLocation();

  useEffect(() => {
    // 로그인 페이지일 경우 LOGIN 타입을 설정, 그 외의 경우 ORIGIN 타입을 설정
    if (location.pathname === '/login') {
      setUrlPath(HeaderType.LOGIN);
    } else if(location.pathname === '/signup'){
      setUrlPath(HeaderType.SIGNUP)
    } else {
      setUrlPath(HeaderType.ORIGIN);
    }
  }, [ location ])
  
  return (
    <div className="App">
        <Header type = {urlPath}/>
				<Routes>
					<Route path="/" element={<Main />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/signup" element={<SignUpPage />}></Route>
					<Route path="/category/*" element={<PostListPage />}></Route>
          <Route path="/post/*" element={<PostPage />}></Route>
					{/* 상단에 위치하는 라우트들의 규칙을 모두 확인, 일치하는 라우트가 없는경우 처리 */}
					{/* <Route path="*" element={<NotFound />}></Route> */}
				</Routes>
      {/* 처음에는 메인 페이지를 보여주고 사용자가 글을 쓴다거나 댓글을 보려면 회원가입을 해야됨 */}
    </div>
  );
}

export default App;
