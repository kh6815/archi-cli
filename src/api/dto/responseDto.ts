export interface ResponseDto<T> {
  header: HeaderDto;
  data: T;
  errorData: null | string;
}

interface HeaderDto {
  resultCode: number;
  resultMessage: string;
}

// export interface SuccessCheckDto {
//   isSuccess: boolean;
// }
