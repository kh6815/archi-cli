# 커뮤니티 웹사이트 프론트엔드 (React 기반)
이 프로젝트는 최신 웹 기술을 활용하여 구축된 커뮤니티 웹사이트의 프론트엔드입니다. 
React를 사용하여 사용자에게 직관적이고 반응성이 뛰어난 UI를 제공하며, 다양한 사용자 상호작용 기능과 모바일 최적화를 지원합니다. 
AWS S3 및 CloudFront를 통해 정적 자산을 배포하여 빠르고 안정적인 콘텐츠 제공이 가능합니다.

👉 [커뮤니티 사이트 접속하기](https://d3lm2l0zcnsf11.cloudfront.net)

전체 소개글은 해당 프로젝트를 참고해주세요
- [API 서버](https://github.com/kh6815/archi)

## 주요 기능
- 어드민 기능: 관리자 계정을 통해 공지사항을 등록 및 수정할 수 있으며, 카테고리 설정을 변경할 수 있는 기능을 제공합니다.
- 회원 기능: 회원가입, 로그인, 인증 및 JWT 기반 토큰 관리 기능을 통해 사용자의 계정을 안전하게 관리합니다.
- 구글 로그인: Google OAuth를 통한 간편 로그인 기능을 제공하여 사용자 편의성을 높였습니다.
- 마이페이지 기능: 사용자는 마이페이지에서 자신의 정보 및 활동 내역을 확인하고 관리할 수 있습니다.
- 알림 기능: 사용자가 읽지 않은 알림을 실시간으로 확인할 수 있으며, 알림 시스템을 통해 최신 정보를 빠르게 전달받을 수 있습니다.
- 게시글 목록 및 인기 게시글: 사용자가 작성한 게시글을 카테고리별로 탐색할 수 있으며, 인기 게시글 섹션에서 가장 많은 좋아요를 받은 게시글을 쉽게 확인할 수 있습니다.
- 카테고리 탐색: 다중 레벨의 카테고리를 지원하여 사용자가 관심 있는 주제를 빠르고 쉽게 찾을 수 있으며, 카테고리 간의 탐색이 용이합니다.
- 이미지 업로드 및 게시글 작성: 사용자는 이미지 첨부 기능이 포함된 게시글 작성 기능을 통해 다양한 미디어 콘텐츠를 업로드할 수 있습니다.
- 댓글 기능: 게시글에 댓글을 달고, 다른 사용자와 상호작용할 수 있는 기능을 제공합니다.
- 좋아요 기능: 게시글 및 댓글에 좋아요를 누를 수 있는 기능을 통해 사용자 피드백을 시각적으로 제공합니다.
  

## 프로젝트 구조
<pre>
archi-cli/
├── src/
│   ├── api/                             # 서버 통신 DTO, API 정의
│   ├── assets/                          # 사진 및 정적 파일 저장
│   ├── components/                      # 공통 컴포넌트 정의
│   ├── pages/                           # 각 페이지별 화면 개발    
│   │   ├── AdminPage/
│   │   │    ├── components/             # AdminPage화면에 대한 컴포넌트 정의 (각 Page 별 컴포넌트가 정의되어있음.)
│   │   │    ├── AdminSettingPage.tsx    # AdminSettingPage 정의
│   │   ├── LoginPage/
│   │   ├── ...
│   │   └── Main.tsx                     # 메인 Page 
│   ├── stores                           # recoil 저장소 
│   ├── styles                           # 공통 스타일 저장
│   ├── util                             # 공통 유틸리티 코드 저장
│   ├── APP.tsx      
│   └── ...            
├── .env.development                     # dev 환경
├── .env.local                           # local 환경
├── .env.production                      # prod 환경
├── package.json
└── tsconfig.json                        # typescript 설정
</pre>

## 기술 스택
기술 스택
- TypeScript
- React
- React Query
- Recoil
- Emotion, Material

## 배포
AWS S3를 통해 정적 파일을 배포하고, CloudFront를 사용하여 캐싱 및 콘텐츠 보안 유지

![image](https://github.com/user-attachments/assets/a72e0bc5-aebc-47bc-b128-0b8ad61160a3)

