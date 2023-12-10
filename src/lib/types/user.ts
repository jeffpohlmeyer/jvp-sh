export type UserType = {
  id: string;
  email: string;
  hashed_password: string;
  created_at: Date;
  active: boolean;
  is_admin: boolean;
};
