import {
  CanActivate,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import BcryptService from 'src/bcrypt/bcrypt.service';

@Injectable()
export class LocationTamperGuard implements CanActivate {
  constructor(private readonly bcryptService: BcryptService) {}
  async canActivate(context) {
    const req = context.switchToHttp().getRequest();

    const fingerprint = req.body.fingerprint;
    if (!fingerprint) {
      throw new InternalServerErrorException(
        'It seems you tampered with your location data (intentionally maybe?) Please clear cache/cookies and refresh the page to get back to normal',
      );
    }

    const isValidLocation = await this.bcryptService.verifyHashedLocation(
      req.body,
      fingerprint,
    );
    if (!isValidLocation) {
      throw new InternalServerErrorException(
        'It seems you tampered with your location data (intentionally maybe?). Please clear cache/cookies and refresh the page to get back to normal',
      );
    }

    return true;
  }
}
