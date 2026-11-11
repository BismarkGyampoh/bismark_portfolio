CREATE TABLE "MediaArtwork" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaArtwork_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MediaArtwork_published_displayOrder_idx" ON "MediaArtwork"("published", "displayOrder");

INSERT INTO "MediaArtwork" ("id", "title", "altText", "imageUrl", "displayOrder", "published", "updatedAt") VALUES
('media-flikbi-design-services', 'FLiKBi · Design services', 'FLiKBi MEDIA flyer advertising graphic design services', '/creative-media/flikbi-design-services.jpg', 1, true, CURRENT_TIMESTAMP),
('media-kingdom-builders-band-event', 'Sound of Revival · Event poster', 'Sound of Revival event poster for Kingdom Builders Band', '/creative-media/kingdom-builders-band-event.png', 2, true, CURRENT_TIMESTAMP),
('media-acses-candidate-campaign', 'ACSES · Campaign design', 'Campaign design for an ACSES presidential candidate', '/creative-media/acses-candidate-campaign.png', 3, true, CURRENT_TIMESTAMP),
('media-flikbi-installation-services', 'FLiKBi · Service promotion', 'FLiKBi installation services promotional flyer', '/creative-media/flikbi-installation-services.jpg', 4, true, CURRENT_TIMESTAMP),
('media-national-youth-week', 'National Youth Week · Event flyer', 'National Youth Week promotional flyer', '/creative-media/national-youth-week.png', 5, true, CURRENT_TIMESTAMP),
('media-jk-fashion-promotion', 'JK Fashion · Promotional flyer', 'JK Fashion clothing promotion flyer', '/creative-media/jk-fashion-promotion.jpg', 6, true, CURRENT_TIMESTAMP),
('media-campus-trade-marketplace', 'Campus Trade GH · Marketplace promotion', 'Campus Trade GH student marketplace promotional flyer', '/creative-media/campus-trade-marketplace.jpg', 7, true, CURRENT_TIMESTAMP),
('media-sound-of-revival-poster', 'Sound of Revival · Poster variation', 'Alternate Sound of Revival event poster for Kingdom Builders Band', '/creative-media/sound-of-revival-poster.png', 8, true, CURRENT_TIMESTAMP),
('media-personal-linkedin-cover', 'Personal profile · Social cover', 'Information systems and graphic design personal profile cover', '/creative-media/personal-linkedin-cover.png', 9, true, CURRENT_TIMESTAMP),
('media-building-success-conference', 'Building Success · Conference flyer', 'Building Success business conference flyer', '/creative-media/building-success-conference.png', 10, true, CURRENT_TIMESTAMP),
('media-growth-academy-promotion', 'Growth Academy · Promotional flyer', 'Growth Academy business strategy promotional flyer', '/creative-media/growth-academy-promotion.png', 11, true, CURRENT_TIMESTAMP),
('media-childrens-ministry-hallel-night', 'Children’s Ministry · Event poster', 'Children’s Ministry Hallel Night event poster', '/creative-media/childrens-ministry-hallel-night.png', 12, true, CURRENT_TIMESTAMP);
