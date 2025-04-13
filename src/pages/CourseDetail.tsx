import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Courses } from "./types";

export default function CourseDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialCourse = location.state?.course || null;

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [course, setCourse] = useState<Courses | null>(initialCourse);

  useEffect(() => {
    if (!initialCourse) {
      navigate("/programs");
    } else {
      setCourse(initialCourse);
      setLoading(false);
    }
  }, [initialCourse, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <Button
            onClick={() => navigate("/programs")}
            className="bg-orange-500 hover:bg-orange-600 text-gray-900"
          >
            Return to Event
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-900 min-h-screen">
      <div className="max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Title Box - Now Full Width on Laptop */}
          <motion.div
            className="relative z-10 bg-gray-800 text-white rounded-xl shadow-lg p-6 mb-4 
                      max-w-4xl lg:max-w-full mx-auto lg:w-full text-center border border-orange-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
          </motion.div>

          {/* Course Image - Now Wider in Laptop View */}
          <div className="relative h-80 md:h-[450px] lg:h-[500px] xl:h-[550px] rounded-xl overflow-hidden mb-8">
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex space-x-4 mb-8 overflow-x-auto">
            <Button
              variant={activeTab === "about" ? "default" : "ghost"}
              onClick={() => setActiveTab("about")}
              className={`${activeTab === "about"
                  ? "bg-orange-500 text-gray-900 hover:bg-orange-600"
                  : "text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700"
                }`}
            >
              About
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {activeTab === "about" && (
                <motion.div
                  className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700
                            hover:border-orange-500/50 transition-colors duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold mb-4 text-orange-400">About This Event</h2>
                  <p className="text-gray-300 mb-6">{course.aboutCourse || course.description}</p>
                  <p className="text-gray-300 mb-6">Price: {course.price}</p>
                  <p className="text-gray-300 mb-6">Category: {course.category}</p>
                </motion.div>
              )}
            </div>

            {/* Sidebar with Registration Button */}
            <div className="lg:col-span-1">
              <motion.div
                className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700
                          sticky top-4 hover:border-orange-500/50 transition-colors duration-300"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xl font-semibold text-orange-400 mb-4">Register Now</h3>
                <p className="text-gray-300 mb-6">Join this Event..</p>
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-gray-900"
                  onClick={() => window.open(course.websiteLink, "_blank", "noopener,noreferrer")}
                >
                  Register for Event
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
