import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UploadApiResponse } from 'cloudinary';
import FormData from 'form-data';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SharpHelper } from 'src/sharp/sharp.service';
import checkForCat from 'src/utils/CheckForCat';
import uploadToCloudinary from 'src/utils/UploadToCloudinary';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
    private readonly configService: ConfigService,
  ) {}

  async upload(
    image: any,
    userId: string,
    userState: number,
    userCity: number,
  ) {
    // TODO - I wish I could method chain here, but idk how...
    let reformattedImg = new SharpHelper(image.mimetype, image.buffer);
    // Somewhat nasty way to do method chaining... since these are async functions, we can't just chain them together as normal sadly
    reformattedImg = await (
      await reformattedImg.resizeImage(500)
    ).toFormat('png');

    const reformattedImgDetails = reformattedImg.getImgDetails();

    // TODO - this bundle of logic down to checkForCats() should maybe be nested in a helper function of some sort...?
    const fd = new FormData();
    fd.append(
      'image_base64',
      Buffer.from(reformattedImgDetails.buffer).toString('base64'),
    );
    fd.append('threshold', '49');

    // Get an idea if there is a cat in the image... or if the image is a drawing. We must ensure the image is of a valid format...
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

    // I made some random utility functions (probably not with the best practices in mind) to clear up some of the bloat
    checkForCat(tags);
    const res: UploadApiResponse = await uploadToCloudinary(
      this.cloudinary,
      reformattedImgDetails,
    );

    // NOTE: if this user search fails, the post creation will fail due to a 500 server error...
    // The user search WILL fail if we didn't properly include the UUID provided by supabase auth upon authenticating with Google OAuth...
    // TODO - we need to find a way to consistently identify our native users w/ the metadata provided by google/supabase auth
    const user = await this.prisma.user.findFirst({
      where: { uuid: userId },
    });

    const newPost = await this.prisma.post
      .create({
        data: {
          contentId: res.secure_url,
          authorId: user?.id ?? 1,
          published: true,
          isCatOnHead: null,
          postState: userState,
          postCity: userCity,
        },
      })
      .catch(() => {
        throw new InternalServerErrorException(
          'There was an issue uploading your image. It could either be due to your location or account. Try clearing your cache/cookies and logging out and back in',
        );
      });

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
          id_state: {
            select: {
              state_code: true,
              state_name: true,
            },
          },
          id_city: {
            select: {
              city: true,
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
    try {
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

  async findAllNearby(userState: number, userCity: number) {
    try {
      const res = await this.prisma.post.findMany({
        where: {
          postState: userState,
          postCity: userCity,
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
          id_state: {
            select: {
              state_code: true,
              state_name: true,
            },
          },
          id_city: {
            select: {
              city: true,
            },
          },
        },
      });

      return res;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        'An error occured while trying to grab posts. We think there could be an issue your location services. Please try again later.',
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
          id_state: {
            select: {
              state_code: true,
              state_name: true,
            },
          },
          id_city: {
            select: {
              city: true,
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

  async getForecast(state: number, city: number) {
    console.log(`Someone wants the forecast for ${state}, ${city}!`);
    const currDate = new Date();
    const foreCastDate = `${currDate.getFullYear()}/${
      currDate.getMonth() + 1
    }/${currDate.getDate()}`;

    const forecast = await this.prisma.predictions.findFirst({
      where: {
        us_state: state,
        us_city: city,
        date: new Date(foreCastDate),
      },
    });

    if (!forecast || !forecast.prediction) {
      return -1;
    }

    return forecast.prediction;
  }
}
