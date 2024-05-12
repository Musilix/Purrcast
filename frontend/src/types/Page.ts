import { Post } from './Post';

export interface Page {
  posts: Post[];
  nextPage: number;
  prevPage: number;
  currPage: number;
}
