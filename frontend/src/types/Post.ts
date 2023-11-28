import { User } from "./User";

export interface Post {
  id: number;
  post_img: string;
  location: string;
  name: string;
  user: User;
}
