import { useQuery } from "react-query";
import { fetchPhotos } from "../infra/photos";


export const usePhotos = (firebaseUserId: string) => {
  return useQuery({
    queryKey: ["photos", firebaseUserId],
    queryFn: () => fetchPhotos(firebaseUserId),
    enabled: !!firebaseUserId,
  });
};
