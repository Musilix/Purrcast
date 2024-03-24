import { z } from "zod";

// TODO - currently since nestjs provides a means to validate files sent in a form data object from the client,
// it kinda defeats the purpose of using zod to validate the file. However, if we wanted to validate the content on the client side instead
// before it's sent out, we could try to utilize this.

// NOTE - if we'd like, we can validate size of the file buffer sent from the user on our backend
const MAX_FILE_SIZE = 30000000;
const checkFileType = (file: File) => {
  if (
    file.name.endsWith(".png") ||
    file.name.endsWith(".jpg") ||
    file.name.endsWith(".jpeg") ||
    file.name.endsWith(".webp")
  ) {
    return true;
  }

  return false;
};

const FileType = z
  .any()
  .refine((file: File) => file, "You must upload a file.")
  .refine((file: File) => {
    file.size < MAX_FILE_SIZE;
  }, "The file you uploaded is too large. Please upload a file that is less than 30MB.")
  .refine((file: File) => {
    checkFileType(file);
  }, "The file you uploaded is not a valid image. It must be a .png, .jpg, .jpeg, or .webp file.");

export const createPostSchema = z.object({
  userUploadedFile: FileType,
  authorId: z.string(),
  published: z.coerce.boolean(),
});

export const TestDataSchema = z.object({
  name: z.string().max(10).min(2),
  age: z.number().min(1),
  isAlive: z.boolean(),
  date: z.date().optional(),
});

export type CreatePostDto = z.infer<typeof createPostSchema>;
export type TestDataDto = z.infer<typeof TestDataSchema>;
