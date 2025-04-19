import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    // Fetch programs from the backend
    // Replace this with actual API call
    setPrograms([
      { id: '1', name: 'Program 1' },
      { id: '2', name: 'Program 2' },
      { id: '3', name: 'Program 3' },
    ]);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {programs.map((program) => (
        <motion.div
          key={program.id}
          whileHover={{ y: -5 }}
          className="bg-gray-700 rounded-lg shadow p-6 border border-gray-600 cursor-pointer"
          onClick={() => navigate(`/course/${program.id}`)}
        >
          {program.name}
        </motion.div>
      ))}
    </div>
  );
};

export default Projects; 