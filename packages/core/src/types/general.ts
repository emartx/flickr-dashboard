export type ErrorObj = {
  message: string;
}

export type GeneralResult<T> = {
  isDone: boolean;
  status: number;
  message: string;
  data: T | null;
}
