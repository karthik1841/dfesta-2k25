import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowLeft, Calendar, Users, DollarSign, Globe, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface Program {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  websiteLink: string;
  imageUrl: string;
  studentCoordinator: string;
  facultyCoordinator: string;
  createdAt?: string;
  createdBy?: string;
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          // Fetch single program
          const programRef = doc(db, 'programs', id);
          const programSnap = await getDoc(programRef);

          if (programSnap.exists()) {
            setProgram({
              id: programSnap.id,
              ...programSnap.data()
            } as Program);
          } else {
            toast.error('Program not found');
            navigate('/projects');
          }
        } else {
          // Fetch all programs
          const programsRef = collection(db, 'programs');
          const programsSnap = await getDocs(programsRef);
          const programsData = programsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Program[];
          setPrograms(programsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data');
        if (id) {
          navigate('/projects');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1219] pt-16 flex items-center justify-center">
        <div className="text-orange-500 text-xl">Loading...</div>
      </div>
    );
  }

  if (id && program) {
    return (
      <div className="min-h-screen bg-[#0d1219] pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/projects')}
              className="mb-6 text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Programs
            </Button>

            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  {program.imageUrl && (
                    <img
                      src={program.imageUrl}
                      alt={program.title}
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                  )}
                  <h1 className="text-3xl font-bold text-white mb-4">{program.title}</h1>
                  <p className="text-gray-300 mb-6">{program.description}</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold text-orange-400 mb-4">Program Details</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-orange-400 mr-3 mt-1" />
                        <div>
                          <h3 className="text-lg font-semibold text-orange-400 mb-1">Category</h3>
                          <p className="text-gray-300">{program.category}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <DollarSign className="w-5 h-5 text-orange-400 mr-3 mt-1" />
                        <div>
                          <h3 className="text-lg font-semibold text-orange-400 mb-1">Price</h3>
                          <p className="text-gray-300">{program.price}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <User className="w-5 h-5 text-orange-400 mr-3 mt-1" />
                        <div>
                          <h3 className="text-lg font-semibold text-orange-400 mb-1">Student Coordinator</h3>
                          <p className="text-gray-300">{program.studentCoordinator}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Users className="w-5 h-5 text-orange-400 mr-3 mt-1" />
                        <div>
                          <h3 className="text-lg font-semibold text-orange-400 mb-1">Faculty Coordinator</h3>
                          <p className="text-gray-300">{program.facultyCoordinator}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => {
                      if (program.websiteLink) {
                        window.open(program.websiteLink, '_blank', 'noopener,noreferrer');
                      } else {
                        toast.error('No registration link available');
                      }
                    }}
                  >
                    Register Now
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1219] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">All Programs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <motion.div
              key={program.id}
              whileHover={{ y: -5 }}
              className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 cursor-pointer"
              onClick={() => navigate(`/projects/${program.id}`)}
            >
              {program.imageUrl && (
                <img
                  src={program.imageUrl}
                  alt={program.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-xl font-bold text-white mb-2">{program.title}</h2>
              <p className="text-gray-300 mb-4 line-clamp-2">{program.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-orange-400 font-semibold">{program.price}</span>
                <span className="text-gray-400">{program.category}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}