import { GeneralResult } from "@flickr-dashboard/core/src/types";

export const failResult = <T = null>(status?: number, message?: string): GeneralResult<T> => {
  return {
    isDone: false,
    status: status ?? 500,
    message: message ?? "An error occurred",
    data: null,
  };
};

export const successResult = <T>(data: T, message?: string): GeneralResult<T> => {
  return {
    isDone: true,
    status: 200,
    message: message ?? "Success",
    data: data,
  };
};