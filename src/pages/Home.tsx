import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Globe, Sparkles, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import '../index.css'; // Import the CSS file

// Add types directly in the file
interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}



// Define animation variants
const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Define CardSection props interface
interface CardSectionProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const CardSection: React.FC<CardSectionProps> = ({ icon: Icon, title, description }) => (
  <motion.div
    variants={item}
    whileHover={{ y: -10 }}
    className="bg-black/95-1000 rounded-xl p-6 shadow-xl border border-gray-700 hover:border-gray-600 transition-colors duration-300"
  >
    <Icon className="w-10 h-10 text-orange-600 mb-4" />
    <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);

// New SpicedText component with CSS animation
export const SpicedText = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-[-1]">
      <p className="text-transform-uppercase letter-spacing-wide inline-block border-4 border-double border-white/25 border-t-4 border-b-4 py-6 px-0 w-[60em] text-white/25 font-neuton text-base text-center">
        Data Science
        <span className="block font-oswald font-bold text-6xl leading-none py-2 text-transparent bg-[url(https://i.ibb.co/RDTnNrT/animated-text-fill.png)] bg-repeat-y bg-clip-text animate-aitf text-shadow-glow transform-gpu backface-hidden">
          D'festa
        </span>
        —Data will talk to you if you're willing to listen—
      </p>
    </div>
  );
};
//𝓓'𝓕𝓮𝓼𝓽𝓪
export const SpicedText1 = () => {
  return (
    <div className="absolute top-0 left-0 flex items-center justify-start z-[-1] p-4">
      <p className="text-white/25 text-lg font-light">
        <span className="block font-bold text-3xl leading-none text-transparent bg-[url(https://i.ibb.co/RDTnNrT/animated-text-fill.png)] bg-repeat-y bg-clip-text animate-aitf">

          𝓓'𝓕𝓮𝓼𝓽𝓪
        </span>
      </p>
    </div>
  );
};




export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const coursesQuery = query(collection(db, 'programs'), orderBy('createdAt', 'desc'), limit(3));
        const coursesSnapshot = await getDocs(coursesQuery);
        const coursesData = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Course[];
        setFeaturedCourses(coursesData);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    const checkLoginStatus = () => {
    
      
      
    };
    checkLoginStatus();
  }, []);

  return (
    <div className="bg-black/95 min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full"
        >
          <div className="max-w-3xl mx-auto text-center">
            <SpicedText />
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative py-20 bg-black/100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
            <p className="text-gray-400 text-lg">Advanced data solutions for modern businesses</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CardSection icon={Globe} title="Data Visualization" description="Transform complex data into intuitive interactive dashboards and visual insights for better decision-making." />
            <CardSection icon={Sparkles} title="Machine Learning" description="Custom ML solutions including predictive analytics, pattern recognition, and automated decision systems." />
            <CardSection icon={Award} title="Data Analytics" description="Comprehensive data analysis services including statistical modeling, trend analysis, and business intelligence." />
          </div>
        </div>
      </motion.div>

      {/* Projects Section - Always shown */}
      <section className="py-20 bg-gray-60">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-orange-600">Events</h2>
            <p className="text-xl text-white max-w-2xl mx-auto">Discover our most popular Events and start your experience today.</p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray/60"></div>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 md:px-8"
            >
              {featuredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  variants={item}
                  whileHover={{ y: -5 }}
                  className="bg-[#0d1219] rounded-2xl shadow-lg overflow-hidden transition-transform duration-300"
                >
                  <div className="relative">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-56 sm:h-48 md:h-52 lg:h-56 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-gray-80 text-orange-500 text-sm font-medium rounded-full">
                        {course.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">{course.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between mb-4">


                    </div>
                    <Link to={`projects/${course.id}`}>
                      <Button className="w-full bg-orange-600 hover:bg-orange-500 transition-colors">
                        View Event <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </section>
    </div>
  );
}