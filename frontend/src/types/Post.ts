import { City } from './City';
import { State } from './State';
import { Upvote } from './Upvote';
import { User } from './User';

// TODO - replace this with a zod schema + infered type
export interface Post {
  id: number;
  authorId: number;
  createdAt: Date;
  updatedAt: Date | null;
  contentId: string;
  isDeleted?: boolean;
  isCatOnHead?: boolean | null;
  published?: boolean;
  author?: User;
  id_city: City;
  id_state: State;
  upvotes: Upvote[];
}
