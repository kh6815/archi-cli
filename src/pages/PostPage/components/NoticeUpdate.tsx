/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { css } from '@emotion/react';
import { updateNotice } from '@api/adminApi';
import { NoticeDto } from '@api/dto/post';
import 'react-quill/dist/quill.snow.css';
import { UpdateNoticeReq } from '@api/dto/admin';
import { AddFileReqDto } from '@api/dto/file';
import { postAddFile } from '@api/fileApi';
import CustomReactQuill from './CustomReactQuill';


// Props 타입 정의
interface NoticeUpdateProps {
  noticeData: NoticeDto;
  close: (isSuccess: boolean) => void;
}


// 스타일링

const modalStyle = css`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 800px; /* Adjust as needed */
  max-height: 80vh; /* Ensures modal doesn't exceed viewport height */
  overflow-y: auto; /* Enables vertical scrolling */
  z-index: 1000;
`;


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

// const selectWrapperStyle = css`
//   margin-bottom: 20px;
//   display: flex;
//   justify-content: flex-start; /* 왼쪽 정렬 */
//   align-items: center; /* 수직 중앙 정렬 */
// `;

// const selectStyle = css`
//   padding: 10px;
//   font-size: 1rem;
//   border: 1px solid #ccc;
//   border-radius: 5px;
//   margin-right: 20px;
// `;

const NoticeUpdate: React.FC<NoticeUpdateProps> = ({ noticeData, close }) => {
  const [notice] = useState(noticeData);
  // const navigate = useNavigate();

  const [title, setTitle] = useState(notice.title);
  const [content, setContent] = useState(notice.content);

  // const [addFileList, setAddFileList] = useState<AddFileRes[]>([]);
  // const [deleteFileList, setDeleteFileList] = useState<AddFileRes[]>([]);

  const addFileApi = async (addFileApi: AddFileReqDto) => {
    const res = await postAddFile(addFileApi);
    return res;
  }

  const handleUpdate = async () => {
    if (title && content) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const images = doc.querySelectorAll('img');
      const addFileIdList: number[] = [];
      const updateFileMap = new Map<number, string>();
      // const updateFileIdMap: Map<number, string> = new Map();
      const deleteFileIdList: number[] = [];

    const haveContentFileUrlList: string[] = [];

    for(let i = 0; i < images.length; i++){
      const img = images[i];
      const src = img.getAttribute('src');

      console.log("src = " + src);
      if (src && src.startsWith('data:image/')) {
          console.log("data:image/ = " + src);
          const response = await fetch(src);
          const blob = await response.blob();
          
          // 원래 파일 이름 가져오기 (이미지에 파일 이름을 넣어놓았다고 가정)
          const originalFileName = img.getAttribute('data-filename') || `image${i}.png`;
          const file = new File([blob], originalFileName, { type: blob.type });

          const fileReq: AddFileReqDto = { file };

          const res = await addFileApi(fileReq);
          if(res.header.resultCode === 0){
              // 성공
              const fileRes = res.data;
              img.setAttribute('src', fileRes.fileUrl);
              addFileIdList.push(fileRes.fileId)
              // setSavaFileIdList(prevList => [...prevList, fileRes.fileId]);
          } else {
              // 실패
              alert("파일 등록 실패");
              return false;
          }
      } else if(src && src.startsWith('https:')){
        console.log("https: = " + src);
        // const findFile = notice.fileList.find(((file) => {
        //   if(file.fileUrl === src){
        //     return file
        //   }
        // }))

        const findFile = notice.fileList.find(file => file.fileUrl === src);

        console.log('findFile = ' + findFile)

        if(findFile !== undefined){
          // 이미 있던거는 파일 이름을 수정
          updateFileMap.set(findFile.fileId, `image${i}.png`);
        } 

        haveContentFileUrlList.push(src);
      }
  }
      //삭제 리스트 찾기
      notice.fileList.forEach((file) => {
        if(!haveContentFileUrlList.includes(file.fileUrl)){
          deleteFileIdList.push(file.fileId);
        }
      })
  
      try {  
        const updatedContent = doc.body.innerHTML;
        
        console.log('공지사항 수정:', { title, content: updatedContent });

        console.log("updateFileMap = " + updateFileMap);
  
        const updateNoticeReq: UpdateNoticeReq = {
          id: notice.id,
          title: title,
          content: updatedContent,
          addFileIdList: addFileIdList,
          updateFileMap: Object.fromEntries(updateFileMap),
          deleteFileIdList: deleteFileIdList
        };

        await updateNotice(updateNoticeReq);
        close(true);
        console.log('공지사항 수정 요청 완료');
        
      } catch (error) {
        console.error('공지사항 수정 요청 실패:', error);
      }
    }
  };
  

  const handleClose = () => {
    if (title && content) {
        if(window.confirm("해당 페이지를 벗어나겠습니까?")){
          close(false)
        } else {
            return;
        }
    }
  }

  return (
    <div css={modalStyle}>
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
                onClick={handleUpdate}
                disabled={!title || !content}
                >
                공지사항 수정
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
    </div>
  );
}

export default NoticeUpdate;
