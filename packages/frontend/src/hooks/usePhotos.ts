import { useQuery } from "react-query";
import { fetchPhotos } from "../infra/photos";
import { ApiInstance } from "../types/apis";


export const usePhotos = (firebaseUserId: string) => {
  return useQuery({
    queryKey: [ApiInstance.GetPhotos, firebaseUserId],
    queryFn: () => fetchPhotos(firebaseUserId),
    enabled: !!firebaseUserId,
  });
};
