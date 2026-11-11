import { fileURLToPath } from 'node:url'
import { PrismaClient } from '@prisma/client'
import { creativeMedia } from '../../client/src/data/creativeMedia.js'

const prisma = new PrismaClient()

async function seedMedia() {
  let created = 0
  let existing = 0

  for (const artwork of creativeMedia) {
    const savedArtwork = await prisma.mediaArtwork.findFirst({
      where: { imageUrl: artwork.imageUrl },
      select: { id: true },
    })

    if (savedArtwork) {
      existing += 1
      continue
    }

    await prisma.mediaArtwork.create({
      data: {
        title: artwork.title,
        altText: artwork.altText,
        imageUrl: artwork.imageUrl,
        displayOrder: artwork.displayOrder,
        published: true,
      },
    })
    created += 1
  }

  console.log(`Media seed complete: ${created} added, ${existing} already present.`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedMedia()
    .catch((error) => {
      console.error('Unable to seed media artwork:', error)
      process.exitCode = 1
    })
    .finally(async () => prisma.$disconnect())
}
