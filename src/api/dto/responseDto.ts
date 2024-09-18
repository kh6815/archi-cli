export interface ResponseDto<T> {
  header: HeaderDto;
  data: T;
  errorData: null | string;
}

interface HeaderDto {
  resultCode: number;
  resultMessage: string;
}

export interface PagingDto {
  page: number;
  size: number;
}

// export interface SuccessCheckDto {
//   isSuccess: boolean;
// }

export const IsErrorResponse = (data: unknown): data is { errorData: string } => {
  return typeof data === 'object' && data !== null && 'errorData' in data;
  };

  export interface ResponsePaingDto<T> {
    header: HeaderDto;
    data: Paging<T>;
    errorData: null | string;
  }

  export interface Paging<T> {
    content: T,
    pageable: Pageable;
    totalPages: number;
    totalElements: number;
    last: number;
    size: number;
    number: number;
    sort: Sort;
    numberOfElements: number;
    first: boolean;
    empty: false;
  }

  export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: Sort;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  }

  export interface Sort {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  }
