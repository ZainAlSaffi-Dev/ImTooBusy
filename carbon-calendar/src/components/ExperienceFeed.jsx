import Reveal from './Reveal';
import AnimatedCounter from './AnimatedCounter';

const WORK = [
  {
    company: 'Optiver',
    location: 'Sydney',
    role: 'Quantitative Research Intern (incoming)',
    date: 'Dec 2026 — Feb 2027',
    bullets: [],
    tags: ['Quant Research', 'Probability', 'C++'],
  },
  {
    company: 'Optiver',
    location: 'Sydney',
    role: 'FutureFocus Program & Campus Ambassador',
    date: 'Sep 2025 — Present',
    bullets: [
      'Selected as the first student in the program’s history to receive two offers from both available streams simultaneously — Quantitative Research and Software Engineering.',
      'Lead Optiver’s presence at UQ careers fairs and workshops; serve as the UQ liaison converting student interest into candidate pipelines.',
    ],
    tags: ['Recruitment', 'Public Speaking'],
  },
  {
    company: 'Eucalyptus',
    location: 'Brisbane',
    role: 'AI Growth Intern',
    date: 'Apr 2026 — Present',
    bullets: [
      'Engineered a multi-source GLP-1 sentiment monitoring pipeline ingesting Reddit, Facebook and news APIs with lift-score & word-frequency analysis to surface emerging narrative trends; implemented threshold-based alerts notifying marketing leadership to enable first-mover campaign positioning.',
      'Conducted Spearman rank correlation and regression analysis on unconverted patient survey data, linking side-effect sentiment to patient funnel stage — statistical findings that completely pivoted the firm’s marketing strategy.',
    ],
    tags: ['Python', 'NLP', 'Statistics', 'Reddit / Meta APIs'],
  },
  {
    company: 'University of Queensland',
    location: 'St Lucia',
    role: 'Research Assistant',
    date: 'Oct 2025 — Present',
    bullets: [
      'Implemented Meta Content Library API querying via asynchronous batch endpoints with rolling Z-score anomaly detection to identify statistically significant engagement surges across three Facebook groups; research findings contributed to Who Decides the Transition? Governance and Legitimacy in Offshore Wind Development.',
      'Developed end-to-end NLP pipeline using pandas with custom sentiment lexicon and lift-score word-frequency analysis; computed Spearman rank correlations to measure recommendation-algorithm amplification bias across oppositional and pro-development discourse communities.',
    ],
    tags: ['Python', 'NLP', 'Meta API', 'Pandas'],
  },
  {
    company: 'University of Queensland',
    location: 'St Lucia',
    role: 'Casual Academic Tutor — COMP3710',
    date: 'Jun 2025 — Present',
    bullets: [
      'Pattern Recognition and Analysis: instruct 20+ students weekly on machine and deep-learning models and techniques.',
    ],
    tags: ['Teaching', 'Deep Learning'],
  },
  {
    company: 'University of Queensland',
    location: 'St Lucia',
    role: 'Future Students & Student Services Ambassador',
    date: 'Mar 2025 — Present',
    bullets: [
      'Represent the university and EAIT faculty in school expos, talks and careers fairs to guide prospective students in degree selection.',
    ],
    tags: ['Public Relations', 'Student Services'],
  },
  {
    company: 'SVPartners',
    location: 'Brisbane',
    role: 'Insolvency Law Intern',
    date: 'Feb 2026 — Mar 2026',
    bullets: [
      'Applied the IRAC framework to synthesise provisions from the Bankruptcy Act 1966 and Corporations Act 2001, facilitating the adjudication of creditor claims and ensuring compliance with evidentiary requirements for statutory filings.',
      'Conducted legal research into insolvency case law and ex parte procedural requirements to evaluate the validity of corporate documentation, managing the accurate administration of insolvent estates within the Insolv platform.',
    ],
    tags: ['Legal Research', 'Bankruptcy Act', 'Corporations Act'],
  },
  {
    company: 'Thiess',
    location: 'South Bank',
    role: 'Data Science Intern',
    date: 'Dec 2024 — Feb 2025',
    bullets: [
      'Developed a statistical learning state machine using Gaussian Mixture Models and IMM-EKF for real-time truck operation classification and sensor fusion, enhancing reliability and reducing costs by 20%.',
      'Conducted extensive data cleaning and feature engineering using PySpark, SQL and Jupyter Notebooks, including joining disparate telemetry datasets and modelling sensor noise.',
      'Developed a linear model to correct timestamp misalignment, ensuring synchronisation across data sources.',
    ],
    tags: ['PySpark', 'SQL', 'GMM / IMM-EKF', 'Azure Databricks'],
  },
  {
    company: 'UQ Racing',
    location: 'St Lucia',
    role: 'Lead Software Engineer',
    date: 'Nov 2024 — Jun 2025',
    bullets: [
      'Led ROS-to-ROS2 migration in Python and C++, integrating TensorRT-quantised YOLOv11 for faster, more accurate cone detection in real-time autonomous navigation.',
      'Built a Dockerised ROS2-Gazebo simulation environment enabling remote development and virtual testing, boosting testing availability by 80% and accelerating R&D deployment.',
      'Introduced a task-ranked project management system with strategic resource planning and regular stand-ups, eliminating missed deadlines.',
    ],
    tags: ['ROS2', 'C++', 'TensorRT', 'Docker'],
  },
  {
    company: 'UQ Racing',
    location: 'St Lucia',
    role: 'Software Engineer',
    date: 'Feb 2024 — Nov 2024',
    bullets: [
      'Developed path-planning algorithms using a perception stack integrating YOLOv8, Lidar and INS data with Delaunay Triangulation for track driving.',
    ],
    tags: ['YOLOv8', 'Lidar', 'Path Planning'],
  },
];

const LEADERSHIP = [
  {
    company: 'UQ Computing Society',
    location: 'St Lucia',
    role: 'President',
    date: '2026',
    bullets: [
      'Leading end-to-end operations for 2,000+ members — events, sponsorship, and technical programming.',
      'Secured $30k+ in sponsorship (largest in society history) and shipped a centralised project-management framework for logistics & budgeting.',
    ],
    tags: ['Leadership', 'Sponsorship'],
  },
  {
    company: 'UQ Computing Society',
    location: 'St Lucia',
    role: 'Treasurer',
    date: '2025',
    bullets: [
      'Built a multi-variable financial model to optimise ticket pricing against expenditure and sponsorship buffers, eliminating budget deficits and achieving 100% cost-recovery on flagship events.',
    ],
    tags: ['Financial Modelling', 'Operations'],
  },
];

const EDUCATION = [
  {
    company: 'The University of Queensland',
    location: 'St Lucia',
    role: 'B.Eng / M.Eng — Software Specialisation',
    date: 'Feb 2024 — Nov 2028',
    bullets: [
      'GPA 7.00 / 7.00 · Dean’s Academic Excellence Award 2025 · Rio Tinto Future Leader Excellence Scholar.',
    ],
    tags: ['Software Engineering', 'Machine Learning'],
  },
];

// ── Big-number "trophy" cards for the Awards moment ───────────────────────
const TROPHIES = [
  {
    counter: <AnimatedCounter to={9} />,
    suffix: 'th',
    label: 'IMC Prosperity 3 — Australia',
    sub: 'Algorithm category · 15,000 teams',
  },
  {
    counter: <AnimatedCounter to={60} />,
    suffix: 'th',
    label: 'IMC Prosperity 3 — Global',
    sub: 'Top 0.4% of all teams',
  },
  {
    counter: <AnimatedCounter to={98.98} decimals={2} suffix="%" />,
    label: 'BlackBoxLabs accuracy',
    sub: 'AI-generated code detection',
  },
  {
    counter: <AnimatedCounter to={30} prefix="$" suffix="k+" />,
    label: 'UQCS sponsorship secured',
    sub: 'Largest in society history',
  },
];

// ── A single row in the editorial list ────────────────────────────────────
const Row = ({ entry, index }) => (
  <Reveal delay={Math.min(index * 0.04, 0.2)} as="article">
    <div className="group grid md:grid-cols-12 gap-4 md:gap-8 py-10 border-b border-ink-300/60">
      <div className="md:col-span-3">
        <div className="font-mono text-[11px] uppercase tracking-widest text-ink-600">
          {entry.date}
        </div>
        <div className="text-ink-700 text-sm mt-1">{entry.location}</div>
      </div>

      <div className="md:col-span-9">
        <h3 className="text-xl md:text-2xl text-ink-900 leading-snug tracking-tightish">
          <span className="font-medium">{entry.role}</span>
          <span className="text-ink-700 font-light"> · </span>
          <span className="font-serif italic text-ink-800 group-hover:text-accent transition-colors">
            {entry.company}
          </span>
        </h3>

        {entry.bullets.length > 0 && (
          <ul className="mt-4 space-y-3 text-ink-800 text-[15px] leading-relaxed max-w-reading">
            {entry.bullets.map((b, i) => (
              <li key={i} className="relative pl-4">
                <span className="absolute left-0 top-2.5 w-1.5 h-px bg-ink-500" />
                {b}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {entry.tags.map((t) => (
            <span
              key={t}
              className="text-xs font-mono text-ink-700 px-2 py-1 border border-ink-300/70 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  </Reveal>
);

const SectionList = ({ id, label, title, entries }) => (
  <div id={id} className="py-36 md:py-48 px-6">
    <div className="max-w-6xl mx-auto">
      <Reveal>
        <span className="eyebrow">{label}</span>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-4 text-5xl md:text-7xl lg:text-[5.5rem] font-serif italic font-normal text-ink-900 leading-[1.04] tracking-tighter2">
          {title}
        </h2>
      </Reveal>

      <div className="mt-14 border-t border-ink-300/60">
        {entries.map((e, i) => (
          <Row key={`${e.company}-${e.role}-${i}`} entry={e} index={i} />
        ))}
      </div>
    </div>
  </div>
);

// ── Awards = big-number scene, then the row list ──────────────────────────
const Awards = () => (
  <div id="awards" className="py-36 md:py-48 px-6">
    <div className="max-w-6xl mx-auto">
      <Reveal>
        <span className="eyebrow">Honours</span>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-4 text-5xl md:text-7xl lg:text-[5.5rem] font-serif italic font-normal text-ink-900 leading-[1.04] tracking-tighter2">
          Scholarships &amp; Awards.
        </h2>
      </Reveal>

      {/* Big-number trophy grid */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-14">
        {TROPHIES.map((t, i) => (
          <Reveal key={t.label} delay={i * 0.08}>
            <div className="group">
              <div className="text-5xl md:text-7xl font-serif italic font-normal text-ink-900 leading-none tracking-tighter2 group-hover:text-accent transition-colors">
                {t.counter}
                {t.suffix && <span className="text-3xl md:text-5xl align-top">{t.suffix}</span>}
              </div>
              <div className="mt-4 text-ink-900 text-sm md:text-base font-medium">
                {t.label}
              </div>
              <div className="text-ink-600 text-xs md:text-sm mt-1">
                {t.sub}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* The narrative awards list under the trophies */}
      <div className="mt-24 border-t border-ink-300/60">
        <Row entry={{
          company: 'The University of Queensland',
          location: 'St Lucia',
          role: 'Dean’s Academic Excellence Award',
          date: '2025',
          bullets: ['Awarded for sustained academic performance across the program — GPA 7.00 / 7.00.'],
          tags: ['Academic'],
        }} index={0} />
        <Row entry={{
          company: 'Rio Tinto',
          location: 'Brisbane',
          role: 'Future Leader Excellence Scholar',
          date: '2024 — Present',
          bullets: ['Selected as a Rio Tinto Future Leader Excellence Scholar — awarded to high-performing UQ engineering students with demonstrated leadership potential.'],
          tags: ['Scholarship'],
        }} index={1} />
        <Row entry={{
          company: 'UQ Computing Society',
          location: 'St Lucia',
          role: 'People’s Choice — UQCS Hackathon',
          date: 'Aug 2024',
          bullets: ['Led a 6-person team to the People’s Choice award for ValoStats — a predictive analytics engine for Valorant Champions 2025 ($500 prize).'],
          tags: ['Hackathon'],
        }} index={2} />
      </div>
    </div>
  </div>
);

const ExperienceFeed = () => {
  return (
    <>
      <SectionList id="work"       label="Experience" title="Work."         entries={WORK} />
      <SectionList id="leadership" label="Community"  title="Leadership."   entries={LEADERSHIP} />
      <Awards />
      <SectionList id="education"  label="Study"      title="Education."    entries={EDUCATION} />
    </>
  );
};

export default ExperienceFeed;
