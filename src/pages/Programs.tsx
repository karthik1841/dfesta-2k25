import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Users, Star, Video, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import toast from 'react-hot-toast';

export default function Programs() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'programs'));
        const enrollmentsSnapshot = await getDocs(collection(db, 'enrollments'));
        const ratingsSnapshot = await getDocs(collection(db, 'ratings'));

        const enrollments = enrollmentsSnapshot.docs.map(doc => doc.data());
        const ratings = ratingsSnapshot.docs.map(doc => doc.data());

        const coursesData = querySnapshot.docs.map(doc => {
          const courseId = doc.id;
          const studentCount = enrollments.filter(e => e.courseId === courseId).length;
          const courseRatings = ratings.filter(r => r.courseId === courseId);
          const averageRating = courseRatings.length > 0
            ? (courseRatings.reduce((acc, curr) => acc + curr.rating, 0) / courseRatings.length).toFixed(1)
            : 0;

          return {
            id: courseId,
            ...doc.data(),
            students: studentCount,
            rating: averageRating
          };
        });

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

  const fetchVideoUrl = async (courseId) => {
    // Placeholder: Implement this based on how videos are stored
    // For now, assuming videoContent[0].url is available in the program data
    const course = courses.find(c => c.id === courseId);
    return course?.videoContent?.[0]?.url || ''; // Default to empty string if no video
  };

  const handleEnroll = async (courseId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please login to enroll in courses');
        navigate('/login');
        return;
      }

      const enrollmentsRef = collection(db, 'enrollments');
      const enrollmentQuery = await getDocs(enrollmentsRef);
      const existingEnrollment = enrollmentQuery.docs.find(
        doc => doc.data().userId === user.uid && doc.data().courseId === courseId
      );

      if (existingEnrollment) {
        toast.error('You are already enrolled in this course');
        return;
      }

      await addDoc(collection(db, 'enrollments'), {
        userId: user.uid,
        courseId: courseId,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        status: 'active'
      });

      const videoUrl = await fetchVideoUrl(courseId);
      const course = courses.find(c => c.id === courseId);
      setSelectedVideo({
        url: videoUrl,
        title: course.videoContent?.[0]?.title || 'Course Video',
        description: course.videoContent?.[0]?.description || 'Course introduction video',
        thumbnail: course.image || 'https://via.placeholder.com/150'
      });

      toast.success('Successfully enrolled in the course!');
      // navigate('/profile'); // Commented out to show video modal instead
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course');
    }
  };

  const handleRating = async (courseId, rating) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please login to rate this course');
        navigate('/login');
        return;
      }

      const ratingsRef = collection(db, 'ratings');
      const ratingQuery = await getDocs(ratingsRef);
      const existingRating = ratingQuery.docs.find(
        doc => doc.data().userId === user.uid && doc.data().courseId === courseId
      );

      if (existingRating) {
        toast.error('You have already rated this course');
        return;
      }

      await addDoc(collection(db, 'ratings'), {
        userId: user.uid,
        courseId: courseId,
        rating: rating,
        createdAt: new Date().toISOString()
      });

      toast.success('Thank you for rating!');
      window.location.reload();
    } catch (error) {
      console.error('Error rating course:', error);
      toast.error('Failed to submit rating');
    }
  };

  const VideoPreviewModal = ({ video, onClose }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl max-w-3xl w-full p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">{video.title}</h3>
          <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={onClose}>×</Button>
        </div>
        <div className="aspect-video rounded-lg overflow-hidden bg-black mb-4">
          <video
            src={video.url}
            controls
            className="w-full h-full"
            poster={video.thumbnail}
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <p className="text-gray-300">{video.description}</p>
      </div>
    </div>
  );

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
                    <div className="space-y-2 text-gray-300 text-sm">
                     
                        
                      
                    </div>
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
                      <div className="flex items-center text-orange-400 cursor-pointer">
                        
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {selectedVideo && (
          <VideoPreviewModal
            video={selectedVideo}
            onClose={() => setSelectedVideo(null)}
          />
        )}
      </div>
    </div>
  );
}