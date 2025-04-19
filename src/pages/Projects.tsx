import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
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

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const programsRef = collection(db, 'programs');
        const programsSnap = await getDocs(programsRef);
        const programsData = programsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Program[];
        setPrograms(programsData);
      } catch (error) {
        console.error('Error fetching programs:', error);
        toast.error('Failed to fetch programs');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1219] pt-16 flex items-center justify-center">
        <div className="text-orange-500 text-xl">Loading...</div>
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
};

export default Projects; 