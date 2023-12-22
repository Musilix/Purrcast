import { User } from './User';

export interface Post {
  id: number;
  authorId: number;
  contentId: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  author: User;
}
