#!/bin/sh

npx prisma generate
npx prisma migrate dev
npx prisma studio
npm run start:dev