/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const footerStyle = css`
  background-color: #333;
  color: white;
  padding: 20px;
  text-align: center;
  width: 100%;
  box-sizing: border-box; /* 패딩 포함 너비 계산 */

  p {
    margin: 0;
  }

  a {
    color: white;
    text-decoration: none;
  }
`;

const Footer: React.FC = () => {
  return (
    <footer css={footerStyle}>
      <p>&copy; 2024 archi 백엔드 커뮤니티. All rights reserved.</p>
      <p><a href="/about">커뮤니티 사이트 입니다.</a> | <a href="/contact">링크드인 사이트</a></p>
    </footer>
  );
}

export default Footer;
