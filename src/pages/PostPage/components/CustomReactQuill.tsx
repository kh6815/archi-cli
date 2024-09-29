/** @jsxImportSource @emotion/react */
import { useMemo, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { ImageActions } from "@xeger/quill-image-actions";
import { ImageFormats } from "@xeger/quill-image-formats";

Quill.register("modules/imageActions", ImageActions);
Quill.register("modules/imageFormats", ImageFormats);

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
// };

// Props 타입 정의
interface CustomReactQuillProps {
    content: string;                        // content 타입
    setContent: React.Dispatch<React.SetStateAction<string>>;  // setContent 타입
  }


const CustomReactQuill: React.FC<CustomReactQuillProps> = ({ content, setContent }) => {
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
          [{ color: colors }, { background: [] }],
          [{ align: [] }, "link", "image"],
          ["clean"],
        ],
        ImageResize: {
          parchment: Quill.import('parchment')
        },
      },
    }
  }, []);
 
  return (
      <ReactQuill
        theme="snow"
        ref={quillRef}
        value={content}
        formats={formats}
        onChange={(value) => setContent(value)}
        modules={modules}
        style={{ height: '600px' }}
      />
  );
};

export default CustomReactQuill;
