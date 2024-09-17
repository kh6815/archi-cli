/** @jsxImportSource @emotion/react */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { getCategoryList, patchUpdateComment, updatePost } from '@api/postApi';
import { useMutation } from '@tanstack/react-query';
import { PostCommentListDto, PostDto, UpdateCommentReq, UpdatePostReq } from '@api/dto/post';
import { AxiosError } from 'axios';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { ImageActions } from "@xeger/quill-image-actions";
import { ImageFormats } from "@xeger/quill-image-formats";
import { useNavigate } from 'react-router-dom';
import { CategoryDto } from '@api/dto/admin';
import { Category } from '@mui/icons-material';
import { AddFileReqDto, AddFileRes } from '@api/dto/file';
import { postAddFile } from '@api/fileApi';

Quill.register("modules/imageActions", ImageActions);
Quill.register("modules/imageFormats", ImageFormats);

type ModulesType = {
  toolbar: {
    container: unknown[][];
  };
};

interface Category {
  id: number,
  categoryName: string,
}

// Props 타입 정의
interface PostUpdateProps {
  postData: PostDto;
  close: (isSuccess: boolean) => void;
}

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
  'float',
  'height',
  'width',
  'header',
  'bold',
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
];

const modules = {
  imageActions: {},
  imageFormats: {},
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image'],
    [{ align: [] }, { color: colors }, { background: [] }, { formats: formats }],
    ['clean'],
  ],
};


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

const PostUpdate: React.FC<PostUpdateProps> = ({ postData, close }) => {
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
        }
      },
    }
  }, []);
  const [post, setPost] = useState(postData);
  const navigate = useNavigate();

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  // const [savaFileIdList, setSavaFileIdList] = useState<number[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [categorySelected, setCategorySelected] = useState<number>(1);

  const [addFileList, setAddFileList] = useState<AddFileRes[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<AddFileRes[]>([]);

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

      if(category.categoryName === post.categoryName){
        setCategorySelected(category.id);
      }

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

  // const patchCommentApi = async (updateCommentInfo: UpdateCommentReq) => {
  //   const res = await patchUpdateComment(updateCommentInfo);
  //   return res;
  // }

  // const { mutate: patchCommentMutate } = useMutation({
  //   mutationFn: patchCommentApi,
  //   onSuccess: (mutateData) => {
  //     if (mutateData.header.resultCode === 0) {
  //       close(true);
  //     } else {
  //       alert(mutateData.header.resultMessage);
  //     }
  //   },
  //   onError: (error: AxiosError) => {
  //     if (error.response?.status === 400) {
  //       alert("댓글 업데이트 실패");
  //     } else {
  //       alert("서버 오류 발생");
  //     }
  //   },
  // });

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
    
    // for(let i = 0; i < images.length; i++){
    //   const img = images[i];
    //   const src = img.getAttribute('src');

    //   if (src && src.startsWith('data:image/')) {
    //     const response = await fetch(src);
    //     const blob = await response.blob();
    //     const file = new File([blob], `image${i}.png`, { type: blob.type });

    //     // 새로운 파일 등록
    //     addFileList.push(file);
    //   } else if(src && src.startsWith('https:')){
        
    //     const findFile = post.fileList.find(((file) => {
    //       if(file.fileUrl === src){
    //         return file
    //       }
    //     }))

    //     if(findFile !== undefined){
    //       // 이미 있던거는 파일 이름을 수정
    //       updateFileIdMap.set(findFile.fileId, `image${i}.png`);
    //     } 

    //     haveContentFileUrlList.push(src);
    //   }
    // }

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
        const findFile = post.fileList.find(((file) => {
          if(file.fileUrl === src){
            return file
          }
        }))

        console.log('findFile = ' + findFile)

        if(findFile !== undefined){
          // 이미 있던거는 파일 이름을 수정
          updateFileMap.set(findFile.fileId, `image${i}.png`);
        } 

        haveContentFileUrlList.push(src);
      }
  }
      //삭제 리스트 찾기
      post.fileList.forEach((file) => {
        if(!haveContentFileUrlList.includes(file.fileUrl)){
          deleteFileIdList.push(file.fileId);
        }
      })
  
      try {  
        const updatedContent = doc.body.innerHTML;
        
        console.log('게시글 수정:', { title, content: updatedContent });

        console.log("updateFileMap = " + updateFileMap);
  
        const updatePostReq: UpdatePostReq = {
          id: post.id,
          categoryId: categorySelected,
          title: title,
          content: updatedContent,
          addFileIdList: addFileIdList,
          updateFileMap: Object.fromEntries(updateFileMap),
          deleteFileIdList: deleteFileIdList
        };

        await updatePost(updatePostReq);
        close(true);
        console.log('게시글 수정 요청 완료');
        
      } catch (error) {
        console.error('게시글 수정 요청 실패:', error);
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

  useEffect(() => {
    getCategoryListMutate();
  }, [])

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
                게시글 수정
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
    </div>
  );
}

export default PostUpdate;
