import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';

// TODO - find a better way to send back packets of data and errors... lots of repetition here
export interface PostResponse {
  payload: {
    message: string;
    content: string | null;
    error: string | null;
    statusCode: number;
  };
}
@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async upload(image: any): Promise<PostResponse> {
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
            contentId: res.secure_url,
            authorId: user.id,
            published: true,
          },
        });

        return {
          payload: {
            message: 'File uploaded successfully.',
            content: null,
            error: null,
            statusCode: 200,
          },
        };
      } else {
        throw new Error('Unable to upload file.');
      }
    } catch (e) {
      console.error(`${e}`);

      return {
        payload: {
          message: null,
          content: null,
          error: 'Unable to upload your file. Please try again later.',
          statusCode: 501,
        },
      };
    }
  }

  async getImage(postId: string) {
    try {
      const res = await this.cloudinary.getUpload(postId);
      return {
        payload: {
          message: 'Image retrieve succesfully.',
          content: res,
          error: null,
          statusCode: 200,
        },
      };
    } catch (e) {
      return {
        payload: {
          message: null,
          content: null,
          error: 'Unable to retrieve image. Please try again later. Sorry!',
          statusCode: 501,
        },
      };
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

  // update(id: number, updatePostDto: UpdatePostDto) {
  //   return `This action updates a #${id} post`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} post`;
  // }
}
