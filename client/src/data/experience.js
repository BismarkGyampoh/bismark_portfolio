export const education = [
  {
    type: 'Education',
    organization: 'University of Mines and Technology (UMaT) · Tarkwa, Ghana',
    title: 'BSc. Information Systems and Technology',
    dates: '',
    description:
      'Information Systems and Technology, Department of Cyber Security and Information Systems, Faculty of Computing and Mathematical Sciences.',
    achievements: [],
  },
  {
    type: 'Education',
    organization: 'Ghana Secondary Technical School (GSTS) · Takoradi, Ghana',
    title: 'West African Senior School Certificate Examination (WASSCE)',
    dates: '2022 – 2024',
    description: '',
    achievements: [],
  },
]

export const experience = [
  {
    type: 'Founder & Lead Developer / Designer',
    organization: 'FLiKBi MEDIA · Freelance',
    title: 'Founder & Lead Developer / Designer',
    dates: '2025 – Present',
    description:
      'I run FLiKBi MEDIA, where I create graphic designs and branding. I also take on web development, IT support, and database work for freelance clients.',
    achievements: [
      'I build web interfaces with HTML, CSS, JavaScript, and PHP, and deploy projects on Vercel.',
      'I help people troubleshoot operating systems, network connections, and software setup.',
      'I create branding, UI/UX designs, promotional flyers, and corporate media with Figma, Photoshop, and Illustrator.',
      'I work with relational and document databases for web projects.',
    ],
  },
  {
    type: 'Technical & IT Support Assistant / Intern',
    organization: 'University of Mines and Technology (UMaT) · ICT Secretariat · Tarkwa, Ghana',
    title: 'Technical & IT Support Assistant / Intern',
    dates: '2026',
    description:
      'At UMaT’s ICT Secretariat, I helped staff with day-to-day technical issues and supported equipment maintenance and network work.',
    achievements: [
      'Checked campus hardware, replaced multimedia equipment, and serviced examination printers.',
      'Helped configure VLANs and terminate T568B RJ-45 cables in the main server room.',
      'Provided first-line helpdesk support to faculty and administrative staff.',
      'Helped with academic computing work and campus developer events.',
    ],
  },
]

export const certifications = [
  {
    type: 'Professional development',
    organization: 'Coursera / Government of Ghana Initiative',
    title: 'Project Management Training',
    dates: 'In progress',
    description: '',
    achievements: [],
  },
  {
    type: 'Membership',
    organization: 'Google AI & Workspace',
    title: 'Google AI & Workspace Member',
    dates: '',
    description: 'Certified Google AI Plan Participant.',
    achievements: [],
  },
  {
    type: 'Professional affiliation',
    organization: 'UMaT Today News Media',
    title: 'Graphic Designing',
    dates: '',
    description: '',
    achievements: [],
  },
]

export function getTimeline() {
  return [...experience, ...education, ...certifications]
}
