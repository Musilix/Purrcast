import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export default class MyCustomePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'param') {
      return value * 2;
    }
  }
}

@Injectable()
export class MyCustomeValidatorPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.metatype === Number) {
      return value;
    } else {
      throw new BadRequestException(
        'Validation failed. You sent a bad ID. IDs must be numbers.',
      );
    }
  }
}
