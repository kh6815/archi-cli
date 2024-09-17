export interface AddCategoryReq {
    parentsId: number,
    categoryName: string,
}

export interface UpdateCategoryReq {
    id: number,
    name: string,
}

export interface AddNoticeReq {
    title: string,
    content: string,
    imgFileIdList: number[]
}

export interface UpdateNoticeReq {
    id: number,
    title: string,
    content: string
    addFileIdList: number[]
    updateFileMap: Record<number, string>
    deleteFileIdList: number[]
}

export interface DeleteNoticeReq {
    ids: number[]
}

export interface GetAdminCategoryListDto {
    categoryList: CategoryDto[]
}

export interface CategoryDto {
    id: number,
    categoryName: string,
    subCategories: CategoryDto[]
}

export interface AdminCategoryDto {
    id: number,
    categoryName: string,
    activeYn: string,
    createUser: string,
    updateUser: string,
    subCategories: AdminCategoryDto[]
}