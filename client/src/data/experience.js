export const education = [
  {
    type: 'Education',
    organization: 'University of Mines and Technology (UMaT) · Tarkwa, Ghana',
    title: 'BSc. Information Systems and Technology',
    dates: '',
    description:
      'Department of Cyber Security and Information Systems, Faculty of Computing and Mathematical Sciences.',
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
      'Lead creative and digital media work, including graphic design and branding, while also providing web development, technical support, and database services for freelance projects.',
    achievements: [
      'Develop web interfaces using HTML, CSS, JavaScript, and PHP, with deployments on Vercel.',
      'Provide Tier 1 and Tier 2 support for operating systems, network connectivity, and software configuration.',
      'Create branding, UI/UX designs, promotional flyers, and corporate media using Figma, Photoshop, and Illustrator.',
      'Manage document and relational databases for web projects.',
    ],
  },
  {
    type: 'Technical & IT Support Assistant / Intern',
    organization: 'University of Mines and Technology (UMaT) · ICT Secretariat · Tarkwa, Ghana',
    title: 'Technical & IT Support Assistant / Intern',
    dates: '2026',
    description:
      'Supported campus ICT operations, equipment maintenance, enterprise networking, and faculty and staff helpdesk requests.',
    achievements: [
      'Audited campus hardware, replaced multimedia equipment, and serviced examination printers.',
      'Assisted with VLAN provisioning and T568B RJ-45 network cable terminations in the main server room.',
      'Provided front-line technical helpdesk support to university faculty and administrative staff.',
      'Supported academic computing initiatives and campus developer events.',
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
