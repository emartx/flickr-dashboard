import { useQuery } from "react-query";
import usePhotoApis from "../infra/photos";
import { ApiInstance } from "../types/apis";


export const usePhotos = (firebaseUserId: string) => {
  const { fetchPhotos } = usePhotoApis();

  return useQuery({
    queryKey: [ApiInstance.GetPhotos, firebaseUserId],
    queryFn: () => fetchPhotos(firebaseUserId),
    enabled: !!firebaseUserId,
  });
};
