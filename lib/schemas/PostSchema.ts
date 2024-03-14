import { z } from "zod";

export const createPostSchema = z.object({
  contentId: z.string(),
  authorId: z.number(),
  published: z.boolean(),
});

export type CreatePostDto = z.infer<typeof createPostSchema>;
