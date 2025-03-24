import axios, { Method } from "axios";
import { GeneralResult } from "@flickr-dashboard/core/src/types";
import { useAuth } from "../context/AuthContext";

type OtherParams = {
  body?: unknown,
  params?: Record<string, string>,
}

const useApi = () => {
  const { firebaseUser } = useAuth();

  const callApi = async <T>(
    url: string,
    method: Method,
    other?: {
      body?: unknown,
      params?: Record<string, string>,
    }
  ): Promise<GeneralResult<T>> => {
    try {
      const token = await firebaseUser.getIdToken();

      const response = await axios.request<GeneralResult<T>>({
        url,
        method,
        data: other?.body,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: other?.params,
      });

      const json = response.data;

      if ("isDone" in json) {
        if (!json.isDone) {
          console.warn(`Server controlled error: ${json.message}`);
        }
        return json;
      } else {
        return {
          isDone: false,
          status: 500,
          message: "Invalid response structure",
          data: null,
        };
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? 500;
        const message = error.response?.data?.message ?? error.message;
        console.error("Axios error:", error);

        return {
          isDone: false,
          status,
          message,
          data: null,
        };
      }

      console.error("Unhandled error:", error);
      return {
        isDone: false,
        status: 500,
        message: (error as Error).message || "Unknown error",
        data: null,
      };
    }
  };

  return {
    getApi: <T>(url: string, other?: OtherParams) => callApi<T>(url, "GET", other),
    postApi: <T>(url: string, other?: OtherParams) => callApi<T>(url, "POST", other),
    putApi: <T>(url: string, other?: OtherParams) => callApi<T>(url, "PUT", other),
    delApi: <T>(url: string, other?: OtherParams) => callApi<T>(url, "DELETE", other),
  };
};

export default useApi;
