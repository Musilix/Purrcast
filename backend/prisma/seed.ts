import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { id: 1 },
    update: {
      bio: 'I like cats!',
      uuid: '',
      name: 'Kareem',
      username: 'keem',
    },
    create: {
      bio: 'I like cats!',
      uuid: '',
      name: 'Kareem',
      username: 'keem',
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
  });

  await prisma.user.upsert({
    where: { id: 2 },
    update: {
      bio: 'I somewhat like cats',
      uuid: '',
      name: 'Runt Runner',
      username: 'Runt Runner',
    },
    create: {
      bio: 'I somewhat like cats',
      uuid: '',
      name: 'Runt Runner',
      username: 'Runt Runner',
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
  });

  await prisma.user.upsert({
    where: { id: 3 },
    update: {
      bio: 'I only like Thaddeus, my cat.',
      uuid: '',
      name: 'Sunni',
      username: 'sunndawg',
    },
    create: {
      bio: 'I only like Thaddeus, my cat.',
      uuid: '',
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
