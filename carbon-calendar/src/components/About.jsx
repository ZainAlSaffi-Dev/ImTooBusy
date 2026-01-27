import { motion } from 'framer-motion';
import { Terminal, Cpu, Music, Scale } from 'lucide-react';

const aboutSections = [
  {
    id: 1,
    title: "The Identity",
    subtitle: "Student // Leader // Problem Solver",
    icon: <Terminal size={24} />,
    text: (
      <>
        <p>
          Hey! My name is Zain and I'm an Engineering student at the <span className="text-white font-bold">University of Queensland</span>, specializing in all things software.
        </p>
        <p>
          I currently serve as the <span className="text-carbon-primary font-bold">President of the UQ Computing Society</span> and bounce around a few other roles on campus. I love solving interesting problems and pushing myself to the limit—then breaking that limit to see what happens next.
        </p>
      </>
    ),
    // Fixed path: /public/logos/ -> /logos/
    image: "/logos/Ball.JPG",
    tags: ["Leadership", "Community", "Growth"]
  },
  {
    id: 2,
    title: "The Work",
    subtitle: "Quant // Algorithms // Building Stuff",
    icon: <Cpu size={24} />,
    text: (
      <>
        <p>
          Most of my technical brain power goes into <span className="text-white font-bold">Algorithmic Trading</span>. I'm heading to <span className="text-carbon-primary font-bold">Optiver</span> soon as a Quantitative Researcher, which is honestly a dream come true.
        </p>
        <p>
          I love the rush of trading competitions—building bots, crunching math, and trying to outsmart the market with Python. Whether it's optimization or deep learning, if it’s difficult and involves data, I’m probably into it.
        </p>
      </>
    ),
    image: "/logos/prosperity.JPG",
    tags: ["Python", "Math", "Trading"]
  },
  {
    id: 3,
    title: "The Hobbies",
    subtitle: "Metal // Sound // Scents",
    icon: <Music size={24} />,
    text: (
      <>
        <p>
          When I'm not staring at a terminal, I'm usually making noise. I play <span className="text-white font-bold">7-string guitar</span> (mostly metal—think Slipknot or In Flames) and love messing around with low tunings and composition. My current gear stack is an Ibanez Prestige RGR752AHB into a Neural DSP Archetype Gojira.  
        </p>
        <p>
          I'm also pretty deep into <span className="text-carbon-primary font-bold">niche fragrances</span>. There is a surprising amount of chemistry and art in layering scents, and I just think it's a cool world to explore. My current rotation is LV Imagination, Creed Aventus, Afternoon Swim and Pacific Chill for the summer. PDM Althair, Initio Oud for Greatness and PDM Oajan for the winter.
        </p>
      </>
    ),
    image: "/logos/guitar.jpeg",
    tags: ["Guitar", "Metal", "Fragrances"]
  },
  {
    id: 4,
    title: "The Future",
    subtitle: "Neurobionics // Justice // Future",
    icon: <Scale size={24} />,
    text: (
      <>
        <p>
          Long term? I want to build things that actually matter. My moonshot goal is to start a <span className="text-white font-bold">Neurobionics firm</span> to help reverse neurological diseases like Alzheimer's.
        </p>
        <p>
          I also have a fire in me for <span className="text-carbon-primary font-bold">Pro Bono Law</span>. I’m deeply driven by the idea of standing up for people who can't defend themselves—using logic and argument to be a shield for the vulnerable.
        </p>
      </>
    ),
    image: "/logos/sydney.JPG",
    tags: ["Bio-Tech", "Justice"]
  }
];

const About = ({ isUnlocked }) => {
  return (
    <motion.section 
        id="about" 
        // Logic: Start hidden (height: 0), then expand when unlocked
        initial={{ opacity: 0, y: 100, height: 0, overflow: 'hidden' }}
        animate={isUnlocked ? { opacity: 1, y: 0, height: 'auto', overflow: 'visible' } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
        className="py-24 px-6 max-w-7xl mx-auto"
    >
      
      {/* Section Header */}
      <div className="mb-20 text-center">
        <motion.h2 
          className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
        >
          WHO_AM_I<span className="text-carbon-primary">?</span>
        </motion.h2>
        <motion.div 
          initial={{ w: 0 }}
          whileInView={{ w: 100 }}
          viewport={{ once: true }}
          className="h-1 w-24 bg-carbon-primary mx-auto rounded-full"
        />
      </div>

      <div className="space-y-32">
        {aboutSections.map((section, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <motion.div 
              key={section.id}
              // Only animate items in when the parent is unlocked
              initial={{ opacity: 0, y: 50 }}
              whileInView={isUnlocked ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 items-center group`}
            >
              
              {/* IMAGE SIDE */}
              <div className="w-full md:w-1/2 relative">
                {/* The Purple Underglow */}
                <div className="absolute -inset-4 bg-purple-600/20 blur-2xl rounded-full opacity-75 group-hover:opacity-100 group-hover:bg-purple-600/30 transition-all duration-700 pointer-events-none" />
                
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                  <div className="aspect-[4/5] md:aspect-[4/3] relative">
                    {/* Placeholder Text */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-800 font-mono text-xs z-0">
                        IMG: {section.title}
                    </div>
                    
                    <img 
                      src={section.image} 
                      alt={section.title} 
                      className="w-full h-full object-cover grayscale brightness-90 contrast-125 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700 ease-in-out relative z-10"
                      onError={(e) => {
                          // Fallback to avoid broken image icon
                          e.target.style.display = 'none';
                          e.target.parentElement.classList.add('bg-gray-900');
                      }}
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-purple-900/10 mix-blend-overlay z-20 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* TEXT SIDE */}
              <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
                <div className={`flex flex-col ${isEven ? 'md:items-start' : 'md:items-end'}`}>
                  
                  <div className="flex items-center gap-2 text-carbon-primary font-mono text-sm tracking-widest mb-2 uppercase">
                    {section.icon}
                    <span>0{index + 1} // {section.title}</span>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {section.subtitle}
                  </h3>
                  
                  <div className="h-1 w-20 bg-white/10 rounded-full mb-6" />
                </div>

                <div className={`text-gray-400 leading-relaxed text-lg space-y-4 ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                  {section.text}
                </div>

                {/* Tags */}
                <div className={`flex flex-wrap gap-2 pt-4 ${isEven ? 'justify-center md:justify-start' : 'justify-center md:justify-end'}`}>
                  {section.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 text-xs font-mono text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default About;