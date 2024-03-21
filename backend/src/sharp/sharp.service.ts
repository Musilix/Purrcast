import { Injectable, InternalServerErrorException } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class SharpHelper {
  constructor(
    private imgMimeType,
    private imgBuffer,
  ) {
    this.imgMimeType = imgMimeType;
    this.imgBuffer = sharp(imgBuffer);
  }

  async resizeImage(size: number = 500): Promise<SharpHelper> {
    try {
      this.imgBuffer = await this.imgBuffer.resize(size).toBuffer();

      return this;
    } catch (error) {
      throw new InternalServerErrorException(
        'There was a problem while trying to resize the image.',
      );
    }
  }

  getImgDetails() {
    return {
      buffer: this.imgBuffer,
      mimetype: this.imgMimeType,
    };
  }
}
