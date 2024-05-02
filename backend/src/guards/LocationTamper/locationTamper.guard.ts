import {
  CanActivate,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { verifyHashedLocation } from 'src/utils/HashLocation';

@Injectable()
export class LocationTamperGuard implements CanActivate {
  async canActivate(context) {
    const req = context.switchToHttp().getRequest();

    const fingerprint = req.body.fingerprint;
    if (!fingerprint) {
      throw new InternalServerErrorException(
        'It seems you tampered with your location data (intentionally maybe?) Please clear cache/cookies and refresh the page to get back to normal',
      );
    }

    const isValidLocation = await verifyHashedLocation(req.body, fingerprint);
    if (!isValidLocation) {
      throw new InternalServerErrorException(
        'It seems you tampered with your location data (intentionally maybe?). Please clear cache/cookies and refresh the page to get back to normal',
      );
    }

    return true;
  }
}
