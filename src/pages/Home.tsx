import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { collection, query, limit, getDocs, orderBy, onSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import jk1Image from '../images/jk1.jpg';
import jk3Image from "../images/jk3.jpg";
import jk4Image from "../images/jk4.jpg";
import jk5Image from "../images/jk5.jpg";
import jk6Image from "../images/jk6.jpg";
import jk8Image from "../images/jk8.jpg";
import jk9Image from "../images/jk9.jpg";
import jk10Image from "../images/jk10.jpg";

import '../index.css';

// Types
interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

interface Countdown {
  id: string;
  date: string;
  createdAt?: string;
}

// Animation variants (unchanged)
const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const countdownItemVariants: Variants = {
  animate: {
    y: [0, -5, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// CountdownTimer Component (unchanged)
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'countdowns'), (snapshot) => {
      if (snapshot.docs.length > 0) {
        const latestCountdown = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Countdown))
          .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())[0];
        
        const updateClock = () => {
          const now = new Date();
          const eventDate = new Date(latestCountdown.date);
          const diffMs = eventDate.getTime() - now.getTime();

          if (diffMs <= 0) {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
          }

          const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
          
          setTimeLeft({ days, hours, minutes, seconds });
        };

        updateClock();
        const timeinterval = setInterval(updateClock, 1000);
        return () => clearInterval(timeinterval);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="relative flex flex-col items-center gap-4 w-full px-4">
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        <motion.div 
          variants={countdownItemVariants}
          animate="animate"
          className="bg-gray-900/50 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded border border-orange-500/30 shadow-[0_0_15px_rgba(255,147,0,0.3)] min-w-[70px] text-center"
        >
          <span className="text-orange-500 text-lg sm:text-xl font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
          <div className="text-white/50 text-xs sm:text-sm">Days</div>
        </motion.div>
        <motion.div 
          variants={countdownItemVariants}
          animate="animate"
          className="bg-gray-900/50 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded border border-orange-500/30 shadow-[0_0_15px_rgba(255,147,0,0.3)] min-w-[70px] text-center"
        >
          <span className="text-orange-500 text-lg sm:text-xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
          <div className="text-white/50 text-xs sm:text-sm">Hours</div>
        </motion.div>
        <motion.div 
          variants={countdownItemVariants}
          animate="animate"
          className="bg-gray-900/50 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded border border-orange-500/30 shadow-[0_0_15px_rgba(255,147,0,0.3)] min-w-[70px] text-center"
        >
          <span className="text-orange-500 text-lg sm:text-xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <div className="text-white/50 text-xs sm:text-sm">Minutes</div>
        </motion.div>
        <motion.div 
          variants={countdownItemVariants}
          animate="animate"
          className="bg-gray-900/50 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded border border-orange-500/30 shadow-[0_0_15px_rgba(255,147,0,0.3)] min-w-[70px] text-center"
        >
          <span className="text-orange-500 text-lg sm:text-xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <div className="text-white/50 text-xs sm:text-sm">Seconds</div>
        </motion.div>
      </div>
    </div>
  );
};

// SpicedText Component (unchanged)
export const SpicedText = ({ targetDate }: { targetDate: string }) => {
  const currentYear = new Date().getUTCFullYear();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const suffix = 
      day % 10 === 1 && day !== 11 ? "st" :
      day % 10 === 2 && day !== 12 ? "nd" :
      day % 10 === 3 && day !== 13 ? "rd" : "th";
    return `${month} ${day}${suffix}`;
  };

  return (
    <div className="relative flex flex-col items-center justify-center gap-8 w-full">
      <CountdownTimer />
      <br/>
      <div className="flex items-center justify-center z-[0] w-full px-4 -mt-5">
        <p className="text-transform-uppercase letter-spacing-wide inline-block border-4 border-double border-white/30 border-t-4 border-b-4 py-6 px-0 w-full max-w-[60em] text-white/30 font-neuton text-sm sm:text-base text-center">
          Data Science
          <span className="block font-oswald font-bold text-4xl sm:text-6xl leading-none py-2 text-transparent bg-[url(https://i.ibb.co/RDTnNrT/animated-text-fill.png)] bg-repeat-y bg-clip-text animate-aitf text-shadow-glow transform-gpu backface-hidden">
            D'festa {currentYear}
          </span>
          —Data will talk to you if you're willing to listen—
        </p>
      </div>
      {targetDate && (
        <p className="text-white font-bold text-[15px]">
          <br />
          <br />
          On 
          <br />
          <span className="text-orange-500 text-[30px]">{formatDate(targetDate)}</span>
        </p>
      )}
    </div>
  );
};

// SpicedText1 Component (unchanged)
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

// ImageSlideshow Component (unchanged)
const ImageSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    jk1Image,
    jk3Image,
    jk4Image,
    jk5Image,
    jk6Image,
    jk8Image,
    jk9Image,
    jk10Image
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="relative py-10 sm:py-20 bg-black/100"
    >
      <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">Our Memories</h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">An Adventurous Journey with D'Festa</p>
        </div>
        
        <div className="relative w-full max-w-full sm:max-w-3xl mx-auto">
          <div className="overflow-hidden box-shadow rounded-xl shadow-xl aspect-w-16 aspect-h-9 sm:aspect-h-10">
            {slides.map((slide, index) => (
              <motion.img
                key={index}
                src={slide}
                alt={`Slide ${index + 1}`}
                className="w-full h-auto sm:h-[300px] md:h-[400px] object-contain sm:object-cover shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: currentSlide === index ? 1 : 0,
                  transition: { duration: 0.5 }
                }}
                style={{ position: currentSlide === index ? 'relative' : 'absolute', top: 0 }}
              />
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {slides.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full cursor-pointer ${
                  currentSlide === index ? 'bg-orange-500' : 'bg-gray-500'
                }`}
                whileHover={{ scale: 1.2 }}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Home Component with Fixed Type Handling
export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetDate, setTargetDate] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'countdowns'), (snapshot) => {
      if (snapshot.docs.length > 0) {
        const latestCountdown = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Countdown))
          .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())[0];
        
        setTargetDate(latestCountdown.date);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const coursesQuery = query(collection(db, 'programs'), orderBy('createdAt', 'desc'), limit(3));
        const coursesSnapshot = await getDocs(coursesQuery);
        const coursesData: Course[] = coursesSnapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData; // Explicitly type as DocumentData
          return {
            id: doc.id,
            title: data.title || '', // Provide fallback if field is missing
            description: data.description || '',
            imageUrl: data.imageUrl || '',
            category: data.category || '',
          };
        });
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
      // Login status check logic here if needed
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
            <SpicedText targetDate={targetDate} />
          </div>
        </motion.div>
        
        <div className="absolute bottom-2 right-2 flex items-center text-sm font-medium">
          <p className="text-orange-500">
            Scroll Down
            <ArrowDown className="ml-1 w-4 h-4 inline" />
          </p>
        </div>
      </section>

      {/* Image Slideshow Section */}
      <ImageSlideshow />

      {/* Events Section */}
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