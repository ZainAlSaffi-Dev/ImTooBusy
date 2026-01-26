import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

const Hero = () => {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden text-center px-6">
      
      {/* Background Aura */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-carbon-primary/20 rounded-full blur-[120px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl space-y-8">
        
        {/* System Status */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-carbon-primary/30 bg-carbon-primary/5 text-carbon-primary text-xs font-mono tracking-[0.2em]"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          SYSTEM ONLINE: BRISBANE, QLD
        </motion.div>
        
        {/* Name */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter text-white"
        >
          ZAIN <span className="text-transparent bg-clip-text bg-gradient-to-r from-carbon-primary to-carbon-secondary">AL-SAFFI</span>
        </motion.h1>

        {/* Animation: Slower and Specific Titles */}
        <div className="text-xl md:text-3xl text-carbon-muted font-medium h-10">
           <span>I am a </span>
           <span className="text-carbon-secondary">
             <TypeAnimation
               sequence={[
                 'Quantitative Researcher', 2000,
                 'Software Engineer', 2000,
                 'Machine Learning Engineer', 2000,
                 'Data Scientist', 2000,
                 'Student', 2000, 
               ]}
               wrapper="span"
               speed={63}          // Lower = Slower typing
               deletionSpeed={70}  // Lower = Slower deleting
               repeat={Infinity}
               cursor={true}
             />
           </span>
        </div>

        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-carbon-muted max-w-2xl mx-auto leading-relaxed font-mono tracking-wide"
        >
            <span className="text-white hover:text-carbon-primary transition-colors">QUANT FINANCE</span>
            <span className="mx-3 text-carbon-primary">|</span>
            <span className="text-white hover:text-carbon-primary transition-colors">DEEP LEARNING</span>
            <span className="mx-3 text-carbon-primary">|</span>
            <span className="text-white hover:text-carbon-primary transition-colors">SOFTWARE ENGINEERING</span>
        </motion.p>

      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-10 text-carbon-muted text-sm tracking-widest uppercase"
      >
        Scroll for Logs
      </motion.div>
    </section>
  );
};

export default Hero;