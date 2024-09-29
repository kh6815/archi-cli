/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
// import { createBrowserHistory } from 'history';
import { AddFileReqDto } from "../../api/dto/file";
import {postAddFile} from "../../api/fileApi";
import {postAddNotice} from "../../api/adminApi";
import { AddNoticeReq } from '../../api/dto/admin';
import CustomReactQuill from './components/CustomReactQuill';

// 스타일링
const containerStyle = css`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const btnWrapperStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const titleWrapperStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const titleInputStyle = css`
  width: 100%;
  padding: 10px;
  font-size: 1.2rem;
`;

const saveButtonStyle = css`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:disabled {
    background-color: #bdbdbd;
    cursor: not-allowed;
  }
`;

const closeButtonStyle = css`
  background-color: red;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
`;

const NoticeCreationPage = () => {

  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const addFileApi = async (addFileApi: AddFileReqDto) => {
    const res = await postAddFile(addFileApi);
    return res;
  }

  const addNoticeApi = async (addNoticeReq: AddNoticeReq) => {
    const res = await postAddNotice(addNoticeReq);
    return res;
  }
  
  const { mutate: addNoticeMutate } = useMutation(
  {
    mutationFn: addNoticeApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        // const data = mutateData.data;

        navigate("/");
      } else {
        alert(mutateData.header.resultMessage);
      }
    },
    onError: (error: AxiosError) => {
        if (error.response?.status === 400) {
            alert("게시글 업로드 실패");
          } else {
            alert("서버 오류 발생");
          }
    },
  },
  );
 
  const handleSave = async () => {
    if (title && content) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const images = doc.querySelectorAll('img');
      const savaFileIdList: number[] = [];

    //   const isUploadFile = uploadImage(images);
  
      for(let i = 0; i < images.length; i++){
        const img = images[i];
        const src = img.getAttribute('src');
        if (src && src.startsWith('data:image/')) {
            const response = await fetch(src);
            const blob = await response.blob();
            const file = new File([blob], `image${i}.png`, { type: blob.type });

            const fileReq: AddFileReqDto = { file };

            const res = await addFileApi(fileReq);
            if(res.header.resultCode === 0){
                // 성공
                const fileRes = res.data;
                img.setAttribute('src', fileRes.fileUrl);
                savaFileIdList.push(fileRes.fileId)
                // setSavaFileIdList(prevList => [...prevList, fileRes.fileId]);
            } else {
                // 실패
                alert("파일 등록 실패");
                return false;
            }
        }
    }
  
      try {
        const updatedContent = doc.body.innerHTML;
        
        console.log('공지사항 저장:', { title, content: updatedContent });
  
        const addPostReq: AddNoticeReq = {
          title: title,
          content: updatedContent,
          imgFileIdList: savaFileIdList,
        };
  
        await addNoticeMutate(addPostReq);
        console.log('공지사항 저장 요청 완료');
        
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
      }
    }
  };
  

  const handleClose = () => {
    if (title && content) {
        if(window.confirm("해당 페이지를 벗어나겠습니까?")){
            navigate('/');
        } else {
            return;
        }
    } else {
        navigate('/');
    }
  }

  return (
    <div css={containerStyle}>
        <div css={btnWrapperStyle}>
            <button
                css={closeButtonStyle}
                onClick={handleClose}
                >
                닫기
            </button>
            <button
                css={saveButtonStyle}
                onClick={handleSave}
                disabled={!title || !content}
                >
                공지사항 저장
            </button>
        </div>
      <div css={titleWrapperStyle}>
        <input
          type="text"
          placeholder="공지사항 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          css={titleInputStyle}
        />
      </div>
      <CustomReactQuill 
        content={content}
        setContent={setContent}
      />
    </div>
  );
};

export default NoticeCreationPage;
