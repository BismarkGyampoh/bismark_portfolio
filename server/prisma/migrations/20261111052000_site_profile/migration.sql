CREATE TABLE "SiteProfile" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "introduction" TEXT NOT NULL,
    "aboutShort" TEXT NOT NULL,
    "aboutLong" TEXT NOT NULL,
    "interests" TEXT NOT NULL,
    "philosophy" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "whatsappUrl" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "cvPath" TEXT NOT NULL,
    "socials" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteProfile_pkey" PRIMARY KEY ("id")
);
