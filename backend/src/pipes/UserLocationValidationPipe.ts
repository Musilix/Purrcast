import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export default class UserLocationValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      const { userState = -1, userCity = -1, timezoneOffset = -1 } = value;

      if (userState < 0 || userCity < 0 || timezoneOffset < 0) {
        throw new BadRequestException('User location information is missing.');
      }

      return { userState, userCity, timezoneOffset };
    }
  }
}
