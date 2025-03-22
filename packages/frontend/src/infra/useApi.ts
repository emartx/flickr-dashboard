import axios, { Method } from "axios";
import { GeneralResult } from "@flickr-dashboard/core/src/types";
import { useAuth } from "../context/AuthContext";

const useApi = () => {
  const { firebaseUser } = useAuth();

  const callApi = async <T>(
    url: string,
    method: Method,
    body?: unknown
  ): Promise<GeneralResult<T>> => {
    try {
      const token = await firebaseUser.getIdToken();

      const response = await axios.request<GeneralResult<T>>({
        url,
        method,
        data: body,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
    getApi: <T>(url: string) => callApi<T>(url, "GET"),
    postApi: <T>(url: string, body: any) => callApi<T>(url, "POST", body),
    putApi: <T>(url: string, body: any) => callApi<T>(url, "PUT", body),
    delApi: <T>(url: string) => callApi<T>(url, "DELETE"),
  };
};

export default useApi;
