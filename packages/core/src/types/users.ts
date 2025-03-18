export type User = UserPayload & {
  uid: string;
}

export type UserPayload = FlickrUserPayload & {
	createdAt: number;
	email: string;
	flickrUserId: string;
	flickrUserName: string;
	lastLogin: string;
	name: string;
	photoURL: string;
	photosCount: number;
	totalViews: number,
	totalFaves: number,
	totalComments: number,
};

export type FlickrUserPayload = {
  nsid: string | undefined,
  join_date: string | undefined,
  occupation: string | undefined,
  hometown: string | undefined,
  showcase_set: string | undefined,
  showcase_set_title: string | undefined,
  first_name: string | undefined,
  last_name: string | undefined,
  profile_description: string | undefined,
  website: string | undefined,
  city: string | undefined,
  country: string | undefined,
  facebook: string | undefined,
  twitter: string | undefined,
  tumblr: string | undefined,
  instagram: string | undefined,
  pinterest: string | undefined
}

export type FlickrUser = FlickrUserPayload & {
  id: string,
}
