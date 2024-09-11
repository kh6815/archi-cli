/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { css } from '@emotion/react';
import { getEmailCheck, getIdCheck, getNickNameCheck, postSignUp } from '../../api/userApi';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

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

const possibleMessageStyle = css`
  color: green;
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

  const [isLoading, setIsLoading] = useState(false);

  const [idCheck, setIdCheck] = useState<Boolean | null>(null);
  const [emailCheck, setEmailCheck] = useState<Boolean | null>(null);
  const [nickNameCheck, setNickNameCheck] = useState<Boolean | null>(null);

  const navigate = useNavigate();

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;

  const onSubmit = (data: SignUpFormData) => {
    console.log("회원가입 = " + data);
    // 회원가입 요청 처리 로직

    if(!(idCheck && emailCheck && nickNameCheck)){
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      signUpMutate(data);
    }, 1000);
  };

  const checkIdApi = async (id: string) => {
    const res = await getIdCheck(id);
    return res;
  }

  const handleIdChange = () => {
    setIdCheck(null);
  }

  const checkEmailApi = async (email: string) => {
    const res = await getEmailCheck(email);
    return res;
  }

  const handleEmailChange = () => {
    setEmailCheck(null);
  }

  const checkNickNameApi = async (nickName: string) => {
    const res = await getNickNameCheck(nickName);
    return res;
  }

  const handleNickNameChange = () => {
    setNickNameCheck(null);
  }

  const { mutate: checkIdMutate } = useMutation(
    {
      mutationFn: checkIdApi,
      onSuccess: mutateData => {
        if (mutateData.header.resultCode === 0) {
          if(!mutateData.data){
            setIdCheck(true)
          } else {
            setIdCheck(false)
          }
        } else {
          errors.id!.message = mutateData.header.resultMessage;
          setIdCheck(false)
        }
      },
      onError: (error: AxiosError) => {
        setIdCheck(null)
        if (error.response?.status === 400) {
          alert("아이디 체크 실패")
        } else {
          // 다른 서버 에러 처리
        }
      },
    },
  );

  const { mutate: checkEmailMutate } = useMutation(
    {
      mutationFn: checkEmailApi,
      onSuccess: mutateData => {
        if (mutateData.header.resultCode === 0) {
          if(!mutateData.data){
            setEmailCheck(true)
          } else {
            setEmailCheck(false)
          }
        } else {
          errors.id!.message = mutateData.header.resultMessage;
          setEmailCheck(false)
        }
      },
      onError: (error: AxiosError) => {
        setEmailCheck(null)
        if (error.response?.status === 400) {
          alert("이메일 체크 실패")
        } else {
          // 다른 서버 에러 처리
        }
      },
    },
  );

  const { mutate: checkNickNameMutate } = useMutation(
    {
      mutationFn: checkNickNameApi,
      onSuccess: mutateData => {
        if (mutateData.header.resultCode === 0) {
          if(!mutateData.data){
            setNickNameCheck(true)
          } else {
            setNickNameCheck(false)
          }
        } else {
          errors.id!.message = mutateData.header.resultMessage;
          setNickNameCheck(false)
        }
      },
      onError: (error: AxiosError) => {
        setNickNameCheck(null)
        if (error.response?.status === 400) {
          alert("닉네임 체크 실패")
        } else {
          // 다른 서버 에러 처리
        }
      },
    },
  );

  const signUpApi = async (signUpReq: SignUpFormData) => {
    // 뭔가 데이터 가져오는 함수
    const res = await postSignUp(signUpReq);
    return res;
  }

  const { mutate: signUpMutate } = useMutation(
    {
      mutationFn: signUpApi,
      onSuccess: mutateData => {
        if (mutateData.header.resultCode === 0) {
          navigate("/login");
        } else {
          alert(mutateData.header.resultMessage);
        }
        setIsLoading(false);
      },
      onError: (error: AxiosError) => {
        if (error.response?.status === 400) {
          alert("회원가입 실패");
        } else {
          // 다른 서버 에러 처리
        }
        setIsLoading(false);
      },
    },
  );

  return (
    <div css={signUpPageStyle}>
      {isLoading && <TailSpin color="#00BFFF" height={80} width={80} />}
      <form css={signUpFormStyle} onSubmit={handleSubmit(onSubmit)}>
        <h2>회원가입</h2>

        <input 
          type="text" 
          placeholder="아이디" 
          {...register('id', { 
            required: '필수값입니다.',
            minLength: { value: 3, message: '3글자 이상 입력해야 합니다.' },
            maxLength: { value: 20, message: '20글자 이하로 입력해야 합니다.' },
            onBlur: (e) => {
              if(e.target.value.length >= 3 && e.target.value.length <= 20){
                checkIdMutate(e.target.value)
              }
            },
            onChange: (e) => handleIdChange()
          })} 
        />
        {idCheck === true && <p css={possibleMessageStyle}>사용가능한 아이디입니다.</p>}
        {idCheck === false && <p css={errorMessageStyle}>이미 존재하는 아이디입니다.</p>}
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
              value: emailRegex,
              message: '올바른 이메일 형식이 아닙니다.'
            },
            onBlur: (e) => {
              if(emailRegex.test(e.target.value)){
                checkEmailMutate(e.target.value)
              }
            },
            onChange: (e) => handleEmailChange()
          })}
        />
        {emailCheck === true && <p css={possibleMessageStyle}>사용가능한 이메일입니다.</p>}
        {emailCheck === false && <p css={errorMessageStyle}>이미 존재하는 이메일입니다.</p>}
        {errors.email && <p css={errorMessageStyle}>{errors.email.message}</p>}

        <input 
          type="text" 
          placeholder="닉네임" 
          {...register('nickName', {
            required: '필수값입니다.',
            minLength: { value: 2, message: '2글자 이상 입력해야 합니다.' },
            maxLength: { value: 10, message: '10글자 이하로 입력해야 합니다.' },
            onBlur: (e) => {
              if(e.target.value.length >= 2 && e.target.value.length <= 10){
                checkNickNameMutate(e.target.value)
              }
            },
            onChange: (e) => handleNickNameChange()
          })}
        />
        {nickNameCheck === true && <p css={possibleMessageStyle}>사용가능한 닉네임입니다.</p>}
        {nickNameCheck === false && <p css={errorMessageStyle}>이미 존재하는 닉네임입니다.</p>}
        {errors.nickName && <p css={errorMessageStyle}>{errors.nickName.message}</p>}

        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default SignUpPage;
