export interface Friend {
  id: string;
  name: string;
  gender: string;
}

export interface BaseResponseListDto<T> {
  statusCode: number;
  data: T[];
  message: string;
}
