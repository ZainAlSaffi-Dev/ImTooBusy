import { Linkedin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

// UPDATE THIS WITH YOUR LINKEDIN URL
const LINKEDIN_URL = "https://www.linkedin.com/in/zain-al-saffi-881492250/";

const Contact = () => {
    return (
        <motion.section 
            id="contact"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="py-16 md:py-24 px-4 md:px-6 max-w-7xl mx-auto"
        >
            {/* Section Header */}
            <div className="mb-10 md:mb-16 text-center">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                    CONTACT<span className="text-carbon-primary">_ME</span>
                </h2>
                <div className="h-1 w-24 bg-carbon-primary mx-auto rounded-full" />
            </div>

            {/* Contact Card */}
            <div className="max-w-md mx-auto">
                <motion.a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-8 md:p-10 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-carbon-primary/50 transition-all duration-300 backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="flex flex-col items-center text-center gap-6">
                        {/* LinkedIn Icon */}
                        <div className="p-4 rounded-full bg-[#0A66C2]/10 border border-[#0A66C2]/30 group-hover:bg-[#0A66C2]/20 group-hover:border-[#0A66C2]/50 transition-all">
                            <Linkedin 
                                size={48} 
                                className="text-[#0A66C2] group-hover:drop-shadow-[0_0_15px_rgba(10,102,194,0.5)] transition-all"
                            />
                        </div>
                        
                        {/* Text */}
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-carbon-primary transition-colors">
                                LinkedIn
                            </h3>
                            <p className="text-gray-400 text-sm md:text-base mb-4">
                                Connect with me professionally
                            </p>
                        </div>
                        
                        {/* Link indicator */}
                        <div className="flex items-center gap-2 text-carbon-primary font-mono text-sm">
                            <span>View Profile</span>
                            <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </motion.a>
                
                {/* Subtitle */}
                <p className="text-center text-gray-500 text-sm mt-8 font-mono">
                    // Feel free to reach out for opportunities, collaborations, or just to say hi!
                </p>
            </div>
        </motion.section>
    );
};

export default Contact;
