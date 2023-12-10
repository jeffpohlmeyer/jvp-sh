export type URLsType = {
  id: string;
  created_at: Date;
  endpoint: string;
  redirect_link: string;
  version: number;
  clicked: number;
  user_id: string | null;
  email?: string;
};

export type UrlWithEmailType = URLsType & { email?: string };

export type UserType = {
  id: string;
  email: string;
  created_at: Date;
  active: boolean;
  is_admin: boolean;
};
