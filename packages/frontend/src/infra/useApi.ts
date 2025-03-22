import { GeneralResult } from "@flickr-dashboard/core/src/types";

const callApi = async  <T>(url: string, options?: RequestInit): Promise<GeneralResult<T>> => {
  try {
    const res = await fetch(url, options);
    const json = await res.json() as GeneralResult<T>;

    if ('isDone' in json) {
      if (!json.isDone) {
        console.warn(`Server controlled error: ${json.message}`);
        return json;
      }

      return json;
    } else {
      return {
        isDone: false,
        status: 500,
        message: "Invalid response structure",
        data: null,
      }
    }
  } catch (error) {
    console.error("Unhandled error:", error);
    return {
      isDone: false,
      status: 500,
      message: (error as Error).message || 'Unknown error',
      data: null,
    };
  }
}

export default callApi;
