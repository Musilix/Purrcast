import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export default class BcryptService {
  constructor(private readonly configService: ConfigService) {}

  async hashLocation(locationObject, includeSecret = true) {
    const saltOrRounds = 10;
    const toHash = Object.entries(locationObject).reduce((acc, [, value]) => {
      return acc + value;
    }, '');

    const secret = includeSecret ? this.configService.get('HASH_SECRET') : '';
    const hash = await bcrypt.hash(toHash + secret, saltOrRounds);

    return hash;
  }

  async verifyHashedLocation(locationObject, hashedLocation) {
    const toCompare = Object.entries(locationObject).reduce(
      (acc, [key, value]) => {
        if (key !== 'fingerprint') {
          return acc + value;
        } else {
          return acc + '';
        }
      },
      '',
    );

    const isMatch = await bcrypt.compare(
      toCompare + this.configService.get('HASH_SECRET'),
      hashedLocation,
    );

    return isMatch;
  }
}
