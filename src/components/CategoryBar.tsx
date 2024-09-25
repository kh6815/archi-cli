/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {getCategoryList} from "../api/postApi";
import { CategoryDto } from '../api/dto/admin';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

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

const CategoryItem: React.FC<{ categories: CategoryDto[], depth: number }> = ({ categories, depth }) => {
    return (
        <div className={depth === 2 ? "sub-categories" : "sub-sub-categories"}>
            {categories.map(subCategory => (
                <div key={subCategory.id}>
                    <div key={subCategory.id} className={"sub-category-item"}>
                      <Link to={'/category/' + subCategory.id}>{subCategory.categoryName}</Link>
                        {subCategory.subCategories !== undefined 
                        && subCategory.subCategories?.length > 0 
                        && <CategoryItem categories={subCategory.subCategories} depth={depth + 1}/>}
                    </div>
                </div>
            ))}
        </div>
    );
}

const CategoryBar: React.FC = () => {
    const [categories, setCategories] = useState<CategoryDto[]>([]);

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
  
          setCategories(data.categoryList)
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
  
    useEffect(() => {
      getCategoryListMutate();
    }, []);
  
    return (
      <nav css={categoryBarStyle}>
        {categories.map(category => (
            <div key={category.id} className="category-container">
                <div className="category">
                <Link to={'/category/' + category.id}>{category.categoryName}</Link>
                {category.subCategories !== undefined 
                && category.subCategories?.length > 0 
                && <CategoryItem categories={category.subCategories} depth={2} />}
                </div>
            </div>
        ))}
      </nav>
    );
}

export default CategoryBar;
