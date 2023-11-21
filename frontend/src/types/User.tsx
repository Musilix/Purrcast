import Post from "./Post";
import Profile from "./Profile";

export default interface User {
  id: number;
  name?: string;
  username: string;
  posts: Post[];
  profile?: Profile;
}