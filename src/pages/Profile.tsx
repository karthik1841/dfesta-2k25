import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, BookOpen, Award, Clock, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigate('/');
          return;
        }

        setError(null);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
        if (!userDoc.exists()) {
          setError('User profile not found');
          return;
        }

        setUser({ id: userDoc.id, ...userDoc.data() });

        // Fetch enrolled courses
        const enrollmentsSnapshot = await getDocs(
          query(collection(db, 'enrollments'), where('userId', '==', currentUser.uid))
        );
        
        const enrollmentData = enrollmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Fetch course details for each enrollment
        const coursePromises = enrollmentData.map(async (enrollment) => {
          try {
            const courseDoc = await getDoc(doc(db, 'programs', enrollment.courseId));
            if (!courseDoc.exists()) {
              console.warn(`Course ${enrollment.courseId} not found`);
              return null;
            }
            return {
              ...courseDoc.data(),
              id: courseDoc.id,
              progress: enrollment.progress,
              enrollmentId: enrollment.id,
              enrolledAt: enrollment.enrolledAt
            };
          } catch (err) {
            console.error(`Error fetching course ${enrollment.courseId}:`, err);
            return null;
          }
        });

        const enrolledCoursesData = (await Promise.all(coursePromises))
          .filter(course => course !== null);
        
        setEnrolledCourses(enrolledCoursesData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load profile data');
        if (!isOffline) {
          toast.error('Failed to load profile data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, isOffline]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">User not found</h2>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      {isOffline && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
            <div className="flex items-center">
              <WifiOff className="h-5 w-5 text-yellow-400 mr-2" />
              <p className="text-sm text-yellow-700">
                You are currently offline. Some features may be limited.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Profile Header */}
          <motion.div
            variants={item}
            className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
          >
            <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
              <div className="absolute -bottom-12 left-8">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <User className="w-12 h-12 text-gray-600" />
                </div>
              </div>
            </div>
            <div className="pt-16 pb-8 px-8">
              <h1 className="text-3xl font-bold mb-2">{user.fullName}</h1>
              <p className="text-gray-600">{user.role}</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Information */}
            <div className="lg:col-span-1">
              <motion.div
                variants={item}
                className="bg-white rounded-xl shadow-lg p-6 mb-8"
              >
                <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-3" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-3" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={item}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold mb-4">Learning Stats</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <BookOpen className="w-5 h-5 mr-3" />
                      <span>Courses Enrolled</span>
                    </div>
                    <span className="font-semibold">{enrolledCourses.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Award className="w-5 h-5 mr-3" />
                      <span>Certificates Earned</span>
                    </div>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-3" />
                      <span>Hours Learned</span>
                    </div>
                    <span className="font-semibold">0</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Enrolled Courses */}
              <motion.div
                variants={item}
                className="bg-white rounded-xl shadow-lg p-6 mb-8"
              >
                <h2 className="text-xl font-bold mb-4">Enrolled Courses</h2>
                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
                    <Button
                      onClick={() => navigate('/programs')}
                      className="mt-4"
                    >
                      Browse Courses
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    variants={container}
                    className="space-y-4"
                  >
                    {enrolledCourses.map((course) => (
                      <motion.div
                        key={course.id}
                        variants={item}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-lg shadow p-6 border"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">{course.title}</h3>
                          <span className="text-sm text-gray-500">
                            Enrolled on {new Date(course.enrolledAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                        <Button
                          onClick={() => navigate(`/programs/${course.id}`)}
                          variant="outline"
                          className="w-full"
                        >
                          Continue Learning
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>

              {/* Achievements */}
              <motion.div
                variants={item}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold mb-4">Achievements</h2>
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Complete courses to earn achievements!</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}