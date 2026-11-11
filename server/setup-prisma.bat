@echo off
cd C:\xampp\htdocs\portfolio\server

echo Installing @prisma/client...
npm install @prisma/client

echo Generating Prisma Client...
npx prisma generate

echo Running contract emit...
npx prisma contract emit

echo Migration - type "yes" when prompted...
npx prisma migrate deploy

echo Prisma setup complete!
pause