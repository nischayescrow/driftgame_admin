export interface UserDoc {
  id: string;
  email: string;
  email_verified?: boolean;
  first_name: string;
  last_name?: string;
  picture?: string;
  acc_status?: number;
  live_status?: number;
  createdAt?: string;
  updatedAt?: string;
}
