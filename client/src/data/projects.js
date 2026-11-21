import { creativeMedia } from './creativeMedia.js'

export const projectCategories = ['All', 'Web Development', 'Creative & Digital Media']

export const projects = [
  {
    slug: 'flikbi-media',
    title: 'FLiKBi MEDIA',
    category: 'Creative & Digital Media',
    featured: true,
    isSample: false,
    summary:
      'Flyers, event posters, and social graphics I’ve created for organisations and small businesses.',
    image: '/creative-media/flikbi-design-services.jpg',
    imageAlt: 'FLiKBi MEDIA flyer advertising graphic design services',
    gallery: creativeMedia.map((artwork) => ({ src: artwork.imageUrl, alt: artwork.altText, title: artwork.title })),
    tags: ['Flyer design', 'Event graphics', 'Promotional design', 'Social media graphics'],
    problem: '',
    objectives: [],
    solution: 'My design work ranges from event promotion and business services to fashion, student initiatives, and personal branding.',
    process: [],
    features: [
      'Event and campaign posters',
      'Promotional flyers for services and businesses',
      'Social media and profile graphics',
    ],
    challenges: '',
    liveUrl: '',
    sourceUrl: '',
    related: ['freshcrate'],
  },
  {
    slug: 'freshcrate',
    title: 'FreshCrate',
    category: 'Web Development',
    featured: true,
    isSample: false,
    summary:
      'A web application project using Supabase and PostgreSQL for its cloud database.',
    image: '/placeholders/project-2.svg',
    gallery: ['/placeholders/project-2.svg'],
    tags: ['Web Application', 'Supabase', 'PostgreSQL'],
    problem: '',
    objectives: [],
    solution: 'I used Supabase and PostgreSQL to manage the application’s cloud data.',
    process: [],
    features: ['Cloud-backed data management using Supabase and PostgreSQL.'],
    challenges: '',
    liveUrl: '',
    sourceUrl: '',
    related: ['flikbi-media'],
  },
]
