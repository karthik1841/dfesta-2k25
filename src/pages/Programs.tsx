import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface Course {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
  description: string;
}

export default function Programs() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'programs'));
        const coursesData: Course[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Course[];

        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
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
        >
          <h1 className="text-4xl font-bold mb-8 text-orange-400">Our Events</h1>
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
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-gray-900/90 backdrop-blur-sm rounded-full 
                                     text-sm font-medium text-orange-400 border border-yellow-400/30">
                        {course.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-white">{course.title}</h3>
                    <p className="text-gray-400 mb-2 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex space-x-2">
                        <Link to={`/projects/${course.id}`} state={{ course }}>
                          <Button 
                            variant="outline" 
                            className="border-gray-600 text-gray-300 hover:text-orange-400 
                                     hover:border-orange-400"
                          >
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
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
