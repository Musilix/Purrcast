import { PrismaClient } from '@prisma/client';
import { seedCities } from './bigSeeds/citySeed';
import { seedStates } from './bigSeeds/stateSeed';
import { createFunctionsIHateThisWhatIsPrismaReallyGoodFor } from './createLogicInDev/createDatabaseFunctions';
const prisma = new PrismaClient();

async function main() {
  // First we seed us_states and us_cities with raw sql queries from extenral files
  // So that we can accurately reference them by their PKs/FKs when creating Posts below
  await seedStates(prisma);
  await seedCities(prisma);

  await prisma.user.upsert({
    where: { id: 1 },
    update: {
      bio: 'I like cats!',
      uuid: '',
      name: 'Kareem',
      username: 'keem',
      posts: {
        create: [
          {
            published: true,
            isDeleted: true,
            createdAt: new Date(2024, 3, 17),
            contentId: "What's the deal with all these cats",
            isCatOnHead: true,
            postState: 25,
            postCity: 1,
          },
          {
            published: true,
            isDeleted: false,
            createdAt: new Date(2024, 3, 17),
            contentId: "What's the deal with all these cats",
            isCatOnHead: true,
            postState: 38,
            postCity: 21241,
          },
          {
            published: true,
            isDeleted: false,
            createdAt: new Date(2024, 3, 17),
            contentId: "What's the deal with all these cats",
            isCatOnHead: true,
            postState: 38,
            postCity: 21241,
          },
          {
            published: true,
            createdAt: new Date(2024, 3, 17),
            contentId: 'Cat On Head',
            isCatOnHead: true,
            postState: 25,
            postCity: 1,
          },
          {
            published: false,
            contentId: 'Kill incels',
            createdAt: new Date(2024, 3, 17),
            isCatOnHead: true,
            postState: 25,
            postCity: 1,
          },
        ],
      },
    },
    create: {
      bio: 'I like cats!',
      uuid: '',
      name: 'Kareem',
      username: 'keem',
      posts: {
        create: [
          {
            published: true,
            isDeleted: true,
            createdAt: new Date(2024, 3, 17),
            contentId: "What's the deal with all these cats",
            isCatOnHead: true,
            postState: 25,
            postCity: 1,
          },
          {
            published: true,
            createdAt: new Date('2023-05-08T11:42:00Z'),
            contentId: 'Cat On Head',
            isCatOnHead: true,
            postState: 25,
            postCity: 1,
          },
          {
            published: true,
            isDeleted: false,
            createdAt: new Date(2024, 3, 17),
            contentId: "What's the deal with all these cats",
            isCatOnHead: true,
            postState: 38,
            postCity: 21241,
          },
          {
            published: true,
            isDeleted: false,
            createdAt: new Date(2024, 3, 17),
            contentId: "What's the deal with all these cats",
            isCatOnHead: true,
            postState: 38,
            postCity: 21241,
          },
          {
            published: false,
            createdAt: new Date(2024, 3, 17),
            contentId: 'Kill incels',
            isCatOnHead: true,
            postState: 25,
            postCity: 1,
          },
        ],
      },
    },
  });

  await prisma.user.upsert({
    where: { id: 2 },
    update: {
      bio: 'I somewhat like cats',
      uuid: '',
      name: 'Runt Runner',
      username: 'Runt Runner',
      posts: {
        create: [
          {
            published: true,
            createdAt: new Date('2023-08-20T03:00:00Z'),
            contentId: "Look at my cat! They're on their head",
            postState: 10,
            postCity: 5,
          },
          {
            published: false,
            createdAt: new Date(2024, 3, 17),
            contentId: 'How do I use this thing',
            isCatOnHead: true,
            postState: 10,
            postCity: 5,
          },
          {
            published: true,
            createdAt: new Date(2024, 3, 17),
            contentId: 'Another day, another cat on their head',
            isCatOnHead: false,
            postState: 10,
            postCity: 5,
          },
          {
            published: true,
            isDeleted: false,
            createdAt: new Date(2024, 3, 17),
            contentId: "What's the deal with all these cats",
            isCatOnHead: true,
            postState: 38,
            postCity: 21241,
          },
          {
            published: true,
            isDeleted: false,
            createdAt: new Date(2024, 3, 17),
            contentId: "What's the deal with all these cats",
            isCatOnHead: false,
            postState: 38,
            postCity: 21241,
          },
        ],
      },
    },
    create: {
      bio: 'I somewhat like cats',
      uuid: '',
      name: 'Runt Runner',
      username: 'Runt Runner',
      posts: {
        create: [
          {
            published: true,
            createdAt: new Date('2023-08-20T03:00:00Z'),
            contentId: "Look at my cat! They're on their head",
            postState: 10,
            postCity: 5,
          },
          {
            published: false,
            createdAt: new Date(2024, 3, 17),
            contentId: 'How do I use this thing',
            isCatOnHead: true,
            postState: 10,
            postCity: 5,
          },
          {
            published: true,
            createdAt: new Date(2024, 3, 17),
            contentId: 'Another day, another cat on their head',
            isCatOnHead: false,
            postState: 10,
            postCity: 5,
          },
          {
            published: true,
            isDeleted: false,
            createdAt: new Date(2024, 3, 17),
            contentId: "What's the deal with all these cats",
            isCatOnHead: true,
            postState: 38,
            postCity: 21241,
          },
          {
            published: true,
            isDeleted: false,
            createdAt: new Date(2024, 3, 17),
            contentId: "What's the deal with all these cats",
            isCatOnHead: false,
            postState: 38,
            postCity: 21241,
          },
        ],
      },
    },
  });

  await prisma.user.upsert({
    where: { id: 3 },
    update: {
      bio: 'I only like Thaddeus, my cat.',
      uuid: '',
      name: 'Sunni',
      username: 'sunndawg',
      posts: {
        create: [
          {
            published: true,
            createdAt: new Date('2023-03-15T11:42:00Z'),
            contentId:
              'Todays my birthday! And my cat decided to sleep on their head! Come on!!',
            isCatOnHead: true,
            postState: 1,
            postCity: 1,
          },
          {
            published: true,
            createdAt: new Date(2024, 3, 17),
            contentId: 'Another day, another cat on their head',
            isCatOnHead: true,
            postState: 1,
            postCity: 1,
          },
          {
            published: true,
            createdAt: new Date(2024, 3, 17),
            contentId: 'Another day, another cat on their head',
            isCatOnHead: true,
            postState: 1,
            postCity: 1,
          },
          {
            published: true,
            createdAt: new Date(2024, 3, 17),
            contentId: 'Another day, another cat on their head',
            isCatOnHead: false,
            postState: 1,
            postCity: 1,
          },
        ],
      },
    },
    create: {
      bio: 'I only like Thaddeus, my cat.',
      uuid: '',
      name: 'Sunni',
      username: 'sunndawg',
      posts: {
        create: [
          {
            published: true,
            createdAt: new Date('2023-03-15T11:42:00Z'),
            contentId:
              'Todays my birthday! And my cat decided to sleep on their head! Come on!!',
            isCatOnHead: true,
            postState: 1,
            postCity: 1,
          },
          {
            published: true,
            createdAt: new Date(2024, 3, 17),
            contentId: 'Another day, another cat on their head',
            isCatOnHead: true,
            postState: 1,
            postCity: 1,
          },
          {
            published: true,
            createdAt: new Date(2024, 3, 17),
            contentId: 'Another day, another cat on their head',
            isCatOnHead: true,
            postState: 1,
            postCity: 1,
          },
          {
            published: true,
            createdAt: new Date(2024, 3, 17),
            contentId: 'Another day, another cat on their head',
            isCatOnHead: false,
            postState: 1,
            postCity: 1,
          },
        ],
      },
    },
  });

  // I don't really know what to do when it comes to creating more than just the model/structure of my DB
  // I have things like triggers, cron jobs, functions, and what not that I want to sync between my dev and prod env,
  // but there doesn't seem to be a straightforward way of accomplishing that while using just Prisma...
  await createFunctionsIHateThisWhatIsPrismaReallyGoodFor(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
