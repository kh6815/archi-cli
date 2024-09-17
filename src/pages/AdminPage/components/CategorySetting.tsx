/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import { getAdminCategoryList, addCategory, updateCategory, deleteCategory } from '../../../api/adminApi';
import { AddCategoryReq, CategoryDto, UpdateCategoryReq } from '../../../api/dto/admin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Box, List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton, TextField, Button, Collapse, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Folder as FolderIcon, Delete as DeleteIcon, Edit as EditIcon, ExpandLess, ExpandMore, Add as AddIcon } from '@mui/icons-material';
import { IsErrorResponse } from '../../../api/dto/responseDto';

const categoryListStyles = css`
  .MuiListItem-root {
    border-bottom: 1px solid #ddd;
    &:hover {
      background-color: #f5f5f5;
    }
  }
  .MuiListItemAvatar-root {
    min-width: 40px;
  }
  .MuiListItemText-primary {
    font-weight: bold;
  }
  .MuiIconButton-root {
    color: #1976d2;
  }
  .MuiIconButton-root:hover {
    color: #1565c0;
  }
  .addBtn {
    display: flex;
  }
`;

const dialogStyles = css`
  .MuiDialog-paper {
    padding: 16px;
  }
  .MuiDialogTitle-root {
    font-size: 1.25rem;
  }
  .MuiDialogContent-root {
    margin-top: 8px;
  }
`;

const buttonStyles = css`
  margin-right: 8px;
  &:last-of-type {
    margin-right: 0;
  }
`;

const CategorySetting: React.FC = () => {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [openCategory, setOpenCategory] = useState<Record<number, boolean>>({});

  const queryClient = useQueryClient();

  const getAdminCategoryListApi = async () => {
    const res = await getAdminCategoryList();
    return res;
  };

  const { mutate: getAdminCategoryListMutate } = useMutation({
    mutationFn: getAdminCategoryListApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        const data = mutateData.data;
        setCategories(data.categoryList);
      } else {
        alert(mutateData.header.resultMessage);
      }
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 400) {
        alert('카테고리 조회 실패');
      } else if (IsErrorResponse(error.response?.data)) {
        alert(error.response!.data.errorData);
      } else {
        alert('서버 오류 발생');
      }
    }
  });

  const addCategoryApi = async (addCategoryReq: AddCategoryReq) => {
    const res = await addCategory(addCategoryReq);
    return res;
  };

  const { mutate: addCategoryMutate } = useMutation({
    mutationFn: addCategoryApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        getAdminCategoryListMutate();
      } else {
        alert(mutateData.header.resultMessage);
      }
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 400) {
        alert('카테고리 등록 실패');
      } else if (IsErrorResponse(error.response?.data)) {
        alert(error.response!.data.errorData);
      } else {
        alert('서버 오류 발생');
      }
    }
  });

  const updateCategoryApi = async (updateCategoryReq: UpdateCategoryReq) => {
    const res = await updateCategory(updateCategoryReq);
    return res;
  };

  const { mutate: updateCategoryMutate } = useMutation({
    mutationFn: updateCategoryApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        getAdminCategoryListMutate();
      } else {
        alert(mutateData.header.resultMessage);
      }
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 400) {
        alert('카테고리 수정 실패');
      } else if (IsErrorResponse(error.response?.data)) {
        alert(error.response!.data.errorData);
      } else {
        alert('서버 오류 발생');
      }
    }
  });

  const deleteCategoryApi = async (id: number) => {
    const res = await deleteCategory(id);
    return res;
  };

  const { mutate: deleteCategoryMutate } = useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: mutateData => {
      if (mutateData.header.resultCode === 0) {
        getAdminCategoryListMutate();
      } else {
        alert(mutateData.header.resultMessage);
      }
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 400) {
        alert('카테고리 삭제 실패');
      } else if (IsErrorResponse(error.response?.data)) {
        alert(error.response!.data.errorData);
      } else {
        alert('서버 오류 발생');
      }
    }
  });

  const handleOpenEditDialog = (category: CategoryDto) => {
    setEditCategoryName(category.categoryName);
    setSelectedCategoryId(category.id);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedCategoryId(null);
  };

  const handleOpenAddDialog = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setNewCategoryName('');
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setSelectedCategoryId(null);
  };

  const handleDeleteCategory = (categoryId: number) => {
    if (window.confirm('해당 카테고리를 삭제하시겠습니까?')) {
      deleteCategoryMutate(categoryId);
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
        if(selectedCategoryId != null){
            const addCategoryReq: AddCategoryReq = {
                parentsId: selectedCategoryId,
                categoryName: newCategoryName
            }
          addCategoryMutate(addCategoryReq);
        }
      handleCloseAddDialog();
    }
  };

  const handleUpdateCategory = () => {

    if(selectedCategoryId != null){
        const updateCategoryReq: UpdateCategoryReq = {
            id: selectedCategoryId,
            name: editCategoryName,
        }

        updateCategoryMutate(updateCategoryReq);
    }
    handleCloseEditDialog();
  }

  const handleToggleCategory = (categoryId: number) => {
    setOpenCategory(prevState => ({
      ...prevState,
      [categoryId]: !prevState[categoryId],
    }));
  };

  useEffect(() => {
    getAdminCategoryListMutate();
  }, []);

  const renderSubCategories = (subCategories: CategoryDto[], depth: number = 1) => {
    return subCategories.map(subCategory => (
      <React.Fragment key={subCategory.id}>
        <ListItem onClick={() => handleToggleCategory(subCategory.id)} sx={{ pl: depth * 4 }} css={categoryListStyles}>
          <ListItemAvatar>
            <IconButton edge="end" aria-label="add" sx={{ mr: 1 }} onClick={() => handleOpenAddDialog(subCategory.id)}>
              <AddIcon />
            </IconButton>
          </ListItemAvatar>
          <ListItemText primary={subCategory.categoryName} />
          <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }} onClick={() => handleOpenEditDialog(subCategory)}>
            <EditIcon />
          </IconButton>
          {!(subCategory.subCategories && subCategory.subCategories.length > 0) &&           
          <IconButton edge="end" aria-label="delete" sx={{ mr: 1 }} onClick={() => handleDeleteCategory(subCategory.id)}>
            <DeleteIcon />
          </IconButton>}
          {subCategory.subCategories && subCategory.subCategories.length > 0 ? openCategory[subCategory.id] ? <ExpandLess /> : <ExpandMore /> : null}
        </ListItem>
        {subCategory.subCategories && subCategory.subCategories.length > 0 && (
          <Collapse in={openCategory[subCategory.id]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {renderSubCategories(subCategory.subCategories, depth + 1)}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    ));
  };

  return (
    <Box css={css`padding: 16px;`}>
      <Typography variant="h5">Category Settings</Typography>
      {/* Category List */}
      <List css={categoryListStyles}>
        * 카테고리 변경 후 서버 재시작 필수
        <div className='addBtn'>
            <IconButton edge="end" aria-label="add" sx={{ mr: 1 }} onClick={() => handleOpenAddDialog(0)}>
                <AddIcon />
            </IconButton>
        </div>
        {categories.map((category) => (
          <React.Fragment key={category.id}>
            <ListItem onClick={() => handleToggleCategory(category.id)} css={categoryListStyles}>
              <ListItemAvatar>
                <IconButton edge="end" aria-label="add" sx={{ mr: 1 }} onClick={() => handleOpenAddDialog(category.id)}>
                  <AddIcon />
                </IconButton>
              </ListItemAvatar>
              <ListItemText primary={category.categoryName} />
              <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }} onClick={() => handleOpenEditDialog(category)}>
                <EditIcon />
              </IconButton>
              {!(category.subCategories && category.subCategories.length > 0) &&               
              <IconButton edge="end" aria-label="delete" sx={{ mr: 1 }} onClick={() => handleDeleteCategory(category.id)}>
                <DeleteIcon />
              </IconButton>}
              {category.subCategories && category.subCategories.length > 0 ? openCategory[category.id] ? <ExpandLess /> : <ExpandMore /> : null}
            </ListItem>
            {category.subCategories && category.subCategories.length > 0 && (
              <Collapse in={openCategory[category.id]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {renderSubCategories(category.subCategories)}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      {/* Add New Category Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} css={dialogStyles}>
        <DialogTitle>Add Subcategory</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a name for the new subcategory:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Subcategory Name"
            fullWidth
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="primary" css={buttonStyles}>
            Cancel
          </Button>
          <Button onClick={handleAddCategory} color="primary" css={buttonStyles}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} css={dialogStyles}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a new name for the category:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={editCategoryName}
            onChange={(e) => setEditCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary" css={buttonStyles}>
            Cancel
          </Button>
          <Button onClick={handleUpdateCategory} color="primary" css={buttonStyles}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategorySetting;
