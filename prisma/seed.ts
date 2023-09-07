import { Prisma } from '@prisma/client';
import { client } from './client';

const seedUsers = async () => {
  const users: Prisma.UserCreateManyInput[] = Array.from({ length: 5 }, (_, i) => ({
    email: `alexgogu321+cs-user-${i}@gmail.com`,
    name: `Alex ${i}`,
    password: 'Password99!',
  }));

  console.log(`Seeding ${users.length} users...`);

  await client.user.createMany({
    data: users,
  });
};

seedUsers();
