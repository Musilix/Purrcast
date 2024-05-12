import { MaxFileSizeValidator } from '@nestjs/common';
import { FileTypeValidatorWithMessage } from './pipes/FileTypeValidatorWithMessage';

export const __prod__ = process.env.NODE_ENV === 'production';

export const __file_parse_validators__ = [
  new MaxFileSizeValidator({
    maxSize: 30000000,
    message:
      'The file you uploaded is too large. Please upload a file that is less than 30MB.',
  }),
  new FileTypeValidatorWithMessage({
    fileType: /(png|jpg|jpeg|webp)$/i,
    message:
      'The file you uploaded is not a valid image. It must be a .png, .jpg, .jpeg, or .webp file.',
  }),
];
export const __post_page_offset__ = 8;
