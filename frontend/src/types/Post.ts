import { User } from './User';

// TODO - replace this with a zod schema + infered type
export interface Post {
  id: number;
  authorId: number;
  contentId: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  author: User;
}
