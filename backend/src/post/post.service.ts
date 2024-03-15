import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import sharp from 'sharp';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async upload(image: any, userId: string): Promise<object> {
    try {
      //TODO: Move this to a sharp helper pipe
      // resize image before sending it to cloudinary
      const resizedImageBuffer = await sharp(image.buffer)
        .resize(500)
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

      if (res.version !== undefined && res.public_id !== undefined) {
        // NOTE: if this user search fails, the post creation will fail due to a 500 server error...

        return {
          contentId: res.secure_url,
          authorId: userId,
          published: true,
        };

        // const user = await this.prisma.user.findFirstOrThrow({
        //   where: { uuid: userId },
        // });

        // await this.prisma.post.create({
        //   data: {
        //     contentId: res.secure_url,
        //     authorId: user.id,
        //     published: true,
        //   },
        // });

        // return true;
      } else {
        throw new InternalServerErrorException(
          'Unable to upload your file because of issues with your account. Please try again later.',
        );
      }
    } catch (e) {
      throw new InternalServerErrorException(
        'Unable to upload your file. Please try again later.',
      );
    }
  }

  async getImage(postId: string) {
    try {
      const res = await this.cloudinary.getUpload(postId);
      return res;
    } catch (e) {
      throw new NotFoundException(
        `Unable to retrieve the image with an ID of ${postId}`,
      );
    }
  }

  async findAll() {
    try {
      const res = await this.prisma.post.findMany({
        where: {
          published: true,
        },
        include: {
          author: true,
        },
      });

      return {
        payload: {
          message: 'Posts retrieved succesfully.',
          content: res,
          error: null,
          statusCode: 200,
        },
      };
    } catch (e) {
      console.error(`An error occured while trying to retrieva all posts ${e}`);

      return {
        payload: {
          message: null,
          content: null,
          error: 'An error occured while trying to retrieva all posts ',
          statusCode: 501,
        },
      };
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.prisma.post.findUnique({
        where: {
          id: id,
        },
        include: {
          author: true,
        },
      });

      return {
        payload: {
          message: `Post ${id} retrieved succesfully.`,
          content: res,
          error: null,
          statusCode: 200,
        },
      };
    } catch (e) {
      console.error(`An error occured while trying to retrieva all posts ${e}`);

      return {
        payload: {
          message: null,
          content: null,
          error: `An error occurred while fetching post ${id}. Please try again later.`,
          statusCode: 501,
        },
      };
    }
  }
}
