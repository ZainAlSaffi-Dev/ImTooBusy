import { Briefcase, Trophy, Code, GraduationCap, Users, TrendingUp, BookOpen } from 'lucide-react';

// NOTE: We no longer need to import the icons here, as we are using images.

// 0. EDUCATION DATA
const educationData = [
    {
        id: 'uq-masters',
        role: "Master of Engineering",
        company: "The University of Queensland",
        date: "Feb 2024 - June 2029",
        logo: "/logos/uq2.png",
        description: "Specializing in Embedded Software and Machine Learning.",
        tech: ["GPA: 7.00/7.00", "Dean's Excellence Award 2025"]
    },
    {
        id: 'uq-bachelors',
        role: "Bachelor of Engineering (Honours)",
        company: "The University of Queensland",
        date: "Feb 2024 - June 2029",
        logo: "/logos/uq2.png",
        description: "Specializing in Embedded Software and Machine Learning.",
        tech: ["GPA: 7.00/7.00", "Dean's Excellence Award 2025"]
    }
];

// 1. PROFESSIONAL EXPERIENCE (Jobs)
const workHistory = [
    {
        id: 'optiver-qr',
        role: "Quantitative Research Intern",
        company: "Optiver",
        date: "Incoming (Dec 2026 - Feb 2027)",
        logo: "/logos/optiver2.png",
        description: "Incoming intern in the D1 quantitative research team.",
        tech: ["Quant Research", "Probability", "D1 Team", "Machine Learning"]
    },
    {
        id: 'optiver-ambassador',
        role: "Campus Ambassador",
        company: "Optiver",
        date: "Nov 2025 - Present",
        logo: "/logos/optiver2.png",
        description: [
            "Lead Optiver's presence at UQ careers fairs and workshops.",
            "Serve as UQ liaison to convert student interest into candidate pipelines."
        ],
        tech: ["Recruitment", "Public Speaking", "Quantitative Finance"]
    },
    {
        id: 'optiver-futurefocus',
        role: "Future Focus Program",
        company: "Optiver",
        date: "Sep 2025 - Oct 2025",
        logo: "/logos/optiver2.png",
        description: [
            "Selected as part of 50 candidates out of 5,000+ to participate in a series of exercises involving market making, volatility calculations, and software engineering design.",
            "Became the first candidate in Optiver history to be extended two offers from the program for both Software Engineering and Quantitative Research roles."
        ],
        tech: ["Elite Program", "Quantitative Finance", "Software Engineering"]
    },
    {
        id: 'svp-intern',
        role: "Law & Insolvency Intern",
        company: "SVPartners",
        date: "Feb 2026 - May 2026",
        logo: "/logos/svpartners.png", 
        description: "Incoming Winter Insolvency Intern at SVPartners.",
        tech: ["Insolvency", "Finance", "Law"]
    },
    {
        id: 'thiess-ds',
        role: "Data Science Intern",
        company: "Thiess",
        date: "Dec 2024 - Feb 2025",
        logo: "/logos/Thiess.png",
        description: [
            "Developed a statistical learning state machine using Gaussian Mixture Models and IMM-EKF for real-time truck operation classification and sensor fusion, enhancing reliability and reducing costs by 20%.",
            "Conducted extensive data cleaning and feature engineering using PySpark, SQL, and Jupyter Notebooks, including joining disparate telemetry datasets and modelling sensor noise.",
            "Developed a linear model to correct timestamp misalignment, ensuring synchronisation across data sources."
        ],
        tech: ["PySpark", "Statistics", "Probability Theory", "SQL", "Feature Engineering", "Azure Databricks"]
    },
    {
        id: 'uq-research',
        role: "Research Assistant",
        company: "University of Queensland",
        date: "Oct 2025 - Present",
        logo: "/logos/uq2.png",
        description: [
            "Collecting and structuring Facebook group data using Meta's Content Library API for sentiment analysis of offshore wind projects.",
            "Designed NLP pipeline compliant with Privacy Act."
        ],
        tech: ["Python", "NLP", "Meta API", "Data Pipelines"]
    },
    {
        id: 'uq-racing-lead',
        role: "Lead Software Engineer",
        company: "UQ Racing",
        date: "Nov 2024 - June 2025",
        logo: "/logos/uqracing.png",
        description: [
            "Led ROS-to-ROS2 migration in Python and C++, integrating TensorRT-quantised YOLOv11 for faster, more accurate cone detection in real-time autonomous navigation.",
            "Built a Dockerised ROS2-Gazebo simulation environment enabling remote development and virtual testing, boosting testing availability by 80% and accelerating R&D deployment.",
            "Introduced a task-ranked project management system with strategic resource planning and regular stand-ups, eliminating missed deadlines"
        ],
        tech: ["C++", "ROS2", "Docker", "TensorRT", "Python", "Project Management", "Nvidia"]
    },
    {
        id: 'uq-racing-swe',
        role: "Software Engineer",
        company: "UQ Racing",
        date: "Feb 2024 - Nov 2024",
        logo: "/logos/uqracing.png",
        description: "Developed path planning algorithms using a perception stack integrating YOLOv8, Lidar, and INS data with Delaunay Triangulation.",
        tech: ["YOLOv8", "Lidar", "Path Planning"]
    },
    {
        id: 'uq-tutor',
        role: "Casual Academic Tutor",
        company: "University of Queensland",
        date: "June 2025 - Present",
        logo: "/logos/uq2.png",
        description: "Instructing 20+ students weekly in COMP3710 (Pattern Recognition and Analysis) on machine and deep learning models.",
        tech: ["Teaching", "Deep Learning", "COMP3710"]
    },
    {
        id: 'uq-ambassador-services',
        role: "Student Services Ambassador",
        company: "University of Queensland",
        date: "Jan 2025 - Present",
        logo: "/logos/uq2.png",
        description: "Assisting students with course selection and navigating UQ's proprietary software for enrollments.",
        tech: ["Student Services", "Administration"]
    },
    {
        id: 'uq-ambassador-future',
        role: "Future Students Ambassador",
        company: "University of Queensland",
        date: "Mar 2025 - Present",
        logo: "/logos/uq2.png",
        description: "Representing the university and EAIT faculty in school expos, talks and careers fairs.",
        tech: ["Public Relations"]
    }
];

// 2. LEADERSHIP & COMMUNITY (Societies)
const leadershipHistory = [
    {
        id: 'uqcs-president',
        role: "President",
        company: "UQ Computing Society",
        date: "Oct 2025 - Present",
        logo: "/logos/uqcs.png",
        description: [
            "Orchestrated end-to-end operations for 2,000+ members by implementing a centralized project management framework for logistics and budgeting, ensuring the seamless execution of 30+ society events.",
            "Assissted in the coordination of sponsorship negotiations and secured $30k+ in sponsorship (largest in society history).",
            "Engineered a new technical engagement strategy through the launch of industry-aligned hackathons and academic workshops, driving a measurable increase in member participation and student career-readiness"
        ],
        tech: ["Leadership", "Event Management", "Sponsorship"]
    },
    {
        id: 'uqcs-treasurer',
        role: "Treasurer",
        company: "UQ Computing Society",
        date: "May 2025 - Oct 2025",
        logo: "/logos/uqcs.png",
        description: [
            "Developed a multi-variable financial model to optimize ticket pricing based on expenditure and sponsorship buffers, effectively eliminating budget deficits and ensuring 100% cost-recovery on all flagship events",
            "Achieved a 100% event sell-out rate by leveraging data-driven budget allocation for marketing and logistics, maximizing society visibility while maintaining high-quality member experiences.",
            "Designed a comprehensive fiscal reporting system to track expenditure across multiple departments, resulting in more optimal resource distribution and increased reinvestable capital for future club initiatives."
        ],
        tech: ["Financial Modeling", "Budgeting", "Event Management"]
    },
    {
        id: 'uqcs-exec',
        role: "General Executive",
        company: "UQ Computing Society",
        date: "Oct 2024 - May 2025",
        logo: "/logos/uqcs.png",
        description: "Spearheaded operational logistics and digital broadcasting for large-scale technical events.",
        tech: ["Logistics", "A/V Infrastructure", "Event Management"]
    },
    {
        id: 'uq-fintech',
        role: "General Executive",
        company: "UQ Fintech",
        date: "May 2025 - Present",
        logo: "/logos/uqfintech.png",
        description: "Delivering technical seminars and serving as a panelist to help 100+ students break into the quant industry.",
        tech: ["Mentorship", "Quant Finance"]
    }
];

// EducationCard: Mobile-first layout with logo above date bar
const EducationCard = ({ data }) => (
    <div className="relative mb-8 md:mb-16">
        <div className="w-full p-6 md:p-10 rounded-2xl md:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-carbon-primary/30 transition-all group">
            
            {/* MOBILE LAYOUT: Stacked vertically */}
            <div className="flex flex-col gap-4 md:gap-0">
                
                {/* Mobile: Logo centered at top */}
                <div className="flex justify-center md:hidden mb-2">
                    <img 
                        src={data.logo} 
                        alt={data.company}
                        className="h-12 w-auto object-contain grayscale brightness-200 opacity-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100 group-hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.6)] transition-all duration-300"
                    />
                </div>
                
                {/* Mobile: Full-width date bar */}
                <div className="w-full md:hidden">
                    <span className="block w-full text-center text-sm font-mono text-carbon-primary border border-carbon-primary/30 px-4 py-2 rounded bg-carbon-primary/5">
                        {data.date}
                    </span>
                </div>

                {/* DESKTOP LAYOUT: Side by side */}
                <div className="hidden md:flex md:flex-row items-start md:items-center gap-10">
                    {/* Logo Box */}
                    <div className="shrink-0">
                        <img 
                            src={data.logo} 
                            alt={data.company}
                            className="h-16 w-auto object-contain object-left grayscale brightness-200 opacity-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100 group-hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.6)] transition-all duration-300"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 w-full">
                        <div className="flex flex-row items-center justify-between mb-4 gap-4">
                            <h3 className="text-4xl font-bold text-white group-hover:text-carbon-primary transition-colors">
                                {data.role}
                            </h3>
                            <span className="text-base font-mono text-carbon-primary border border-carbon-primary/30 px-4 py-2 rounded whitespace-nowrap bg-carbon-primary/5">
                                {data.date}
                            </span>
                        </div>

                        <p className="text-2xl text-gray-300 font-medium mb-6">{data.company}</p>
                        <p className="text-xl text-gray-300 leading-relaxed mb-8">
                            {data.description}
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {data.tech.map(t => (
                                <span key={t} className="text-base font-medium text-carbon-secondary bg-carbon-secondary/10 px-4 py-2 rounded border border-carbon-secondary/10 shadow-[0_0_10px_rgba(233,213,255,0.05)]">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Content (below logo and date) */}
                <div className="md:hidden mt-2">
                    <h3 className="text-2xl font-bold text-white group-hover:text-carbon-primary transition-colors mb-1">
                        {data.role}
                    </h3>
                    <p className="text-lg text-gray-300 font-medium mb-3">{data.company}</p>
                    <p className="text-base text-gray-300 leading-relaxed mb-4">
                        {data.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {data.tech.map(t => (
                            <span key={t} className="text-xs font-medium text-carbon-secondary bg-carbon-secondary/10 px-2 py-1 rounded border border-carbon-secondary/10">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// FeedItem: Mobile-first layout with logo above date bar
const FeedItem = ({ data, alignRight }) => (
    <div className={`relative flex flex-col md:flex-row gap-6 md:gap-12 ${alignRight ? 'md:flex-row-reverse' : ''}`}>
        {/* The Dot */}
        <div className="absolute left-0 md:left-1/2 w-4 md:w-5 h-4 md:h-5 bg-carbon-bg border-3 md:border-4 border-carbon-primary rounded-full translate-y-2 md:-translate-x-1/2 z-10 shadow-[0_0_15px_#a855f7]" />

        {/* Spacer */}
        <div className="hidden md:block flex-1" />

        {/* Content Card */}
        <div className="flex-1 pl-8 md:pl-0">
            <div className="p-5 md:p-10 rounded-xl md:rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm group">
                
                {/* MOBILE LAYOUT: Logo -> Date Bar -> Content */}
                <div className="md:hidden flex flex-col gap-3">
                    {/* Logo centered */}
                    <div className="flex justify-center">
                        <img 
                            src={data.logo} 
                            alt={data.company}
                            className="h-10 w-auto max-w-[120px] object-contain grayscale brightness-200 opacity-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100 group-hover:drop-shadow-[0_0_12px_rgba(168,85,247,0.6)] transition-all duration-300"
                        />
                    </div>
                    
                    {/* Full-width date bar */}
                    <span className="block w-full text-center text-xs font-bold font-mono text-carbon-primary border border-carbon-primary/30 px-3 py-2 rounded bg-carbon-primary/5">
                        {data.date}
                    </span>
                    
                    {/* Title and company */}
                    <h3 className="text-xl font-bold text-white group-hover:text-carbon-primary transition-colors">
                        {data.role}
                    </h3>
                    <p className="text-base text-gray-400 font-medium -mt-2 mb-2">{data.company}</p>

                    {/* Description */}
                    <div className="text-sm text-gray-200 leading-relaxed mb-3">
                        {Array.isArray(data.description) ? (
                            <ul className="list-disc pl-4 space-y-2">
                                {data.description.map((line, i) => (
                                    <li key={i}>{line}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>{data.description}</p>
                        )}
                    </div>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-2">
                        {data.tech.map(t => (
                            <span key={t} className="text-xs font-bold text-carbon-secondary bg-carbon-secondary/10 px-2 py-1 rounded">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                {/* DESKTOP LAYOUT: Original side-by-side */}
                <div className="hidden md:block">
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-sm font-bold font-mono text-carbon-primary border border-carbon-primary/30 px-3 py-1.5 rounded">
                            {data.date}
                        </span>

                        <img 
                            src={data.logo} 
                            alt={data.company}
                            className="h-16 w-auto max-w-[160px] object-contain object-right grayscale brightness-200 opacity-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100 group-hover:drop-shadow-[0_0_12px_rgba(168,85,247,0.6)] transition-all duration-300"
                        />
                    </div>

                    <h3 className="text-3xl font-bold text-white group-hover:text-carbon-primary transition-colors mb-2">
                        {data.role}
                    </h3>
                    <p className="text-xl text-gray-400 font-medium mb-6">{data.company}</p>

                    <div className="text-lg text-gray-200 leading-relaxed mb-6">
                        {Array.isArray(data.description) ? (
                            <ul className="list-disc pl-5 space-y-3">
                                {data.description.map((line, i) => (
                                    <li key={i}>{line}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>{data.description}</p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {data.tech.map(t => (
                            <span key={t} className="text-sm font-bold text-carbon-secondary bg-carbon-secondary/10 px-3 py-1.5 rounded">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ExperienceFeed = () => {
    return (
        <section className="py-12 md:py-24 px-4 md:px-6 max-w-7xl mx-auto relative">

            {/* 0. EDUCATION HEADER */}
            <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-12 flex items-center gap-2 md:gap-4">
                <span className="text-carbon-primary">#</span> EDUCATION
            </h2>

            {/* Render Education */}
            {educationData.map((exp) => (
                <EducationCard key={exp.id} data={exp} />
            ))}

            {/* 1. PROFESSIONAL EXPERIENCE HEADER */}
            <h2 className="text-2xl md:text-4xl font-bold mb-8 md:mb-16 flex items-center gap-2 md:gap-4 mt-16 md:mt-32">
                <span className="text-carbon-primary">#</span> EXPERIENCE
            </h2>

            <div className="relative space-y-10 md:space-y-20 mb-20 md:mb-40">
                {/* Timeline Line for Jobs */}
                <div className="absolute left-[7px] md:left-1/2 top-4 bottom-4 w-0.5 md:w-1 bg-gradient-to-b from-carbon-primary/50 to-transparent md:-translate-x-1/2" />

                {workHistory.map((exp, index) => (
                    <FeedItem key={exp.id} data={exp} alignRight={index % 2 === 0} />
                ))}
            </div>

            {/* 2. LEADERSHIP HEADER */}
            <h2 className="text-2xl md:text-4xl font-bold mb-8 md:mb-16 flex items-center gap-2 md:gap-4">
                <span className="text-carbon-secondary">#</span> LEADERSHIP
            </h2>

            <div className="relative space-y-10 md:space-y-20">
                {/* Timeline Line for Leadership */}
                <div className="absolute left-[7px] md:left-1/2 top-4 bottom-4 w-0.5 md:w-1 bg-gradient-to-b from-carbon-secondary/50 to-transparent md:-translate-x-1/2" />

                {leadershipHistory.map((exp, index) => (
                    <FeedItem key={exp.id} data={exp} alignRight={index % 2 === 0} />
                ))}
            </div>

        </section>
    );
};

export default ExperienceFeed;