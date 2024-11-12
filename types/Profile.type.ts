export type Avatar = {
  id: number;
  name: string;
  url: string;
  thumbUrl: string;
  mediumUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type UserProfile = {
  status: number;
  message: string;
  payload: {
    id: number;
    name: string;
    email: string;
    phone: string;
    dob: string;
    avatar: Avatar;
    verified: boolean;
    blocked: boolean;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
};
