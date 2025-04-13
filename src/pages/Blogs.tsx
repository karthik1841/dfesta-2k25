import { motion } from 'framer-motion';
import { Globe, Sparkles, DollarSign, Settings, ShoppingCart, Palette, GraduationCap, BookOpen, Briefcase } from 'lucide-react';

const FloatingCards = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const services = [
    { icon: <Globe className="w-10 h-10 text-orange-500 mb-4" />, title: "Global Build Websites", description: "Whether you're a startup, freelancer, or established brand, we bring your vision to life with professional designs and seamless functionality." },
    { icon: <Sparkles className="w-10 h-10 text-orange-500 mb-4" />, title: "Responsive Web Design", description: "Engage with hands-on projects and real-world applications in responsive web design." },
    { icon: <DollarSign className="w-10 h-10 text-orange-500 mb-4" />, title: "Best Pricing", description: "We specialize in building high-quality, budget-friendly websites tailored to your business needs." },
    { icon: <Settings className="w-10 h-10 text-orange-500 mb-4" />, title: "Website Maintenance", description: "Ensure smooth functionality and regular updates with our website maintenance services." },
    { icon: <ShoppingCart className="w-10 h-10 text-orange-500 mb-4" />, title: "E-Commerce Development", description: "Build a fully functional online store with a seamless user experience and secure payment gateways." },
    { icon: <Palette className="w-10 h-10 text-orange-500 mb-4" />, title: "Logo Creation", description: "Create unique, professional logos that represent your brand identity." },
    { icon: <GraduationCap className="w-10 h-10 text-orange-500 mb-4" />, title: "Student Portfolio", description: "Showcase your skills and achievements with a personalized student portfolio website." },
    { icon: <BookOpen className="w-10 h-10 text-orange-500 mb-4" />, title: "Education Web Portals", description: "Develop educational platforms for schools, colleges, and learning institutions." },
    { icon: <Briefcase className="w-10 h-10 text-orange-500 mb-4" />, title: "Business Web Management", description: "Manage and optimize your business website with our expert solutions." }, // Fixed typo in className
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% of component is in view
      className="relative bg-black py-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 },
              }}
              className="relative bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700
                        hover:border-orange-500/50 transition-all duration-300
                        backdrop-blur-sm bg-opacity-80 group"
            >
              <div className="relative flex justify-center">
                {/* Glow effect behind icon */}
                <div className="absolute -inset-2 bg-orange-400/20 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white text-center mt-4">{service.title}</h3>
              <p className="text-gray-400 text-sm text-center">{service.description}</p>
              
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-xl p-0.5 bg-gradient-to-r from-orange-400/30 to-purple-500/30 opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 opacity-50 pointer-events-none" />

      {/* Animated background particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-orange-400/20 rounded-full"
          animate={{
            x: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
            ],
            y: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
            ],
            scale: [0, 1, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </motion.div>
  );
};

export default FloatingCards;