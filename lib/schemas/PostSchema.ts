import { z } from "zod";

export const createPostSchema = z.object({
  contentId: z.string(),
  authorId: z.string(),
  published: z.boolean(),
});

export type CreatePostDto = z.infer<typeof createPostSchema>;

export const TestDataSchema = z.object({
  name: z.string().max(10).min(2),
  age: z.number().min(1),
  isAlive: z.boolean(),
  date: z.date().optional(),
});

export type TestDataDto = z.infer<typeof TestDataSchema>;
