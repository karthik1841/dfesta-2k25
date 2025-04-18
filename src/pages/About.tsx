import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore'; 
import toast from 'react-hot-toast';
import { db } from '@/lib/firebase';
import { useState, useEffect } from 'react';

interface Student {
  id: string;
  name: string;
  role: string;
  info: string;
  phone?: string;
  priority?: number;
}

interface CoordinatorStudent {
  id: string;
  name: string;
  info: string;
  priority?: number;
  createdAt?: string;
}

export default function About() {
  const [faculty, setFaculty] = useState<Student[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [coordinatorStudents, setCoordinatorStudents] = useState<CoordinatorStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch students
        const studentsRef = collection(db, 'students');
        const studentsSnapshot = await getDocs(studentsRef);
        
        const studentsData = studentsSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || '',
          role: doc.data().role || '',
          info: doc.data().info || '',
          phone: doc.data().phone || '',
          priority: doc.data().priority || 0
        }));

        // Filter based on role
        const facultyData = studentsData.filter(member => 
          member.role.toLowerCase().includes('faculty')
        );
        
        const studentData = studentsData.filter(member => 
          member.role.toLowerCase().includes('student')
        );
        
        // Sort faculty by priority (lower number has higher priority)
        const sortedFaculty = facultyData.sort((a, b) => {
          const priorityA = a.priority || 0;
          const priorityB = b.priority || 0;
          return priorityA - priorityB;
        });
        
        // Sort students by priority (lower number has higher priority)
        const sortedStudents = studentData.sort((a, b) => {
          const priorityA = a.priority || 0;
          const priorityB = b.priority || 0;
          return priorityA - priorityB;
        });
        
        setFaculty(sortedFaculty);
        setStudents(sortedStudents);

        // Fetch coordinator students
        const coordinatorsRef = collection(db, 'coordinatorStudents');
        const coordinatorsSnapshot = await getDocs(coordinatorsRef);
        const coordinatorsData = coordinatorsSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || '',
          info: doc.data().info || '',
          priority: doc.data().priority || 0,
          createdAt: doc.data().createdAt || ''
        }));
        
        // Sort coordinators by priority (lower number has higher priority), then by creation date
        const sortedCoordinators = coordinatorsData.sort((a, b) => {
          const priorityA = a.priority || 0;
          const priorityB = b.priority || 0;
          
          // First sort by priority (lower number has higher priority)
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          
          // If priorities are equal, sort by creation date
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        
        setCoordinatorStudents(sortedCoordinators);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-white">Loading data...</p>;
  }

  return (
    <div className="py-12 bg-[#0d1219] text-gray-200 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6 text-orange-500">Our Vision</h1>
            <p className="text-xl text-white-400 max-w-3xl mx-auto">
              Established in 2020, the Department of Computer Science and Engineering - Data Science offers a 4-year B. Tech. in Data Science, featuring a dynamic curriculum focused on Data Science and industry-ready technologies.
            </p>
          </div>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-orange-500">About D'FESTA</h2>
            <p className="text-xl text-white-400 max-w-3xl mx-auto">
              DFESTA (Data Science Festival) is an annual event by the CSE-DS Department, celebrating advancements in Data Science. It features technical workshops, hackathons, project showcases, expert talks, paper presentations, and networking opportunities, fostering innovation and collaboration among students, faculty, and industry professionals.
            </p>
          </div>

          {/* Faculty Section */}
          {faculty.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center text-orange-500">Faculty</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {faculty.map((member) => (
                  <motion.div key={member.id} whileHover={{ y: -5 }} className="bg-gray-600 rounded-xl shadow-lg overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-colors duration-300">
                    <div className="p-6 text-center">
                      <h3 className="text-xl text-white font-bold mb-2">{member.name}</h3>
                      <p className="text-orange-400 mb-2">{member.info}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Student Section */}
          {students.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center text-orange-500">Student Committee</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {students.map((member) => (
                  <motion.div key={member.id} whileHover={{ y: -5 }} className="bg-gray-600 rounded-xl shadow-lg overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-colors duration-300">
                    <div className="p-6 text-center">
                      <h3 className="text-xl text-white font-bold mb-2">{member.name}</h3>
                      <p className="text-orange-400 mb-2">{member.info}</p>
                      <p className="text-gray-300 text-sm">📞 {member.phone}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Coordinator Students Section */}
          {coordinatorStudents.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center text-orange-500">Student Coordinators</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {coordinatorStudents.map((coordinator) => (
                  <motion.div 
                    key={coordinator.id} 
                    whileHover={{ y: -5 }} 
                    className="bg-gray-600 rounded-xl shadow-lg overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-colors duration-300"
                  >
                    <div className="p-6 text-center">
                      <h3 className="text-xl text-white font-bold mb-2">{coordinator.name}</h3>
                      <p className="text-orange-400 mb-2">{coordinator.info}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
