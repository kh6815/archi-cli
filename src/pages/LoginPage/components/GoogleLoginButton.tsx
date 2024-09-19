import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import {GoogleOAuthProvider} from "@react-oauth/google";
import React from "react";

interface GoogleLoginButtonProps {
  handleLoginSuccess: (response: CredentialResponse) => void;
  handleLoginFailure: () => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ handleLoginSuccess, handleLoginFailure }) => {
  const clientId = process.env.REACT_APP_PUBLIC_GOOGLE_CLIENT_KEY //클라이언트 아이디 입력

  return (
    <>
        {clientId &&       
        <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginFailure}
            />
      </GoogleOAuthProvider>}
    </>
  );
};

export default GoogleLoginButton;