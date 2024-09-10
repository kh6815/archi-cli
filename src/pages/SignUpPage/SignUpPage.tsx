/** @jsxImportSource @emotion/react */
import React from 'react';
import { useForm } from 'react-hook-form';
import { css } from '@emotion/react';

const signUpPageStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f4;
`;

const signUpFormStyle = css`
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

const errorMessageStyle = css`
  color: red;
  font-size: 12px;
  margin-bottom: 10px;
`;

interface SignUpFormData {
  id: string;
  pw: string;
  pwCheck: string;
  email: string;
  nickName: string;
}

const SignUpPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignUpFormData>();
  const password = watch('pw');

  const onSubmit = (data: SignUpFormData) => {
    console.log(data);
    // 회원가입 요청 처리 로직
  };

  return (
    <div css={signUpPageStyle}>
      <form css={signUpFormStyle} onSubmit={handleSubmit(onSubmit)}>
        <h2>회원가입</h2>

        <input 
          type="text" 
          placeholder="아이디" 
          {...register('id', { 
            required: '필수값입니다.',
            minLength: { value: 3, message: '3글자 이상 입력해야 합니다.' },
            maxLength: { value: 20, message: '20글자 이하로 입력해야 합니다.' }
          })} 
        />
        {errors.id && <p css={errorMessageStyle}>{errors.id.message}</p>}

        <input 
          type="password" 
          placeholder="비밀번호" 
          {...register('pw', {
            required: '필수값입니다.',
            pattern: {
              value: /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).{8,20}/,
              message: '비밀번호는 영문, 숫자, 특수문자를 포함하여 8자에서 20자 사이여야 합니다.'
            }
          })}
        />
        {errors.pw && <p css={errorMessageStyle}>{errors.pw.message}</p>}

        <input 
          type="password" 
          placeholder="비밀번호 확인" 
          {...register('pwCheck', {
            required: '필수값입니다.',
            validate: (value) => value === password || '비밀번호가 일치하지 않습니다.'
          })}
        />
        {errors.pwCheck && <p css={errorMessageStyle}>{errors.pwCheck.message}</p>}

        <input 
          type="text" 
          placeholder="이메일" 
          {...register('email', {
            required: '필수값입니다.',
            pattern: {
              value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/,
              message: '올바른 이메일 형식이 아닙니다.'
            }
          })}
        />
        {errors.email && <p css={errorMessageStyle}>{errors.email.message}</p>}

        <input 
          type="text" 
          placeholder="닉네임" 
          {...register('nickName', {
            required: '필수값입니다.',
            minLength: { value: 2, message: '2글자 이상 입력해야 합니다.' },
            maxLength: { value: 10, message: '10글자 이하로 입력해야 합니다.' }
          })}
        />
        {errors.nickName && <p css={errorMessageStyle}>{errors.nickName.message}</p>}

        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default SignUpPage;
