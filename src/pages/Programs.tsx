import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link} from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

// Define the Course interface
interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

export default function Programs() {
  // Add type annotation for the courses state
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'programs'));
        const coursesData: Course[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          title: doc.data().title || 'Untitled',
          description: doc.data().description || 'No description available',
          imageUrl: doc.data().imageUrl || 'https://via.placeholder.com/150',
          category: doc.data().category || 'Uncategorized'
        } as Course)); // Type assertion to ensure it matches Course interface

        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1219] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h1 className="text-4xl font-bold text-orange-400">Our Events</h1>
          
          {courses.length === 0 ? (
            <p className="text-center text-orange-400 py-8">No programs available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <motion.div
                  key={course.id}
                  whileHover={{ y: -5 }}
                  className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700
                            hover:border-yellow-500/50 transition-all duration-300"
                >
                  <div className="relative group">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-48 object-cover transition-transform duration-300 
                               group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-gray-900/90 backdrop-blur-sm rounded-full 
                                     text-sm font-medium text-orange-400 border border-yellow-400/30">
                        {course.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-white line-clamp-1">{course.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2 min-h-[3rem]">{course.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <Link to={`/projects/${course.id}`} state={{ course }}>
                        <Button
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:text-orange-400 
                                   hover:border-orange-400 transition-colors"
                        >
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        
      </div>
    </div>
  );
}