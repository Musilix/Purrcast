import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TestData } from 'src/temp-entities/TestData.entity';
@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async upload(image: any): Promise<TestData> {
    try {
      //TODO: Move this to a sharp helper pipe
      // resize image before sending it to cloudinary
      const resizedImageBuffer = await sharp(image.buffer)
        .resize(350)
        .toBuffer();
      const resizedImageMimeType = image.mimetype;

      const resizedImage = {
        buffer: resizedImageBuffer,
        mimetype: resizedImageMimeType,
      };

      /* 
        The options sent to our cloudinary service's upload method here are using an upload type of just 'upload'.
          If we wanted to strengthen our security, we could use the 'authenticated' upload type or even private
      */
      const res = await this.cloudinary.upload(resizedImage, {
        resource_type: 'image',
        unique_filename: true,
        overwrite: false,
        format: 'png',
        type: 'upload', //TODO - change this to authenticated or private if we decide to utilize token-based access control
        // TODO - in the future, it may be necessary to hide assets with access_control settings
        // If I continue to use cloudinary, I will need to contact them for a encrpytion key to generate valid tokens for authenticated users to access assets
        // access_control: {
        //   access_type: 'token',

        // },
      });

      // get user data placeholder
      if (res.version !== undefined && res.public_id !== undefined) {
        // TODO: change to true implementation where we utilize users creds sent with req body to /upload
        //NOTE: if this user search fails, the post creation will fail due to a 500 server error...
        const user = await this.prisma.user.findUnique({ where: { id: 1 } });

        await this.prisma.post.create({
          data: {
            contentId: `v${res.version}/${res.public_id}.png`,
            authorId: user.id,
            published: true,
          },
        });

        return {
          data: {
            message: 'File uploaded successfully.',
            payload: res,
          },
          statusCode: 200,
        };
      } else {
        throw new Error('Unable to upload file.');
      }
    } catch (e) {
      console.error(`${e}`);

      return {
        data: {
          message: `Unable to upload file`,
        },
        statusCode: 500,
      };
    }
  }

  async getImage(postId: string) {
    try {
      const res = await this.cloudinary.getUpload(postId);
      return res;
    } catch (e) {
      return new Error('Unable to get image');
    }
  }

  async findAll() {
    const res = await this.prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: true,
      },
    });
    return res;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} post`;
  // }

  // update(id: number, updatePostDto: UpdatePostDto) {
  //   return `This action updates a #${id} post`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} post`;
  // }
}
