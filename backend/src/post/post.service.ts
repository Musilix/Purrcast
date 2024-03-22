import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SharpHelper } from 'src/sharp/sharp.service';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async upload(image: any, userId: string) {
    try {
      // TODO - inject this into the service with manual instantion options
      let reformattedImg = new SharpHelper(image.mimetype, image.buffer);
      reformattedImg = await reformattedImg.resizeImage(500);
      const reformattedImgDetails = reformattedImg.getImgDetails();

      /* 
        The options sent to our cloudinary service's upload method here are using an upload type of just 'upload'.
        If we wanted to strengthen our security, we could use the 'authenticated' upload type or even private
      */
      const res = await this.cloudinary.upload(reformattedImgDetails, {
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

      if (res && res.secure_url !== undefined) {
        // NOTE: if this user search fails, the post creation will fail due to a 500 server error...
        // The user search WILL fail if we didn't properly include the UUID provided by supabase auth upon authenticating with Google OAuth...
        // TODO - we need to find a way to consistently identify our native users w/ the metadata provided by google/supabase auth
        const user = await this.prisma.user.findFirst({
          where: { uuid: userId },
        });

        const newPost = await this.prisma.post.create({
          data: {
            contentId: res.secure_url,
            authorId: user?.id ?? 1,
            published: true,
          },
        });

        // TODO - idk what to return... I know I should probably use a hash for the post identifier...
        return { resource: res.secure_url, postId: newPost.id };
      } else {
        throw new InternalServerErrorException(
          'Unable to upload your file due to a communication error with our image hosting provider. Please try again later.',
        );
      }
    } catch (e) {
      throw new InternalServerErrorException(
        'Unable to upload your file due to an account issue. Please try again later.',
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
