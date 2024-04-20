import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('Cloudinary') private readonly Cloudinary) {}

  async sign(fileName) {
    try {
      const result = await this.Cloudinary.image(`${fileName}.png`, {
        type: 'authenticated',
        auth_token: { key: 'MyKey', duration: 300 },
        sign_url: true,
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Unable to create signed url');
    }
  }

  async upload(file: any, options?: any) {
    try {
      //TODO - abstract this out to a data uri encoder helper?
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = 'data:' + file.mimetype + ';base64,' + b64;

      const result: Promise<UploadApiResponse> =
        await this.Cloudinary.uploader.upload(dataURI, options);

      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Unable to upload your file due to a communication error with our image hosting provider. Please try again later.',
      );
    }
  }

  async getUpload(publicId: string, options?: any) {
    try {
      // Get details about the asset
      const result = await this.Cloudinary.api.resource(
        publicId,
        options ?? {},
      );

      return result.colors;
    } catch (error) {
      console.error(error);
      return new Error(`Unable to get image ${publicId}`);
    }
  }
}
