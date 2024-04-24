import { Injectable, InternalServerErrorException } from '@nestjs/common';
import sharp, { FormatEnum } from 'sharp';

@Injectable()
export class SharpHelper {
  constructor(
    private imgMimeType,
    private imgBuffer,
  ) {
    this.imgMimeType = imgMimeType;
    this.imgBuffer = imgBuffer;
  }

  async resizeImage(size: number = 500): Promise<SharpHelper> {
    this.imgBuffer = await sharp(this.imgBuffer).resize(size).toBuffer();

    return this;
  }

  async toFormat(format: keyof FormatEnum = 'png'): Promise<SharpHelper> {
    try {
      this.imgBuffer = await sharp(this.imgBuffer).toFormat(format).toBuffer();

      return this;
    } catch (error) {
      throw new InternalServerErrorException(
        `There was a problem while trying to convert the image to the given format: ${format}.`,
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
