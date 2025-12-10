export interface PagedResultDto<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

export interface ErrorResponseDto {
  code: string;
  message: string;
  validationErrors?: { [key: string]: string[] } | null;
}
