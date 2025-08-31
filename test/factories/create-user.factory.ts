// vamos criar uma lista de usuários para teste aqui
// tendo em mente que a cada iteração criamos usuários

import { PrismaClient, User } from 'prisma/generated/prisma';

// logo após de cada interação deletamos todos os users do banco de dados
export async function createUserFactory({ user }: { user?: User[] }) {
  const prismaClient = new PrismaClient();
  if (!user) {
    user = [
      {
        id: '123',
        name: 'amarildo',
        email: 'amarildo@gmail.com',
        password: 'amarildo123',
      },
      {
        id: '124',
        name: 'fernando',
        email: 'fernando@gmail.com',
        password: 'fernando123',
      },
      {
        id: '125',
        name: 'lucas',
        email: 'lucas@gmail.com',
        password: 'lucas123',
      },
    ];
  }

  await prismaClient.user.createMany({
    data: user,
  });
}
