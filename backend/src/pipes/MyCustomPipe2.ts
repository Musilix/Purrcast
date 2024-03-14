import { BadRequestException, Logger, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

const TestDataSchema = z.object({
  name: z.string().max(20).min(2),
  age: z.number().min(1).max(105),
  isAlive: z.boolean(),
  date: z.string().transform((val) => new Date(val)),
});
type TestDataDto = z.infer<typeof TestDataSchema>;

export class TestDataPipe implements PipeTransform {
  transform(value: TestDataDto) {
    try {
      const parsedValue = TestDataSchema.parse(value);
      return parsedValue;
    } catch (error) {
      // TODO - path could possibly hold more than 1 value, so defaulting to the 1st one could be problematic w/ our error messages
      const problemFields = error.issues.map(
        (issue) => ` ${issue.path[0]} (${issue.expected}, ${issue.message})`,
      );

      throw new BadRequestException(
        `Improper data sent. Please make sure that the following fields are the proper format: ${problemFields}`,
      );
    }
  }
}
