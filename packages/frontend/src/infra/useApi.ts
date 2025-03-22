import axios from "axios";
import { GeneralResult } from "@flickr-dashboard/core/src/types";
import { useAuth } from "../context/AuthContext";

const useApi = () => {
  const { firebaseUser } = useAuth();

  const callApi = async <T>(url: string): Promise<GeneralResult<T>> => {
    const token = await firebaseUser.getIdToken();
    
		try {
			const response = await axios.get<GeneralResult<T>>(url, {
				headers: {
					"Content-Type": "Application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			const json = response.data;

			if ("isDone" in json) {
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
				};
			}
		} catch (error) {
			console.error("Unhandled error:", error);
			return {
				isDone: false,
				status: 500,
				message: (error as Error).message || "Unknown error",
				data: null,
			};
		}
	};

  return { callApi };
};

export default useApi;
