import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      console.error(error.message);
      const problemFields = error.issues.map(
        (issue) => ` ${issue.path[0]} (${issue.expected}, ${issue.message})`,
      );

      throw new BadRequestException(
        `Improper data sent. Please make sure that the following fields are the proper format: ${problemFields}`,
      );
    }
  }
}
