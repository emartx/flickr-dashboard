type PhotoBase = {
  secret: string;
  server: string;
  title: string;
}

export type PhotoFlickr = PhotoBase & {
  id: string;
  owner: string;
  ispublic: number;
  isfriend: number;
  isfamily: number;
  farm: number;
}

export type FlickrResult = {
  photos: {
    page: number,
    pages: number,
    perpage: number,
    total: number;
    photo: PhotoFlickr[];
  }
  stat: "ok" | "fail";
}

export type PhotoPayload = PhotoBase & {
  timestamp: string;
  totalComments: number;
  totalFaves: number;
  totalViews: number;
  interestRate: number;
}

export type Photo = PhotoPayload & {
  id: string;
}
