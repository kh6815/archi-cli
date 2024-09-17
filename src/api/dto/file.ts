export interface AddFileReqDto {
    file: File
  }

export interface AddFileRes {
    fileId: number;
    fileUrl: string;
}