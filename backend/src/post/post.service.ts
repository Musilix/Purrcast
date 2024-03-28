import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SharpHelper } from 'src/sharp/sharp.service';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
    private readonly configService: ConfigService,
  ) {}

  async upload(image: any, userId: string) {
    // TODO - inject this into the service with manual instantion options
    let reformattedImg = new SharpHelper(image.mimetype, image.buffer);
    reformattedImg = await reformattedImg.resizeImage(500);
    const reformattedImgDetails = reformattedImg.getImgDetails();

    //  fixme- this broke stuff
    const fd = new FormData();
    fd.append(
      'image_base64',
      Buffer.from(reformattedImgDetails.buffer).toString('base64'),
    );
    fd.append('threshold', '10');

    // call imagga service to first see if our base64 image is a cat
    const hasCat = await axios
      .post(
        'https://api.imagga.com/v2/tags',
        {
          image_base64: Buffer.from(reformattedImgDetails.buffer).toString(
            'base64',
          ),
        },
        {
          auth: {
            username: this.configService.get('IMAGGA_API_KEY') ?? '',
            password: this.configService.get('IMAGGA_API_SECRET') ?? '',
          },
        },
      )
      .catch((e) => console.error(e));

    // console.log(hasCat);

    return hasCat;

    // fixme - uncomment when done
    // /*
    //     The options sent to our cloudinary service's upload method here are using an upload type of just 'upload'.
    //     If we wanted to strengthen our security, we could use the 'authenticated' upload type or even private
    //   */
    // const res = await this.cloudinary.upload(reformattedImgDetails, {
    //   categorization: 'imagga_tagging',
    //   auto_tagging: 0.4,
    //   resource_type: 'image',
    //   unique_filename: true,
    //   overwrite: false,
    //   format: 'png',
    //   type: 'upload', //TODO - change this to authenticated or private if we decide to utilize token-based access control
    //   // TODO - in the future, it may be necessary to hide assets with access_control settings
    //   // If I continue to use cloudinary, I will need to contact them for a encrpytion key to generate valid tokens for authenticated users to access assets
    //   // access_control: {
    //   //   access_type: 'token',

    //   // },
    // });

    // // FIXME - I don't really like this stack of conditionals...
    // if (!res || res.secure_url == undefined) {
    //   throw new InternalServerErrorException(
    //     'Unable to upload your file due to a communication error with our image hosting provider. Please try again later.',
    //   );
    // }
    // console.log(res.tags);

    // // Check if the image is a drawing or art of a cat
    // for (const tag of res.tags) {
    //   if (tag.indexOf('art') !== -1) {
    //     throw new InternalServerErrorException(
    //       "You gotta make sure you're uploading a real cat picture. No drawings allowed! I'm so sorry.",
    //     );
    //   }
    // }

    // // check to make sure it is indeed a cat
    // if (!res.tags.includes('cat')) {
    //   throw new InternalServerErrorException(
    //     "You gotta make sure you're uploading a cat picture, bruh!",
    //   );
    // }

    // // NOTE: if this user search fails, the post creation will fail due to a 500 server error...
    // // The user search WILL fail if we didn't properly include the UUID provided by supabase auth upon authenticating with Google OAuth...
    // // TODO - we need to find a way to consistently identify our native users w/ the metadata provided by google/supabase auth
    // const user = await this.prisma.user.findFirst({
    //   where: { uuid: userId },
    // });

    // const newPost = await this.prisma.post.create({
    //   data: {
    //     contentId: res.secure_url,
    //     authorId: user?.id ?? 1,
    //     published: true,
    //   },
    // });

    // // TODO - idk what to return... I know I should probably use a hash for the post identifier...
    // return { resource: res.secure_url, postId: newPost.id };
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

  async findAll(userId?: string) {
    const findAllFilters = userId
      ? { published: true, author: { uuid: userId } }
      : { published: true };

    try {
      const res = await this.prisma.post.findMany({
        where: findAllFilters,
        select: {
          published: true,
          contentId: true,
          createdAt: true,
          updatedAt: true,
          id: true,
          author: {
            select: {
              bio: true,
              location: true,
              name: true,
              username: true,
            },
          },
        },
      });

      return res;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        'An error occured while trying to grab posts. Maybe go smoke a toke and come have a go at it again a little later?',
      );
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

      return res;
    } catch (e) {
      return new InternalServerErrorException(
        'An error occurred while trying to get the post. Please have a go at it a little later',
      );
    }
  }

  async upvote(id: number, userId: string) {
    try {
      // check an upvote table if a user has given an upvote to the given post
      // if they have, throw an error "You have already upvoted this post"
      // if they haven't, add an upvote to the post and add a record to the upvote table
      console.log(id, userId);
    } catch (e) {
      console.error(`An error occured while trying to upvote post ${id} ${e}`);

      throw new InternalServerErrorException(
        'An error occured while trying to upvote post. Please try again later.',
      );
    }
  }
}
