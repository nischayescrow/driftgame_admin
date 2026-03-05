export interface UserDoc {
  createdAt: string;
  email: string;
  email_verified: boolean;
  first_name: string;
  friends: string[];
  last_name: string;
  picture: string;
  receviedFriendRequests: string[];
  sentFriendRequests: string[];
  status: number;
  updatedAt: string;
  _id: string;
}
