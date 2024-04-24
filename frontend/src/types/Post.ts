import { User } from './User';

// TODO - replace this with a zod schema + infered type
export interface Post {
  id: number;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  contentId: string;
  isDeleted?: boolean;
  isCatOnHead?: boolean;
  published?: boolean;
  author: User;

  // upvotes?:
}
