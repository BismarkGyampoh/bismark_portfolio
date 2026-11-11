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
      'A selection of flyer, event, promotional, and social graphic designs created for organisations and small businesses.',
    image: '/creative-media/flikbi-design-services.jpg',
    imageAlt: 'FLiKBi MEDIA flyer advertising graphic design services',
    gallery: creativeMedia.map((artwork) => ({ src: artwork.imageUrl, alt: artwork.altText, title: artwork.title })),
    tags: ['Flyer design', 'Event graphics', 'Promotional design', 'Social media graphics'],
    problem: '',
    objectives: [],
    solution: 'A collection of visual work across event promotion, business services, fashion, student initiatives, and personal branding.',
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
      'A cloud-backed web application project using Supabase and PostgreSQL for backend data management.',
    image: '/placeholders/project-2.svg',
    gallery: ['/placeholders/project-2.svg'],
    tags: ['Web Application', 'Supabase', 'PostgreSQL'],
    problem: '',
    objectives: [],
    solution: 'The web application uses Supabase and PostgreSQL for cloud-backed data management.',
    process: [],
    features: ['Cloud-backed data management using Supabase and PostgreSQL.'],
    challenges: '',
    liveUrl: '',
    sourceUrl: '',
    related: ['flikbi-media'],
  },
]
