UPDATE "SiteProfile"
SET
    "headline" = 'Web developer · IT support · Graphic and media design',
    "introduction" = 'I build websites, support the technology people rely on, and create visual designs through FLiKBi MEDIA. My work also includes databases and networking.',
    "aboutShort" = 'I enjoy working where technology meets everyday needs. I build and support digital tools, work with databases and networks, and help people solve practical IT problems. Through FLiKBi MEDIA, I also create branding and promotional designs.',
    "aboutLong" = $copy$Most of my work sits somewhere between web development and hands-on IT support. I build websites, work with relational and document databases, and troubleshoot networks, hardware, and software.
At FLiKBi MEDIA, I create branding, flyers, and other visual work. I also take on web development and technical support projects.
I supported the ICT Secretariat at the University of Mines and Technology, helping staff with technical issues and maintaining equipment and network infrastructure.$copy$,
    "philosophy" = 'I like making technology easier to use—whether that means fixing a problem, improving a system, or building something new.',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 'default'
  AND "headline" = 'Web Developer · IT Support Engineer · Graphic & Media Designer'
  AND "introduction" = 'Solutions-focused Information Systems and Technology specialist working across web development, database management, network infrastructure, enterprise technical support, and digital design.'
  AND "aboutShort" = 'I build and support digital solutions, work with relational and document databases, and help people resolve technology issues. Through FLiKBi MEDIA, I focus on creative and digital media, including branding and design.'
  AND "aboutLong" = $old$My work spans responsive web applications, database management, network infrastructure, and hands-on hardware and software support.
Through FLiKBi MEDIA, I lead creative and digital media work, including branding and promotional materials. I also take on web development and technical support work.
I have also supported the ICT Secretariat at the University of Mines and Technology, assisting campus staff and maintaining technical equipment and network infrastructure.$old$
  AND "philosophy" = 'My work combines practical technical support, clear communication, and useful digital experiences.';

UPDATE "Project"
SET
    "shortDescription" = 'Flyers, event posters, and social graphics I’ve created for organisations and small businesses.',
    "description" = 'My design work ranges from event promotion and business services to fashion, student initiatives, and personal branding.',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'flikbi-media'
  AND "shortDescription" = 'A selection of flyer, event, promotional, and social graphic designs created for organisations and small businesses.'
  AND "description" = 'A collection of visual work across event promotion, business services, fashion, student initiatives, and personal branding.';

UPDATE "Project"
SET
    "shortDescription" = 'A web application project using Supabase and PostgreSQL for its cloud database.',
    "description" = 'I used Supabase and PostgreSQL to manage the application’s cloud data.',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'freshcrate'
  AND "shortDescription" = 'A cloud-backed web application project using Supabase and PostgreSQL for backend data management.'
  AND "description" = 'The web application uses Supabase and PostgreSQL for cloud-backed data management.';

UPDATE "Experience"
SET
    "description" = $copy$I run FLiKBi MEDIA, where I create graphic designs and branding. I also take on web development, IT support, and database work for freelance clients.
• I build web interfaces with HTML, CSS, JavaScript, and PHP, and deploy projects on Vercel.
• I help people troubleshoot operating systems, network connections, and software setup.
• I create branding, UI/UX designs, promotional flyers, and corporate media with Figma, Photoshop, and Illustrator.
• I work with relational and document databases for web projects.$copy$,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "company" = 'FLiKBi MEDIA'
  AND "position" = 'Founder & Lead Developer / Designer'
  AND "description" = $old$Lead creative and digital media work, including graphic design and branding, while also providing web development, technical support, and database services for freelance projects.
• Develop web interfaces using HTML, CSS, JavaScript, and PHP, with deployments on Vercel.
• Provide Tier 1 and Tier 2 support for operating systems, network connectivity, and software configuration.
• Create branding, UI/UX designs, promotional flyers, and corporate media using Figma, Photoshop, and Illustrator.
• Manage document and relational databases for web projects.$old$;

UPDATE "Experience"
SET
    "description" = $copy$At UMaT’s ICT Secretariat, I helped staff with day-to-day technical issues and supported equipment maintenance and network work.
• Checked campus hardware, replaced multimedia equipment, and serviced examination printers.
• Helped configure VLANs and terminate T568B RJ-45 cables in the main server room.
• Provided first-line helpdesk support to faculty and administrative staff.
• Helped with academic computing work and campus developer events.$copy$,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "company" = 'University of Mines and Technology (UMaT)'
  AND "position" = 'Technical & IT Support Assistant / Intern'
  AND "description" = $old$Supported campus ICT operations, equipment maintenance, enterprise networking, and faculty and staff helpdesk requests.
• Audited campus hardware, replaced multimedia equipment, and serviced examination printers.
• Assisted with VLAN provisioning and T568B RJ-45 network cable terminations in the main server room.
• Provided front-line technical helpdesk support to university faculty and administrative staff.
• Supported academic computing initiatives and campus developer events.$old$;

UPDATE "Education"
SET
    "description" = 'Information Systems and Technology, Department of Cyber Security and Information Systems, Faculty of Computing and Mathematical Sciences.',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "institution" = 'University of Mines and Technology (UMaT)'
  AND "qualification" = 'BSc. Information Systems and Technology'
  AND "description" = 'Department of Cyber Security and Information Systems, Faculty of Computing and Mathematical Sciences.';
