/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// 스타일 정의
const categoryBarStyle = css`
  display: flex;
  overflow-x: auto;
  background-color: #f4f4f4;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
  position: relative;
  overflow: visible;

  a {
    color: black;
    text-decoration: none;
  }

  .category-container {
    position: relative;
    display: inline-block;
    margin: 0 10px;
  }

  .category {
    display: inline-block;
    padding: 10px 20px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s;
    position: relative;
  }

  .category:hover {
    background-color: #e0e0e0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .sub-categories {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    display: none;
    z-index: 1000;
    width: 200px;
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    overflow: visible;
  }

  .category:hover .sub-categories {
    display: block;
  }

  .sub-categories .sub-category-item {
    margin: 5px 0;
    padding: 5px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s;
    position: relative;
  }

  .sub-categories .sub-category-item:hover {
    background-color: #f0f0f0;
  }

  .sub-sub-categories {
    position: absolute;
    top: 0;
    left: 100%;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    display: none;
    z-index: 1000;
    width: 200px;
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    overflow: visible;
  }

  .sub-category-item:hover > .sub-sub-categories {
    display: block;
  }
`;

// 카테고리 타입 정의
interface Category {
  id: number;
  name: string;
  subCategories?: Category[];
}

// 3단계 깊이의 가짜 데이터
const fakeCategories: Category[] = [
  {
    id: 1,
    name: '공지사항',
    subCategories: [
      {
        id: 5,
        name: '서비스 공지',
        subCategories: [
          { id: 13, 
            name: '새로운 기능 추가',
            subCategories: [
                { id: 13, 
                    name: '새로운 기능1', 
                    subCategories: [
                        { id: 13, name: 'new 기능11' },
                        { id: 14, name: 'new 기능12' },
                      ]
                 },
                { id: 14, 
                    name: '새로운 기능2',
                    subCategories: [
                        { id: 13, name: 'new 기능21' },
                        { id: 14, name: 'new 기능22' },
                      ] },
              ]
          },
          { id: 14, 
            name: '버그 수정',
            subCategories: [
                { id: 13, name: '버그1' },
                { id: 14, name: '버그2' },
              ] 
            },
        ],
      },
      {
        id: 6,
        name: '시스템 점검',
        subCategories: [
          { id: 15, name: '정기 점검' },
          { id: 16, name: '긴급 점검' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: '자유게시판',
    subCategories: [
      {
        id: 7,
        name: '일상 이야기',
        subCategories: [
          { id: 17, name: '오늘의 일기' },
          { id: 18, name: '주말 계획' },
        ],
      },
      {
        id: 8,
        name: '취미 생활',
        subCategories: [
          { id: 19, name: '독서' },
          { id: 20, name: '여행' },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Q&A',
    subCategories: [
      {
        id: 9,
        name: '기술 지원',
        subCategories: [
          { id: 21, name: '설치 문제' },
          { id: 22, name: '사용 방법' },
        ],
      },
      {
        id: 10,
        name: '일반 문의',
        subCategories: [
          { id: 23, name: '계정 문제' },
          { id: 24, name: '결제 관련' },
        ],
      },
    ],
  },
  {
    id: 4,
    name: '정보공유',
    subCategories: [
      {
        id: 11,
        name: '업데이트 소식',
        subCategories: [
          { id: 25, name: '버전 1.0 출시' },
          { id: 26, name: '버전 1.1 출시' },
        ],
      },
      {
        id: 12,
        name: '팁 & 트릭',
        subCategories: [
          { id: 27, name: '사용 꿀팁' },
          { id: 28, name: '효율적인 사용법' },
        ],
      },
    ],
  },
];

const CategoryItem: React.FC<{ categories: Category[], depth: number }> = ({ categories, depth }) => {
    return (
        <div className={depth === 2 ? "sub-categories" : "sub-sub-categories"}>
            {categories.map(subCategory => (
                <Link key={subCategory.id} to={'/category/' + subCategory.id}>
                    <div key={subCategory.id} className={"sub-category-item"}>
                        {subCategory.name}
                        {subCategory.subCategories !== undefined 
                        && subCategory.subCategories?.length > 0 
                        && <CategoryItem categories={subCategory.subCategories} depth={depth + 1}/>}
                    </div>
                </Link>
            ))}
        </div>
    );
}

const CategoryBar: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
  
    useEffect(() => {
      // 가짜 데이터로 상태를 설정
      setCategories(fakeCategories);
    }, []);
  
    return (
      <nav css={categoryBarStyle}>
        {categories.map(category => (
            <Link key={category.id} className="category-container" to={'/category/' + category.id}>
                <div className="category">
                {category.name}
                {category.subCategories !== undefined 
                && category.subCategories?.length > 0 
                && <CategoryItem categories={category.subCategories} depth={2} />}
                </div>
            </Link>
        ))}
      </nav>
    );
}

export default CategoryBar;
