export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  avatar: string;
  following?: boolean;
}
