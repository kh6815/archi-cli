/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { deleteNotice } from '@api/adminApi';
import { useMutation } from '@tanstack/react-query';
import { NoticeDto } from '@api/dto/post';
import { AxiosError } from 'axios';
import { DeleteNoticeReq } from '@api/dto/admin';
// Props 타입 정의
interface NoticeDeleteProps {
    notice: NoticeDto;
    close: (isSuccess: boolean) => void;
}

const modalStyle = css`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
  z-index: 1000;
`;

const titleStyle = css`
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const messageStyle = css`
  margin: 0;
  font-size: 16px;
  margin-bottom: 20px;
`;

const buttonContainerStyle = css`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const buttonStyle = css`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #fff;
  background: #007bff;
  transition: background 0.3s;
  
  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #d6d6d6;
    cursor: not-allowed;
  }
`;

const secondaryButtonStyle = css`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #fff;
  background: #6c757d;
  transition: background 0.3s;
  
  &:hover {
    background: #5a6268;
  }
`;

const NoticeDelete: React.FC<NoticeDeleteProps> = ({ notice, close }) => {
  const deleteNoticeApi = async (deleteNoticeReq: DeleteNoticeReq) => {
    const res = await deleteNotice(deleteNoticeReq);
    return res;
  }
  
  const { mutate: deleteNoticeMutate } = useMutation({
    mutationFn: deleteNoticeApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        close(true);
      } else {
        alert(mutateData.header.resultMessage);
      }
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 400) {
        alert("공지사항 삭제 실패");
      } else {
        alert("서버 오류 발생");
      }
    },
  });

  return (
    <div css={modalStyle}>
      <h2 css={titleStyle}>공지사항 삭제</h2>
      <div css={messageStyle}>해당 공지사항을 삭제하시겠습니까?</div>
      <div css={buttonContainerStyle}>
        <button
          onClick={() => deleteNoticeMutate({ ids: [notice.id] })}
          css={buttonStyle}
        >
          삭제
        </button>
        <button
          onClick={() => close(false)}
          css={secondaryButtonStyle}
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default NoticeDelete;
