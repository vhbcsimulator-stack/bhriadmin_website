// Default content for the Careers page. Used as fallback when nothing has
// been saved from the admin editor, and to fill in any newly added fields.
export const careerContentData = {
  hero: {
    tag: 'Careers',
    title: 'Exciting Career Opportunity Awaits!',
    text: 'Build a rewarding career with a dynamic real estate company where your skills, ideas, and ambition can help shape communities and create lasting opportunities.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80'
  },
  benefits: {
    label: 'Employee Wellbeing',
    title: 'Invested In Your Wellbeing',
    subtitle: 'Our benefits go beyond the standard. We aim to support your physical, mental, and professional growth.',
    items: [
      {
        icon: 'health_and_safety',
        title: 'Health & Wellness Coverage',
        text: 'Comprehensive HMO coverage for you and your dependents, plus wellness programs to keep you at your best.'
      },
      {
        icon: 'payments',
        title: 'Competitive Compensation',
        text: 'Salary packages benchmarked against the industry, with performance bonuses and sales incentives.'
      },
      {
        icon: 'school',
        title: 'Continuous Learning',
        text: 'Access to trainings, seminars, and mentorship programs to help you grow your real estate expertise.'
      },
      {
        icon: 'balance',
        title: 'Work-Life Balance',
        text: 'Flexible schedules and generous leave credits so you can recharge and take care of what matters most.'
      },
      {
        icon: 'diversity_3',
        title: 'Team Culture',
        text: 'A collaborative, family-oriented workplace that celebrates milestones and supports one another.'
      },
      {
        icon: 'trending_up',
        title: 'Career Advancement',
        text: 'Clear growth paths and internal promotion opportunities as our leisure communities continue to expand.'
      }
    ]
  },
  roles: {
    label: 'Join Our Team',
    title: 'Open Roles',
    subtitle: 'Find your next challenge within our growing teams.',
    items: [
      {
        id: 'role-1',
        title: 'Property Sales Executive',
        location: 'Indang, Cavite',
        jobType: 'Full-time',
        jobCategory: 'Sales',
        description: 'Guide prospective buyers through our leisure community offerings, from site visits to closing the sale.',
        overview: 'As a Property Sales Executive, you will be the primary point of contact for prospective buyers exploring our leisure communities. You will manage the full sales journey — from initial inquiry and site visits, through proposal and reservation, to a successful closing — while representing the Bright Hermosa brand with professionalism and care.',
        responsibilities: [
          'Handle inbound leads and walk-in inquiries, qualifying prospects and scheduling site visits.',
          'Present property features, pricing, and payment terms clearly and accurately to clients.',
          'Guide buyers through reservation, documentation, and closing processes.',
          'Maintain accurate records of client interactions and sales pipeline in the CRM.',
          'Meet or exceed monthly and quarterly sales targets.'
        ],
        qualifications: [
          'At least 1-2 years of experience in real estate sales or a related field.',
          'Excellent communication and interpersonal skills.',
          'Comfortable with weekend site visits and client meetings.',
          "Valid driver's license is a plus.",
          'Licensed real estate salesperson (PRC) preferred but not required.'
        ]
      },
      {
        id: 'role-2',
        title: 'Marketing & Digital Content Specialist',
        location: 'Indang, Cavite',
        jobType: 'Full-time',
        jobCategory: 'Marketing',
        description: 'Create campaigns and content across digital channels that showcase our properties and grow our brand.',
        overview: 'We are looking for a creative Marketing & Digital Content Specialist to plan and execute campaigns that showcase our leisure communities across digital and social channels, helping grow brand awareness and generate qualified leads for our sales team.',
        responsibilities: [
          'Plan and produce content for social media, website, and email campaigns.',
          'Coordinate photo and video shoots at property sites and events.',
          'Manage paid social and search campaigns in coordination with agency partners.',
          'Track campaign performance and report on key marketing metrics.',
          'Collaborate with the sales team to align messaging with lead generation goals.'
        ],
        qualifications: [
          '2+ years of experience in digital marketing or content creation.',
          'Working knowledge of social media platforms, Canva, and basic video editing.',
          'Strong writing and visual storytelling skills.',
          'Real estate or property marketing experience is a plus.'
        ]
      },
      {
        id: 'role-3',
        title: 'Site Engineer',
        location: 'Nasugbu, Batangas',
        jobType: 'Full-time',
        jobCategory: 'Engineering',
        description: 'Oversee on-site development works, ensuring quality and timelines are met across active projects.',
        overview: 'The Site Engineer will oversee day-to-day construction and development activities at our project sites, ensuring works are completed safely, on schedule, and to the quality standards expected of Bright Hermosa communities.',
        responsibilities: [
          'Supervise on-site contractors and monitor construction progress against project plans.',
          'Conduct regular quality and safety inspections.',
          'Coordinate with project management, architects, and suppliers on site requirements.',
          'Prepare progress reports and flag risks or delays early.',
          'Ensure compliance with local building codes and permits.'
        ],
        qualifications: [
          'Bachelor’s degree in Civil Engineering or related field.',
          'At least 2 years of site engineering or construction supervision experience.',
          'Willing to be based on-site in Nasugbu, Batangas.',
          'Knowledge of local construction regulations and permitting.'
        ]
      },
      {
        id: 'role-4',
        title: 'Customer Relations Officer',
        location: 'Indang, Cavite',
        jobType: 'Full-time',
        jobCategory: 'Customer Service',
        description: 'Serve as the main point of contact for buyers and residents, handling inquiries and after-sales support.',
        overview: 'The Customer Relations Officer supports buyers and residents throughout their journey with Bright Hermosa Realty, from post-sale onboarding to ongoing community concerns, ensuring every interaction reflects our commitment to service.',
        responsibilities: [
          'Respond to buyer and resident inquiries via phone, email, and in person.',
          'Coordinate with internal teams to resolve after-sales concerns and requests.',
          'Maintain accurate customer records and follow-up schedules.',
          'Support community events and resident communications.',
          'Escalate and track unresolved issues until closure.'
        ],
        qualifications: [
          'At least 1 year of experience in customer service, preferably in real estate or hospitality.',
          'Strong verbal and written communication skills.',
          'Patient, organized, and detail-oriented.',
          'Comfortable using CRM and basic office software.'
        ]
      }
    ]
  }
};
