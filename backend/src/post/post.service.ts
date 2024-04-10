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
import FormData from 'form-data';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
    private readonly configService: ConfigService,
  ) {}

  async upload(image: any, userId: string) {
    // TODO - We could inject this into the service with manual instantion options
    let reformattedImg = new SharpHelper(image.mimetype, image.buffer);
    reformattedImg = await reformattedImg.resizeImage(500);
    const reformattedImgDetails = reformattedImg.getImgDetails();

    // TODO - this bundle of logic should maybe be nested in a helper function of some sort...
    const fd = new FormData();
    fd.append(
      'image_base64',
      Buffer.from(reformattedImgDetails.buffer).toString('base64'),
    );
    fd.append('threshold', '49');

    const tags = await axios
      .post('https://api.imagga.com/v2/tags', fd, {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${this.configService.get(
              'IMAGGA_API_KEY',
            )}:${this.configService.get('IMAGGA_API_SECRET')}`,
          ).toString('base64')}`,
        },
      })
      .then((response) => {
        return response.data.result.tags;
      })
      .catch(() => {
        throw new InternalServerErrorException(
          'There was an issue deciphering what was in the image. Please try again later.',
        );
      });

    const hasCat = tags.some((tag: any) =>
      tag.tag.en.match(/cat|kitten|feline|kitty/i),
    );

    const isRealCat = !tags.some((tag: any) =>
      tag.tag.en.match(/art|sketch|paint|draw|doodle/i),
    );

    // Check if image is a drawing FIRST
    if (!isRealCat) {
      throw new InternalServerErrorException(
        "You gotta make sure you're uploading a real cat picture. No drawings allowed! I'm so sorry.",
      );
    }

    // Check if the image is a cat now...
    if (!hasCat) {
      throw new InternalServerErrorException(
        "You gotta make sure you're uploading a cat picture, bruh!",
      );
    }

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

    if (!res || res.secure_url == undefined) {
      throw new InternalServerErrorException(
        'Unable to upload your file due to a communication error with our image hosting provider. Please try again later.',
      );
    }

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
          upvotes: true,
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

  async findAllNearMe(lat: number, long: number) {
    // TODO - if no locatio provided OR lat/long are missng/invalid, return error message

    try {
      console.log(`Searching for posts near ${lat}, ${long}`);
      // Call function to get nearby entities, given the location
      // TODO - change implementation to do real thing.
      const res = await this.prisma
        .$queryRaw`SELECT * FROM get_closest_city(${lat}, ${long})`;

      return res;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        'An error occured while trying to grab posts. We think there could be an issue with the location you provided. Please try again later.',
      );
    }
  }

  // TODO - add ability to retrieve all posts you've upvoted
  async findAllUpvotes(userId: string) {
    console.log(userId);
    return [];
  }

  // TODO - add ability to retrieve all posts that are pending classification for isCatOnHead
  async findAllPending() {
    return [];
  }

  async findOne(id: number) {
    try {
      const res = await this.prisma.post.findUnique({
        where: {
          id: id,
          published: true,
        },
        select: {
          published: true,
          contentId: true,
          createdAt: true,
          updatedAt: true,
          id: true,
          upvotes: true,
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
      return new InternalServerErrorException(
        'An error occurred while trying to get the post. That post may have been deleted or never existed. Please have a go at it a little later',
      );
    }
  }

  async upvote(id: number, userId: string) {
    const user = await this.prisma.user
      .findFirstOrThrow({
        where: {
          uuid: userId,
        },
      })
      .catch(() => {
        throw new InternalServerErrorException(
          "Somehow, you're user information is invalid. Try logging in again.",
        );
      });

    const didUserAlreadyVote = await this.prisma.upvotes.findFirst({
      where: {
        postId: id as number,
        userId: user.id as number,
      },
    });

    // const didUserAlreadyVote = await this.prisma.post.findFirst({
    //   where: {
    //     id: id,
    //     Upvotes: {
    //       some: {
    //         user: {
    //           uuid: userId,
    //         },
    //       },
    //     },
    //   }
    // });

    if (didUserAlreadyVote) {
      throw new InternalServerErrorException(
        "You've already upvoted this post.",
      );
    }

    await this.prisma.upvotes.create({
      data: {
        postId: id,
        userId: user.id,
      },
    });

    return this.prisma.upvotes.count({
      where: {
        postId: id,
      },
    });
  }
}
