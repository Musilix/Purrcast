export default interface Post {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  content?: string;
  published: boolean;
  authorId: string;
} 