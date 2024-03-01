import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      bio: 'I like cats',
      user: {
        create: {
          name: 'Jon',
          username: 'jonjon',
          location: 'Atlanta, GA',
          posts: {
            create: [
              {
                published: true,
                contentId: "What's the deal with all these cats",
              },
              {
                published: true,
                createdAt: new Date('2023-05-08T11:42:00Z'),
                contentId: 'Cat On Head',
              },
              {
                published: false,
                contentId: 'Kill incels',
              },
            ],
          },
        },
      },
    },
  });

  await prisma.profile.upsert({
    where: { id: 2 },
    update: {},
    create: {
      bio: 'I somewhat like cats',
      user: {
        create: {
          name: 'Kareem',
          username: 'keembo',
          location: 'Corvallis, OR',
          posts: {
            create: [
              {
                published: true,
                createdAt: new Date('2023-08-20T03:00:00Z'),
                contentId: "Look at my cat! They're on their head",
              },
              {
                published: false,
                contentId: 'How do I use this thing',
              },
              {
                published: true,
                contentId: 'Another day, another cat on their head',
              },
            ],
          },
        },
      },
    },
  });

  await prisma.profile.upsert({
    where: { id: 3 },
    update: {},
    create: {
      bio: 'I only like Thaddeus, my cat.',
      user: {
        create: {
          name: 'Sunni',
          username: 'sunndawg',
          location: 'Corvallis, OR',
          posts: {
            create: [
              {
                published: true,
                createdAt: new Date('2023-03-15T11:42:00Z'),
                contentId:
                  'Todays my birthday! And my cat decided to sleep on their head! Come on!!',
              },
              {
                published: true,
                contentId: 'Another day, another cat on their head',
              },
            ],
          },
        },
      },
    },
  });

  await prisma.profile.upsert({
    where: { id: 4 },
    update: {},
    create: {
      bio: "I've never owned a cat. I'm allergic.",
      user: {
        create: {
          name: 'Eddie',
          username: 'edgar_the_maniac',
          location: 'Corvallis, OR',
          posts: {
            create: [
              {
                published: false,
                createdAt: new Date('2023-03-11T07:42:43Z'),
                contentId: "Checking if I'm shadow banned",
              },
              {
                published: false,
                createdAt: new Date('2023-03-09T01:03:10Z'),
                contentId: 'Am I shadowbanned? can any1 see this?',
              },
            ],
          },
        },
      },
    },
  });

  await prisma.profile.upsert({
    where: { id: 5 },
    update: {},
    create: {
      bio: 'I eat cats for breakfast, lunch, and dinner.',
      user: {
        create: {
          name: 'Annabelle',
          username: 'annie_belly',
          location: 'Santa Barbara, CA',
          posts: {
            create: [
              {
                published: true,
                contentId: 'woof woof!',
              },
              {
                published: true,
                contentId: 'grrrrrr, woof woof!',
              },
              {
                published: true,
                contentId: 'BARK!',
              },
            ],
          },
        },
      },
    },
  });
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
