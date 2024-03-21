import { FileValidator } from '@nestjs/common';

export class FileTypeValidatorWithMessage extends FileValidator {
  constructor(validationOptions) {
    super(validationOptions);
  }

  isValid(file?: any): boolean | Promise<boolean> {
    if (file?.originalname) {
      return file.originalname.match(this.validationOptions.fileType);
    }

    return false;
  }

  buildErrorMessage(): string {
    return this.validationOptions.message;
  }
}
