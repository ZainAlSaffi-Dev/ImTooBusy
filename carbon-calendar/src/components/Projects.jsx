import { motion } from 'framer-motion';
import { Github, ExternalLink, Youtube, Trophy, Activity } from 'lucide-react';

const projects = [
  {
    id: "imc",
    title: "IMC Prosperity 3",
    role: "Algorithmic Trading Competition",
    date: "April 2025",
    // Note: In Vite, '/public' is the root. So use '/logos/...' not '/public/logos/...'
    image: "/logos/prosperity.JPG", 
    logo: "/logos/imc.png",
    tech: ["Python", "Pandas", "Scikit-Learn", "Black-Scholes"],
    stats: "rank: 60th Global / 9th AU",
    description: "Built statistical arbitrage strategies using cointegration and Ornstein-Uhlenbeck modelling. Engineered a real-time Python visualiser for P&L monitoring. Placed 1st in Queensland, 9th Australia and 60th Worldwide in the Algorithm Category",
    links: {
      github: "https://github.com/ZainAlSaffi-Dev/imc-prosperity3",
      // Specific YouTube Logic
      youtube: "https://www.youtube.com/watch?v=D9cbJJ3oKr4" 
    },
    accent: "from-blue-500 to-cyan-500"
  },
  {
    id: "blackbox",
    title: "AI Code Detection",
    role: "Machine Learning",
    date: "Sept 2025",
    image: "/logos/blackboxlabs.JPG", 
    logo: "/logos/bbxlogo.jpg",
    tech: ["CodeGPTSensor+", "PyTorch", "Redis", "Docker"], // Updated Tech Stack
    stats: "accuracy: 98.98% (ROC-AUC 0.99)",
    description: "Retrofitted a contrastive learning CodeGPTSensor+ model to detect AI-generated code, utilizing MIST adversarial augmentation to achieve 98.98% accuracy. Deployed as a GitHub App via an INT8-quantized TorchScript inference service for real-time, CPU-efficient PR scanning.",
    links: {
      github: "https://github.com/BlackBox-Labs-TM"
    },
    accent: "from-purple-500 to-pink-500"
  },
  {
    id: "valostats",
    title: "ValoStats",
    role: "Full Stack Data App",
    date: "Aug 2024",
    image: "/logos/hackathon.JPG",
    logo: "/logos/riot.png",
    position: 'object-top',
    tech: ["Streamlit", "Gradient Boosting", "Riot API", "Scikit-Learn"],
    stats: "award: People's Choice (UQCS)",
    description: "Led a 6-person engineering team to build a predictive analytics engine for Valorant Champions 2025. Orchestrated real-time telemetry ingestion via the Riot Games API to feed a Gradient Boosting ensemble model, achieving 90% prediction accuracy. Voted People's Choice Award and won $500",
    links: {
      github: "https://github.com/XLeling727/Valostats"
    },
    accent: "from-red-500 to-orange-500"
  },
  {
    id: "skindetect",
    title: "SkinDetect",
    role: "Computer Vision",
    date: "Sept 2024",
    image: "/logos/skin.png", 
    logo: "/logos/pytorch.png",
    position: 'object-top', 
    tech: ["ResNet-50", "Siamese Network", "Triplet Loss"],
    stats: "accuracy: 90% (ISIC-2020)",
    description: "Designed a Siamese network with ResNet-50 backbone to classify melanoma lesions, validated with t-SNE for robust generalisation.",
    links: {
      github: "https://github.com/ZainAlSaffi-Dev/PatternAnalysis-2024/tree/topic-recognition/recognition/Siamese-48008361"
    },
    accent: "from-green-500 to-emerald-500"
  }
];

const ProjectCard = ({ project, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative w-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 flex flex-col"
    >
      {/* 1. Image Area with Overlay */}
      <div className="relative h-48 w-full overflow-hidden shrink-0">
        <div className={`absolute inset-0 bg-gradient-to-t ${project.accent} opacity-20 group-hover:opacity-10 transition-opacity z-10`} />
        
        {/* Placeholder for actual image */}
        <div className="absolute inset-0 bg-black/50 z-0 flex items-center justify-center text-gray-700 font-mono text-xs">
            [IMG: {project.id}]
        </div>
        
        <img 
            src={project.image} 
            alt={project.title}
            className={`w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-110 transition-all duration-700 ease-out opacity-60 group-hover:opacity-100 ${project.position || 'object-center'}`}
            onError={(e) => e.target.style.display = 'none'} 
        />
        {/* Note: Floating logo removed from here */}
      </div>

      {/* 2. Content Area */}
      <div className="p-6 relative z-20 bg-[#0a0a0a] flex flex-col flex-1">
        
        {/* NEW HEADER: Date + Logo (Matching ExperienceFeed) */}
        <div className="flex justify-between items-center mb-4">
             <span className="text-[10px] font-bold font-mono text-carbon-primary border border-carbon-primary/30 px-2 py-1 rounded bg-carbon-primary/5 uppercase tracking-wider">
                {project.date}
             </span>
             
             {/* THE LOGO: Greyscale -> Color on Hover */}
             <img 
                src={project.logo} 
                alt="logo" 
                className="h-8 w-auto object-contain grayscale brightness-200 opacity-50 group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100 transition-all duration-500"
                onError={(e) => e.target.style.display = 'none'} 
             />
        </div>

        {/* Title & Role */}
        <div className="mb-4">
            <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all mb-1">
                {project.title}
            </h3>
            <div className="flex items-center gap-2">
                <p className="text-sm text-carbon-primary font-mono">{project.role}</p>
                {/* Stats Badge */}
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                    <Activity size={10} />
                    {project.stats}
                </div>
            </div>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mb-6">
            {project.description}
        </p>

        {/* Footer: Tech Stack + Links (Pushed to bottom) */}
        <div className="mt-auto">
            {/* Tech Stack Chips */}
            <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map(t => (
                    <span key={t} className="text-xs font-medium text-gray-300 bg-white/5 border border-white/5 px-2 py-1 rounded group-hover:border-white/20 transition-colors">
                        {t}
                    </span>
                ))}
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <a 
                    href={project.links.github} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                >
                    <Github size={16} /> Code
                </a>
                
                {project.links.youtube && (
                    <a 
                        href={project.links.youtube} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm font-bold text-red-400 hover:text-red-300 transition-colors ml-auto"
                    >
                        <Youtube size={16} /> Demo
                    </a>
                )}

                {!project.links.youtube && (
                     <button className="flex items-center gap-2 text-sm font-bold text-gray-600 cursor-not-allowed ml-auto">
                        <ExternalLink size={16} /> Live
                     </button>
                )}
            </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="text-4xl md:text-6xl font-black text-white mb-4 flex items-center gap-4">
            <Trophy className="text-carbon-primary" size={40} />
            PROJECTS
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl font-mono">
            /root/quant_research/algorithms && /src/software_engineering
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  );
};

export default Projects;