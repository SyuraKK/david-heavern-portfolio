import './portfolio.css';

import type { FormEvent, CSSProperties } from 'react';

import { lazy, Suspense, useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router';

import {
  Card,
  Chip,
  Stack,
  Button,
  TextField,
  IconButton,
  Typography,
  CardContent,
} from '@mui/material';

import { SettingsButton } from 'src/layouts/components/settings-button';

import { Logo } from 'src/components/logo';
import { useSettingsContext } from 'src/components/settings';

const summary =
  'Software engineering professional with deep expertise in developing robust, scalable applications. Strong focus on team collaboration, driving projects to successful completion, and adapting to evolving requirements. Proficient in multiple programming languages, frameworks, and tools. Values delivering high-quality results and fostering a productive work environment.';

const experience = [
  {
    period: 'Apr 2020 — Present',
    company: 'Google',
    location: 'Atlanta, Georgia',
    role: 'Senior Software Engineer',
    details: [
      'Designed scalable Java services and Python automation for high-volume technology platforms, applying algorithms and distributed-system patterns while advancing ownership from implementation to technical leadership.',
      'Led backend architecture for reliable services using Java, Python, REST APIs, and Kubernetes, improving scalability and operational consistency across large technology workloads and cross-functional product teams.',
      'Applied data structures, algorithm optimization, concurrency, and performance profiling to reduce processing overhead and improve response times for distributed services supporting high-scale technology products.',
      'Directed project planning across engineering teams by defining milestones, dependencies, technical risks, and delivery metrics, strengthening Agile execution and improving predictability for complex technology initiatives.',
      'Built automated testing and CI/CD workflows around Java and Python services, increasing release confidence while establishing repeatable engineering practices for reliable deployment and long-term platform maintenance.',
      'Developed cloud-native systems across AWS and Azure using Kubernetes, Docker, and infrastructure automation, supporting resilient technology services while expanding responsibilities across architecture and delivery.',
      'Mentored engineers on algorithms, system design, Java development, Python automation, and production debugging, raising technical standards while supporting career growth across software engineering teams.',
      'Partnered with product and engineering stakeholders to translate complex requirements into maintainable architectures, balancing project scope, technical debt, reliability, and delivery timelines across technology programs.',
    ],
    tags: ['Java', 'Python', 'REST APIs', 'Kubernetes', 'AWS', 'Azure', 'CI/CD'],
  },
  {
    period: 'Mar 2019 — Mar 2020',
    company: 'Dropbox',
    location: 'Austin, Texas',
    role: 'Software Engineer',
    details: [
      'Developed Java backend services and Python automation for cloud file-management workflows, applying algorithms and service-oriented design to improve reliability and scalability across technology products.',
      'Implemented REST APIs and distributed services with Java, SQL, Docker, and cloud infrastructure, strengthening backend capabilities while expanding ownership of production systems and technical delivery.',
      'Optimized data structures, algorithms, and concurrency paths in high-throughput services, reducing processing overhead and improving responsiveness for technology workloads with demanding scale requirements.',
      'Coordinated Agile project execution across engineering and product teams by managing technical dependencies, milestones, risks, and implementation plans for customer-facing technology initiatives.',
      'Built CI/CD automation and production monitoring for backend services, improving deployment consistency and operational visibility while progressing from individual development toward broader technical ownership.',
    ],
    tags: ['Java', 'Python', 'SQL', 'REST APIs', 'Docker', 'CI/CD'],
  },
  {
    period: 'Jul 2017 — Mar 2019',
    company: 'Duolingo',
    location: 'Pittsburgh, Pennsylvania',
    role: 'Software Engineer',
    details: [
      'Built Java and Python services supporting education technology workflows, applying algorithms, REST APIs, and modular architecture to improve scalability and maintainability across learner-facing systems.',
      'Developed backend components and APIs using Java, Python, SQL, and service-oriented patterns, strengthening production reliability while expanding responsibility for architecture and feature delivery.',
      'Implemented algorithmic improvements for data processing and application workflows, using profiling and structured performance analysis to improve efficiency across education technology services and pipelines.',
      'Collaborated with product and engineering stakeholders to break complex requirements into deliverable milestones, strengthening Agile project management and improving coordination across software initiatives.',
      'Created automated tests and CI/CD workflows for backend services, increasing release confidence and supporting dependable delivery practices across rapidly evolving education technology applications.',
      'Improved service reliability through logging, monitoring, fault analysis, and production debugging, building stronger operational practices while developing broader ownership of distributed software systems.',
      'Mentored peers on Java development, Python scripting, algorithms, testing, and maintainable design, contributing to technical growth while progressing toward senior-level engineering responsibilities.',
    ],
    tags: ['Java', 'Python', 'SQL', 'REST APIs', 'CI/CD'],
  },
  {
    period: 'May 2016 — Jul 2017',
    company: 'Boeing',
    location: 'Charleston, South Carolina',
    role: 'Software Engineer',
    details: [
      'Developed Java software components for aerospace engineering workflows, applying object-oriented design, algorithms, and structured testing practices while building a foundation in production software engineering.',
      'Implemented Python automation for engineering data processing and validation, reducing repetitive manual workflows and improving consistency across aerospace technology development and analysis activities.',
      'Designed modular backend functionality using Java, SQL, and service-oriented patterns, improving maintainability while gaining experience with production requirements, technical documentation, and system integration.',
      'Applied data structures and algorithmic techniques to improve processing workflows, balancing computational efficiency, correctness, and maintainability within software supporting aerospace engineering programs.',
      'Supported project planning through task estimation, dependency tracking, technical documentation, and Agile coordination, developing stronger delivery discipline while progressing toward broader engineering ownership.',
      'Built automated validation and testing workflows for Java-based systems, improving defect detection and release quality while developing disciplined engineering practices for safety-conscious aerospace technology.',
    ],
    tags: ['Java', 'Python', 'SQL', 'Algorithms', 'Testing'],
  },
];

const skillGroups = [
  {
    number: '01',
    title: 'Languages',
    description: 'Programming languages and query language listed in my experience.',
    skills: ['Java', 'Python', 'Go', 'JavaScript', 'TypeScript', 'SQL'],
  },
  {
    number: '02',
    title: 'Algorithms & Engineering',
    description: 'Core computer science and software engineering disciplines.',
    skills: [
      'Algorithms',
      'Data structures',
      'Object-oriented design',
      'System design',
      'Distributed systems',
      'Concurrency',
      'Performance optimization',
    ],
  },
  {
    number: '03',
    title: 'Backend & APIs',
    description: 'Backend frameworks, interfaces, and service architecture.',
    skills: [
      'REST APIs',
      'Microservices',
      'Spring',
      'Node.js',
      'API design',
      'Service architecture',
    ],
  },
  {
    number: '04',
    title: 'Cloud & Infrastructure',
    description: 'Cloud platforms, containers, and infrastructure tooling.',
    skills: ['AWS', 'Azure', 'Kubernetes', 'Docker', 'Terraform', 'Cloud architecture'],
  },
  {
    number: '05',
    title: 'Delivery & Management',
    description: 'Planning and leadership practices for collaborative delivery.',
    skills: [
      'Project management',
      'Agile',
      'Scrum',
      'Technical leadership',
      'CI/CD',
      'DevOps',
      'Technical planning',
    ],
  },
];

const education = [
  {
    degree: 'MS Computer Science',
    school: 'The University of Texas at Austin',
    location: 'Austin, Texas',
    year: 'Jun 2021',
    mark: `${import.meta.env.BASE_URL}assets/images/education/ut-austin-mark.svg`,
  },
  {
    degree: 'BS Computer Science',
    school: 'Georgia Institute of Technology',
    location: 'Atlanta, Georgia',
    year: 'May 2017',
    mark: `${import.meta.env.BASE_URL}assets/images/education/georgia-tech-mark.svg`,
  },
];

const projectContributions = [
  {
    id: 'finance-01',
    sector: 'Financial services',
    number: '01',
    kind: 'finance-transactions',
    slug: 'real-time-transaction-monitoring',
    title: 'Real-time transaction monitoring',
    description:
      'Illustrative concept: a live view of payment events that helps operations teams spot unusual activity and follow transaction status.',
    stack: ['Java', 'Spring', 'SQL', 'REST APIs', 'Kubernetes'],
  },
  {
    id: 'finance-02',
    sector: 'Financial services',
    number: '02',
    kind: 'finance-payments',
    slug: 'digital-payments-services',
    title: 'Digital payments services',
    description:
      'Illustrative concept: reliable APIs for processing payment events and keeping transaction status in sync.',
    stack: ['Java', 'Spring', 'SQL', 'REST APIs', 'AWS'],
  },
  {
    id: 'finance-03',
    sector: 'Financial services',
    number: '03',
    kind: 'finance-risk',
    slug: 'risk-insights-dashboard',
    title: 'Risk insights dashboard',
    description:
      'Illustrative concept: a reporting workspace that helps teams review financial signals and investigate exceptions.',
    stack: ['Python', 'SQL', 'TypeScript', 'REST APIs', 'AWS'],
  },
  {
    id: 'healthcare-01',
    sector: 'Healthcare',
    number: '04',
    kind: 'healthcare-care',
    slug: 'care-coordination-portal',
    title: 'Care coordination portal',
    description:
      'Illustrative concept: a shared view of care plans and visit updates for patients and their care teams.',
    stack: ['Java', 'Python', 'SQL', 'REST APIs', 'Azure'],
  },
  {
    id: 'healthcare-02',
    sector: 'Healthcare',
    number: '05',
    kind: 'healthcare-records',
    slug: 'clinical-data-exchange',
    title: 'Clinical data exchange',
    description:
      'Illustrative concept: services that organize clinical records for dependable exchange between care systems.',
    stack: ['Java', 'Python', 'Microservices', 'SQL', 'Kubernetes'],
  },
] as const;

const contactAddress = '95 Flora Ave NE # B, Atlanta, GA 30307';
const contactMapSearch = '95 Flora Ave NE, Atlanta, GA 30307';
const mapDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactAddress)}`;
const ContactMap = lazy(() => import('./contact-map'));

const sections = [
  { label: 'Overview', path: 'overview' },
  { label: 'Experience & Education', path: 'experience' },
  { label: 'Skills & Projects', path: 'expertise' },
];

const pageHero = {
  experience: {
    artwork: 'experience',
    kicker: 'CAREER HISTORY',
    title: 'Engineering experience across industries.',
    description:
      'Software engineering across technology platforms, cloud file-management, education technology, and aerospace engineering.',
    facts: [
      'Google · Apr 2020–Present',
      'Dropbox · Mar 2019–Mar 2020',
      'Duolingo · Jul 2017–Mar 2019',
      'Boeing · May 2016–Jul 2017',
    ],
  },
  expertise: {
    artwork: 'expertise',
    kicker: 'SKILLS & PROJECTS',
    title: 'Engineering skills across the stack.',
    description:
      'Languages, engineering fundamentals, backend and API design, cloud infrastructure, and delivery practices.',
    facts: [
      'Languages',
      'Algorithms & engineering',
      'Backend, APIs & cloud',
      'Delivery & management',
    ],
  },
} as const;

function PageHeroArtwork({ kind }: { kind: 'experience' | 'expertise' | 'education' }) {
  return (
    <div className={`page-hero-art page-hero-art--${kind}`} aria-hidden="true">
      {kind === 'experience' && (
        <svg viewBox="0 0 520 360" fill="none">
          <defs>
            <linearGradient id="career-line" x1="80" y1="280" x2="430" y2="65">
              <stop stopColor="#66E3DC" />
              <stop offset="1" stopColor="#B07BFF" />
            </linearGradient>
          </defs>
          <circle
            className="art-orbit"
            cx="260"
            cy="180"
            r="137"
            stroke="#D9E9FF"
            strokeOpacity=".14"
          />
          <circle cx="260" cy="180" r="99" stroke="#D9E9FF" strokeOpacity=".08" />
          <path
            d="M101 261 192 208l72 20 73-91 91-43"
            stroke="url(#career-line)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m405 94 23-8-1 24"
            stroke="#B07BFF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle className="art-pulse" cx="101" cy="261" r="9" fill="#66E3DC" />
          <circle className="art-pulse art-pulse--delay" cx="192" cy="208" r="8" fill="#66E3DC" />
          <circle className="art-pulse art-pulse--delay-2" cx="264" cy="228" r="8" fill="#7CCFE9" />
          <circle className="art-pulse art-pulse--delay-3" cx="337" cy="137" r="8" fill="#A39AEF" />
          <circle className="art-pulse art-pulse--delay-4" cx="428" cy="94" r="9" fill="#B07BFF" />
          <rect
            x="66"
            y="64"
            width="122"
            height="42"
            rx="13"
            fill="#fff"
            fillOpacity=".07"
            stroke="#fff"
            strokeOpacity=".12"
          />
          <path
            d="M83 85h16m8 0h63"
            stroke="#D9E9FF"
            strokeOpacity=".68"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <rect
            x="332"
            y="267"
            width="122"
            height="42"
            rx="13"
            fill="#fff"
            fillOpacity=".07"
            stroke="#fff"
            strokeOpacity=".12"
          />
          <path
            d="M350 288h16m8 0h62"
            stroke="#D9E9FF"
            strokeOpacity=".48"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      )}
      {kind === 'expertise' && (
        <svg viewBox="0 0 520 360" fill="none">
          <defs>
            <linearGradient id="skills-line" x1="98" y1="295" x2="425" y2="60">
              <stop stopColor="#66E3DC" />
              <stop offset="1" stopColor="#B07BFF" />
            </linearGradient>
          </defs>
          <path
            d="M260 180 138 95m122 85 151-85M260 180l-122 91m122-91 151 91M138 95v176m273-176v176"
            stroke="url(#skills-line)"
            strokeOpacity=".62"
            strokeWidth="2"
          />
          <circle
            cx="260"
            cy="180"
            r="65"
            fill="#66E3DC"
            fillOpacity=".11"
            stroke="#66E3DC"
            strokeOpacity=".6"
          />
          <circle
            className="art-orbit"
            cx="260"
            cy="180"
            r="112"
            stroke="#D9E9FF"
            strokeOpacity=".12"
          />
          <rect
            x="221"
            y="150"
            width="78"
            height="60"
            rx="17"
            fill="#15243A"
            stroke="#66E3DC"
            strokeOpacity=".66"
          />
          <path
            d="m245 173-10 7 10 7m30-14 10 7-10 7m-8-17-8 20"
            stroke="#B7FFF6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            className="art-pulse"
            cx="138"
            cy="95"
            r="25"
            fill="#18243B"
            stroke="#66E3DC"
            strokeOpacity=".7"
          />
          <circle
            className="art-pulse art-pulse--delay"
            cx="411"
            cy="95"
            r="25"
            fill="#18243B"
            stroke="#B07BFF"
            strokeOpacity=".75"
          />
          <circle
            className="art-pulse art-pulse--delay-2"
            cx="138"
            cy="271"
            r="25"
            fill="#18243B"
            stroke="#7CCFE9"
            strokeOpacity=".75"
          />
          <circle
            className="art-pulse art-pulse--delay-3"
            cx="411"
            cy="271"
            r="25"
            fill="#18243B"
            stroke="#B07BFF"
            strokeOpacity=".75"
          />
          <path
            d="M128 95h20m-10-10v20m263-10h20m-10-10v20M128 271h20m-10-10v20m263-10h20m-10-10v20"
            stroke="#E8FFFF"
            strokeOpacity=".82"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
      {kind === 'education' && (
        <svg viewBox="0 0 520 360" fill="none">
          <defs>
            <linearGradient id="education-glow" x1="127" y1="284" x2="400" y2="80">
              <stop stopColor="#66E3DC" />
              <stop offset="1" stopColor="#B07BFF" />
            </linearGradient>
          </defs>
          <circle
            className="art-orbit"
            cx="260"
            cy="180"
            r="138"
            stroke="#D9E9FF"
            strokeOpacity=".13"
          />
          <path
            d="m260 77 155 69-155 71-155-71 155-69Z"
            fill="url(#education-glow)"
            fillOpacity=".21"
            stroke="url(#education-glow)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="m160 191 100 47 100-47v58l-100 47-100-47v-58Z"
            fill="#16243A"
            stroke="#D9E9FF"
            strokeOpacity=".24"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M200 211v30m120-30v30M260 217v78"
            stroke="url(#education-glow)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M414 146v90c0 16 13 25 27 25v-94"
            stroke="#B07BFF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="441" cy="261" r="6" fill="#B07BFF" />
          <path
            d="M218 146h84m-42-39v78"
            stroke="#E8FFFF"
            strokeOpacity=".7"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle className="art-pulse" cx="115" cy="125" r="7" fill="#66E3DC" />
          <circle className="art-pulse art-pulse--delay-2" cx="393" cy="96" r="6" fill="#B07BFF" />
          <circle className="art-pulse art-pulse--delay-3" cx="132" cy="278" r="6" fill="#7CCFE9" />
        </svg>
      )}
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {isOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  );
}

function IndustryIllustration({
  kind,
}: {
  kind:
    | 'finance-transactions'
    | 'finance-payments'
    | 'finance-risk'
    | 'healthcare-care'
    | 'healthcare-records';
}) {
  const descriptions = {
    'finance-transactions': 'A retail payment terminal processing a customer transaction',
    'finance-payments': 'A customer making a contactless payment at a counter',
    'finance-risk': 'Financial analytics displayed on a laptop dashboard',
    'healthcare-care': 'A clinician reviewing information on a mobile phone',
    'healthcare-records': 'A stethoscope beside a laptop used for healthcare work',
  } satisfies Record<typeof kind, string>;

  return (
    <img
      src={`${import.meta.env.BASE_URL}assets/images/projects/${kind}.jpg`}
      alt={descriptions[kind]}
      loading="lazy"
      decoding="async"
    />
  );
}

export default function Page() {
  const { pathname, hash } = useLocation();
  const [searchParams] = useSearchParams();
  const lastSegment = pathname.split('/').filter(Boolean).pop();
  const isProjectPage = pathname.startsWith('/dashboard/projects/');
  const selectedProject = isProjectPage
    ? projectContributions.find((item) => item.slug === lastSegment)
    : undefined;
  const currentPage = isProjectPage
    ? 'project'
    : ((['overview', 'experience', 'expertise', 'contact'] as const).find(
        (page) => page === lastSegment
      ) ?? 'overview');
  const pageTitle =
    currentPage === 'expertise'
      ? 'Skills & Projects'
      : currentPage === 'project'
        ? (selectedProject?.title ?? 'Project')
        : currentPage === 'experience'
          ? 'Experience & Education'
          : `${currentPage[0].toUpperCase()}${currentPage.slice(1)}`;
  const settings = useSettingsContext();
  const isDark = settings.state.mode === 'dark';
  const [activeCompany, setActiveCompany] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [formNotice, setFormNotice] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const companyFilter = searchParams.get('company');

  useEffect(() => {
    document.title = `${pageTitle} | David Heavern`;
  }, [pageTitle]);

  useEffect(() => {
    if (pathname === '/dashboard/experience' && hash === '#education') {
      document.getElementById('education')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash, pathname]);

  useEffect(() => {
    setActiveCompany(experience.find((item) => item.company === companyFilter)?.company ?? 'All');
  }, [companyFilter]);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      [
        '.page-hero-copy',
        '.page-hero-art',
        '.hero-copy',
        '.hero-card',
        '.career-overview-heading',
        '.career-overview-item',
        '.experience-heading',
        '.experience-filter',
        '.experience-card',
        '.expertise-section > .section-heading',
        '.organization-chart-root',
        '.expertise-card',
        '.industry-projects > .section-heading',
        '.industry-project-card',
        '.education-section > .section-heading',
        '.education-card',
        '.contact-banner-content',
        '.contact-map-card',
        '.contact-form-card',
      ].join(', ')
    );

    let observer: IntersectionObserver | null = null;

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
      );

      elements.forEach((element, index) => {
        element.style.setProperty('--scroll-reveal-delay', `${Math.min(index % 5, 4) * 130}ms`);
        element.classList.add('scroll-reveal');
        observer?.observe(element);
      });
    }

    return () => {
      observer?.disconnect();
      elements.forEach((element) => {
        element.classList.remove('scroll-reveal', 'is-visible');
        element.style.removeProperty('--scroll-reveal-delay');
      });
    };
  }, [activeCompany, currentPage, selectedProject?.slug]);

  useEffect(() => {
    const updateProgress = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  const visibleExperience =
    activeCompany === 'All'
      ? experience
      : experience.filter((item) => item.company === activeCompany);

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);

    setFormNotice('Your email app should open with your message ready to send.');
    window.location.href = `mailto:davidheavern2@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div
      className={`portfolio${isDark ? ' portfolio--dark' : ' portfolio--light'}`}
      style={
        {
          '--portfolio-contact-hero': `url("${import.meta.env.BASE_URL}assets/images/contact/hero.webp")`,
        } as CSSProperties
      }
    >
      <div
        className="reading-progress"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
        aria-hidden="true"
      />

      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <Logo
          className="site-logo"
          href={`${import.meta.env.BASE_URL}dashboard/overview`}
          isSingle
          aria-label="David Heavern — overview"
        />

        <IconButton
          className="menu-toggle"
          color="inherit"
          size="medium"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <MenuIcon isOpen={menuOpen} />
        </IconButton>

        <nav
          id="site-navigation"
          className={`main-nav${menuOpen ? ' main-nav--open' : ''}`}
          aria-label="Main navigation"
        >
          {sections.map((section) => (
            <Button
              key={section.path}
              component={Link}
              to={`/dashboard/${section.path}`}
              variant={
                currentPage === section.path ||
                (currentPage === 'project' && section.path === 'expertise')
                  ? 'soft'
                  : 'text'
              }
              color={
                currentPage === section.path ||
                (currentPage === 'project' && section.path === 'expertise')
                  ? 'primary'
                  : 'inherit'
              }
              size="medium"
              aria-current={
                currentPage === section.path ||
                (currentPage === 'project' && section.path === 'expertise')
                  ? 'page'
                  : undefined
              }
              onClick={() => setMenuOpen(false)}
            >
              {section.label}
            </Button>
          ))}
          <Button
            component={Link}
            to="/dashboard/contact"
            variant="contained"
            color="primary"
            size="medium"
            endIcon={<ArrowIcon />}
            onClick={() => setMenuOpen(false)}
          >
            Let&apos;s talk
          </Button>
          <SettingsButton
            className="settings-toggle"
            color="inherit"
            size="medium"
            aria-label="Open appearance settings"
            title="Appearance settings"
          />
        </nav>
      </header>

      <main
        id="main-content"
        key={`${currentPage}-${selectedProject?.slug ?? ''}`}
        className="page-shell page-transition"
      >
        {currentPage !== 'overview' && currentPage !== 'contact' && currentPage !== 'project' && (
          <section className="page-hero" aria-labelledby="page-hero-title">
            <div className="page-hero-copy">
              <div className="section-kicker">{pageHero[currentPage].kicker}</div>
              <Typography id="page-hero-title" component="h1" variant="h2">
                {pageHero[currentPage].title}
              </Typography>
              <Typography component="p" variant="body1">
                {pageHero[currentPage].description}
              </Typography>
              <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1}>
                {pageHero[currentPage].facts.map((fact) => (
                  <Chip key={fact} label={fact} variant="outlined" size="small" />
                ))}
              </Stack>
            </div>
            <PageHeroArtwork kind={pageHero[currentPage].artwork} />
          </section>
        )}

        {currentPage === 'overview' && (
          <>
            <section className="hero section-anchor" id="overview">
              <div className="hero-copy">
                <div className="eyebrow">SENIOR FULLSTACK ENGINEER · ATLANTA, GEORGIA</div>
                <h1>
                  Senior Fullstack
                  <br />
                  <span>Engineer.</span>
                </h1>
                <p className="hero-intro">{summary}</p>
                <div className="hero-actions">
                  <Button
                    component={Link}
                    to="/dashboard/contact"
                    variant="contained"
                    color="primary"
                    size="large"
                    endIcon={<ArrowIcon />}
                  >
                    Contact David
                  </Button>
                  <Button
                    component={Link}
                    to="/dashboard/experience"
                    variant="outlined"
                    color="inherit"
                    size="large"
                    endIcon={<ArrowIcon />}
                  >
                    View experience
                  </Button>
                </div>
                <div className="hero-meta">
                  <span>
                    <i className="meta-icon meta-icon--pin" /> Atlanta, Georgia 30307
                  </span>
                  <span>
                    <i className="meta-line" /> Google · Apr 2020–Present
                  </span>
                </div>
              </div>

              <Card className="hero-card" variant="outlined" elevation={0}>
                <blockquote className="hero-quote">Stay hungry, stay foolish</blockquote>
                <CardContent className="hero-card-content">
                  <div className="hero-card-name">David Heavern</div>
                  <div className="hero-card-role">Senior Fullstack Engineer</div>
                  <div className="hero-card-rule" />
                  <div className="hero-card-facts">
                    <div>
                      <span>Currently</span>
                      <strong>Google</strong>
                    </div>
                    <div>
                      <span>Previously</span>
                      <strong>Dropbox · Duolingo · Boeing</strong>
                    </div>
                    <div>
                      <span>Education</span>
                      <strong>UT Austin · Georgia Tech</strong>
                    </div>
                  </div>
                  <a className="hero-card-link" href="mailto:davidheavern2@gmail.com">
                    davidheavern2@gmail.com <ArrowIcon />
                  </a>
                </CardContent>
                <div className="orbit orbit--one" />
                <div className="orbit orbit--two" />
              </Card>
            </section>

            <section className="career-overview" aria-label="Career overview">
              <div className="career-overview-heading">
                <div className="section-kicker">CAREER HISTORY</div>
                <h2>
                  Experience across <span>industries.</span>
                </h2>
              </div>
              <div className="career-overview-list">
                {experience.map((item) => (
                  <Link
                    className="career-overview-item"
                    key={item.company}
                    to={`/dashboard/experience?company=${encodeURIComponent(item.company)}`}
                  >
                    <strong>{item.company}</strong>
                    <span>{item.role}</span>
                    <small>{item.period}</small>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        {currentPage === 'experience' && (
          <section className="content-section experience-section section-anchor" id="experience">
            <div className="section-heading experience-heading">
              <div className="experience-heading-copy">
                <div className="section-kicker">CAREER HISTORY</div>
                <h2>
                  Professional <span>experience.</span>
                </h2>
                <p>
                  Software engineering across technology platforms, cloud file-management, education
                  technology, and aerospace engineering.
                </p>
              </div>
            </div>

            <div
              className="filter-row experience-filter"
              role="group"
              aria-label="Filter work experience"
            >
              {['All', ...experience.map((item) => item.company)].map((company) => (
                <Chip
                  key={company}
                  label={company}
                  color={activeCompany === company ? 'primary' : 'default'}
                  variant={activeCompany === company ? 'filled' : 'outlined'}
                  size="medium"
                  clickable
                  onClick={() => setActiveCompany(company)}
                  aria-pressed={activeCompany === company}
                />
              ))}
            </div>

            <div className="experience-list">
              {visibleExperience.map((job, index) => (
                <article className="experience-card" key={job.company}>
                  <div className="experience-date">{job.period}</div>
                  <div className="experience-timeline" aria-hidden="true">
                    <span className="timeline-dot">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="experience-body">
                    <div className="experience-card-heading">
                      <div>
                        <h3>{job.role}</h3>
                        <div className="job-company">
                          {job.company}
                          <span> / </span>
                          {job.location}
                        </div>
                      </div>
                      <div className="company-monogram" aria-hidden="true">
                        {job.company.slice(0, 1)}
                      </div>
                    </div>
                    <div className="experience-card-footer">
                      <ul className="job-highlights">
                        {job.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                      <div className="tag-list">
                        {job.tags.map((tag) => (
                          <span className="skill-tag" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <section className="education-section" id="education" aria-labelledby="education-title">
              <div className="section-heading">
                <div>
                  <div className="section-kicker">EDUCATION</div>
                  <h2 id="education-title">
                    Academic <span>foundations.</span>
                  </h2>
                </div>
              </div>
              <div className="education-grid">
                {education.map((item) => (
                  <article className="education-card" key={item.school}>
                    <img className="university-mark" src={item.mark} alt="" />
                    <div>
                      <h3>{item.degree}</h3>
                      <p>
                        {item.school} · {item.location}
                      </p>
                    </div>
                    <span className="education-year">{item.year}</span>
                  </article>
                ))}
              </div>
            </section>
          </section>
        )}

        {currentPage === 'expertise' && (
          <section className="content-section expertise-section section-anchor" id="expertise">
            <div className="section-heading">
              <div>
                <div className="section-kicker">SKILLS & PROJECTS</div>
                <h2>
                  Engineering skills
                  <br />
                  <span>across the stack.</span>
                </h2>
                <p>
                  Languages, engineering fundamentals, backend and API design, cloud infrastructure,
                  and delivery practices.
                </p>
              </div>
            </div>

            <section
              className="organization-chart"
              aria-label="Engineering skills organization chart"
            >
              <div className="organization-chart-root">
                <span className="organization-chart-root-mark" aria-hidden="true">
                  DH
                </span>
                <div>
                  <strong>Engineering skills</strong>
                  <span>Core toolkit</span>
                </div>
              </div>
              <div className="expertise-grid">
                {skillGroups.map((group) => (
                  <Card
                    className="expertise-card"
                    key={group.number}
                    variant="outlined"
                    elevation={0}
                  >
                    <CardContent className="expertise-card-content">
                      <div className="expertise-number">{group.number}</div>
                      <h3>{group.title}</h3>
                      <p>{group.description}</p>
                      <div className="tag-list">
                        {group.skills.map((skill) => (
                          <Chip key={skill} label={skill} size="small" variant="outlined" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="industry-projects" aria-labelledby="industry-projects-title">
              <div className="section-heading">
                <div>
                  <div className="section-kicker">PROJECTS</div>
                  <h2 id="industry-projects-title">Projects.</h2>
                  <p>
                    Five illustrative project concepts based on the financial services and
                    healthcare sectors listed. Names, descriptions, and suggested stacks are
                    examples, not verified résumé details; photography is representative stock
                    imagery.
                  </p>
                </div>
              </div>
              <div className="industry-project-grid">
                {projectContributions.map((project) => (
                  <Card
                    className={`industry-project-card industry-project-card--${project.kind}`}
                    key={project.id}
                    variant="outlined"
                  >
                    <div className="industry-project-art">
                      <IndustryIllustration kind={project.kind} />
                      <span className="industry-project-count">{project.number}</span>
                      <span className="industry-project-count-label">CONTRIBUTION</span>
                    </div>
                    <CardContent>
                      <div className="section-kicker">{project.sector}</div>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className="project-stack-label">Illustrative stack</div>
                      <div className="tag-list project-stack">
                        {project.stack.map((technology) => (
                          <Chip
                            key={technology}
                            label={technology}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </div>
                      <Link
                        className="project-page-link"
                        to={`/dashboard/projects/${project.slug}`}
                        aria-label={`Open project page: ${project.title}`}
                      >
                        Open project page <ArrowIcon />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </section>
        )}

        {currentPage === 'project' && selectedProject && (
          <section className="project-detail content-section section-anchor">
            <Link className="project-back-link" to="/dashboard/expertise">
              <ArrowIcon /> Back to Skills & Projects
            </Link>
            <div className="project-detail-grid">
              <div className="project-detail-copy">
                <div className="section-kicker">
                  {selectedProject.sector} · ILLUSTRATIVE CONCEPT
                </div>
                <h1>{selectedProject.title}</h1>
                <p>{selectedProject.description.replace('Illustrative concept: ', '')}</p>
                <p className="project-detail-disclaimer">
                  This is a portfolio concept based on the industry contribution noted in the
                  résumé. The project name, scope, and stack below are illustrative, not confirmed
                  details of client work.
                </p>
                <h2>Suggested technology stack</h2>
                <div className="tag-list project-stack">
                  {selectedProject.stack.map((technology) => (
                    <Chip key={technology} label={technology} size="small" variant="outlined" />
                  ))}
                </div>
                <div className="project-canonical-url">
                  <span>Project page URL</span>
                  <code>{`/dashboard/projects/${selectedProject.slug}`}</code>
                </div>
              </div>
              <div className="project-detail-art">
                <IndustryIllustration kind={selectedProject.kind} />
              </div>
            </div>
          </section>
        )}

        {currentPage === 'project' && !selectedProject && (
          <section className="project-not-found content-section">
            <div className="section-kicker">PROJECT NOT FOUND</div>
            <h1>This project page isn&apos;t available.</h1>
            <Link className="project-back-link" to="/dashboard/expertise">
              <ArrowIcon /> Back to Skills & Projects
            </Link>
          </section>
        )}

        {currentPage === 'contact' && (
          <section className="contact-page section-anchor" id="contact">
            <section className="contact-banner" aria-labelledby="contact-banner-title">
              <div className="contact-banner-inner page-shell">
                <div className="contact-banner-content">
                  <div className="section-kicker">LET&apos;S CONNECT</div>
                  <h1 id="contact-banner-title">
                    <span>Get</span> in
                    <br />
                    touch
                  </h1>
                  <div className="contact-banner-details">
                    <a className="contact-banner-item" href="mailto:davidheavern2@gmail.com">
                      <strong>Email</strong>
                      <span>davidheavern2@gmail.com</span>
                    </a>
                    <a className="contact-banner-item" href="tel:+17145844290">
                      <strong>Phone</strong>
                      <span>(714) 584-4290</span>
                    </a>
                    <div className="contact-banner-item">
                      <strong>Address</strong>
                      <span>{contactAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="contact-content-grid">
              <Card className="contact-map-card" variant="outlined">
                <div className="contact-map-heading">
                  <div>
                    <div className="section-kicker">LOCATION</div>
                    <h3>{contactAddress}</h3>
                  </div>
                  <Button
                    component="a"
                    href={mapDirectionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    variant="outlined"
                    endIcon={<ArrowIcon />}
                  >
                    Directions
                  </Button>
                </div>
                <Suspense
                  fallback={<div className="contact-map-loading">Loading interactive map…</div>}
                >
                  <ContactMap address={contactAddress} searchAddress={contactMapSearch} />
                </Suspense>
              </Card>

              <div className="contact-side">
                <Card className="contact-form-card" variant="outlined">
                  <CardContent>
                    <div className="section-kicker">SEND A MESSAGE</div>
                    <h3>Let&apos;s talk.</h3>
                    <form className="contact-form" onSubmit={handleContactSubmit}>
                      <TextField
                        name="name"
                        label="Your name"
                        autoComplete="name"
                        required
                        fullWidth
                      />
                      <TextField
                        name="email"
                        label="Email address"
                        type="email"
                        autoComplete="email"
                        required
                        fullWidth
                      />
                      <TextField
                        name="message"
                        label="Message"
                        multiline
                        minRows={4}
                        required
                        fullWidth
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        endIcon={<ArrowIcon />}
                      >
                        Send message
                      </Button>
                    </form>
                    <Typography
                      className="contact-form-note"
                      component="p"
                      variant="caption"
                      color="text.secondary"
                      role="status"
                    >
                      {formNotice ||
                        'Submitting opens your email app with the message ready to send.'}
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="page-shell site-footer">
        <span className="footer-signoff">
          David Heavern <span>·</span> Senior Fullstack Engineer
        </span>
        <span>© {new Date().getFullYear()} David Heavern.</span>
        <Link to="/dashboard/overview" className="back-top">
          Back to overview ↑
        </Link>
      </footer>
    </div>
  );
}
