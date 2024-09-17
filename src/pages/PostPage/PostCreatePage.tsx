/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// import { ImageResize } from 'quill-image-resize-module-ts';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
// import { createBrowserHistory } from 'history';
import { AddFileReqDto, AddFileRes } from "../../api/dto/file";
import { AddPostReqDto } from "../../api/dto/post";
import {postAddFile} from "../../api/fileApi";
import {postAddPost} from "../../api/postApi";
import {getCategoryList} from "../../api/postApi";
import { ResponseDto } from '../../api/dto/responseDto';
import { CategoryDto } from '../../api/dto/admin';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { ImageActions } from '@xeger/quill-image-actions';
import { ImageFormats } from '@xeger/quill-image-formats';
import { axiosClient } from '@util/axiosClient';
 
Quill.register('modules/imageActions', ImageActions);
Quill.register('modules/imageFormats', ImageFormats);

// Quill 모듈 등록
// Quill.register('modules/ImageResize', ImageResize);

interface Category {
  id: number,
  categoryName: string,
}

type ModulesType = {
  toolbar: {
    container: unknown[][];
  };
};

const colors = [
  'transparent',
  'white',
  'red',
  'yellow',
  'green',
  'blue',
  'purple',
  'gray',
  'black',
];

const formats = [
  'header',
  // 'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'link',
  'color',
  'image',
  'background',
  'align',
  'float',
  'height',
  'width',
];


// const modules = {
//   imageActions: {},
//   imageFormats: {},
//   toolbar: [
//     [{ header: [1, 2, false] }],
//     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//     [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
//     ['link', 'image'],
//     [{ align: [] }, { color: colors }, { background: [] }, { formats: formats }],
//     ['clean'],
//   ],
//   // ImageResize: {
//   //   parchment: Quill.import('parchment'),
//   //   modules: ['Resize', 'DisplaySize'],
//   // },
// };

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

const selectWrapperStyle = css`
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start; /* 왼쪽 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
`;

const selectStyle = css`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 20px;
`;

const PostCreationPage = () => {
    // // 이미지 처리를 하는 핸들러
  const imageHandler = () => {
    console.log("이미지 핸들러 입니다.")
  };
  const quillRef = useRef<ReactQuill>(null);
  const modules = useMemo<ModulesType>(() => {
    return {
      imageActions: {},
      imageFormats: {},
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }, "link", "image"],
          ["clean"],
        ],
        ImageResize: {
          parchment: Quill.import('parchment')
        },
        // handlers: {
        //   // 이미지 처리는 우리가 직접 imageHandler라는 함수로 처리할 것이다.
        //   image: imageHandler,
        // },
      },
    }
  }, []);

  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // const [savaFileIdList, setSavaFileIdList] = useState<number[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  const [categorySelected, setCategorySelected] = useState<number>(1);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value)
    setCategorySelected(Number(e.target.value));
  };

  const reverseRecursionCategory = (categoryList: CategoryDto[]) => {
    categoryList.forEach((category) => {

      setCategoryList(prevList => [...prevList, {
        id: category.id,
        categoryName: category.categoryName,
      }]);

        if(category.subCategories.length > 0){
          reverseRecursionCategory(category.subCategories)
        }
    })
  }

  const getCategoryListApi = async () => {
    const res = await getCategoryList();
    return res;
  }
  
  const { mutate: getCategoryListMutate } = useMutation(
  {
    mutationFn: getCategoryListApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        const data = mutateData.data;

        reverseRecursionCategory(data.categoryList);
        setCategorySelected(data.categoryList[0].id);
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

  const addFileApi = async (addFileApi: AddFileReqDto) => {
    const res = await postAddFile(addFileApi);
    return res;
  }
  
//   const { mutate: addFileMutate } = useMutation(
//   {
//     mutationFn: addFileApi,
//     onSuccess: mutateData => {
//       if (mutateData.header.resultCode === 0) {
//         const data = mutateData.data;
  
//         // 성공 시 fileId를 리스트에 추가
//         // setSavaFileIdList(prevList => [...prevList, data.fileId]);
//       } else {
//         alert(mutateData.header.resultMessage);
//       }
//     },
//     onError: (error: AxiosError) => {
//         if (error.response?.status === 400) {
//             alert("파일 업로드 실패");
//           } else {
//             alert("서버 오류 발생");
//           }
//     },
//   },
//   );

  const addPostApi = async (addPostApi: AddPostReqDto) => {
    const res = await postAddPost(addPostApi);
    return res;
  }
  
  const { mutate: addPostMutate } = useMutation(
  {
    mutationFn: addPostApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        const data = mutateData.data;

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

  // const uploadImage = async (images: NodeListOf<HTMLImageElement>) => {
  //       for(let i = 0; i < images.length; i++){
  //           const img = images[i];
  //           const src = img.getAttribute('src');
  //           if (src && src.startsWith('data:image/')) {
  //               const response = await fetch(src);
  //               const blob = await response.blob();
  //               const file = new File([blob], `image${i}.png`, { type: blob.type });

  //               const fileReq: AddFileReqDto = { file };

  //               const res = await addFileApi(fileReq);
  //               if(res.header.resultCode === 0){
  //                   // 성공
  //                   const fileRes = res.data;
  //                   img.setAttribute('src', fileRes.fileUrl);
  //                   setSavaFileIdList(prevList => [...prevList, fileRes.fileId]);
  //               } else {
  //                   // 실패
  //                   alert("파일 등록 실패");
  //                   return false;
  //               }
  //           }
  //       }
  //       return true;
  //   }
 
  const handleSave = async () => {
    if (title && content) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const images = doc.querySelectorAll('img');
      const savaFileIdList: number[] = [];

      // const isUploadFile = uploadImage(images);
  
      for(let i = 0; i < images.length; i++){
        const img = images[i];
        const src = img.getAttribute('src');
        if (src && src.startsWith('data:image/')) {
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
        // const fileIds = await Promise.all(uploadImagePromises as Promise<number>[]);
        // console.log("fileIds = " + fileIds);
        
        // Ensure `savaFileIdList` is updated correctly
        // setSavaFileIdList(prevList => [...prevList, ...fileIds]);
  
        const updatedContent = doc.body.innerHTML;
        
        console.log('게시글 저장:', { title, content: updatedContent });
  
        const addPostReq: AddPostReqDto = {
          categoryId: categorySelected,
          title: title,
          content: updatedContent,
          imgFileIdList: savaFileIdList,
        };
  
        await addPostMutate(addPostReq);
        console.log('게시글 저장 요청 완료');
        
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

  useEffect(() => {
    getCategoryListMutate();
  }, [])

  useEffect(() => {
    if(categoryList.length > 0){
      setCategorySelected(categoryList[0].id)
    }
  }, [categoryList])

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
                게시글 저장
            </button>
        </div>
        <div css={selectWrapperStyle}>
          <select
            onChange={handleSelect}
            value={categorySelected}
            css={selectStyle}
          >
            {categoryList.map((item) => (
              <option value={item.id} key={item.categoryName}>
                {item.categoryName}
              </option>
            ))}
          </select>
          {/* <Autocomplete
            disablePortal
            options={categoryList}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Movie" />}
          /> */}
        </div>
      <div css={titleWrapperStyle}>
        <input
          type="text"
          placeholder="게시글 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          css={titleInputStyle}
        />
      </div>
      {/* <ReactQuill
        style={{ height: '600px' }}
        theme="snow"
        modules={modules}
        value={content}
        onChange={(value) => setContent(value)}
      /> */}
        <ReactQuill
          theme="snow"
          ref={quillRef}
          value={content}
          formats={formats}
          onChange={(value) => setContent(value)}
          modules={modules}
          style={{ height: '600px' }}
        />
    </div>
  );
};

export default PostCreationPage;
