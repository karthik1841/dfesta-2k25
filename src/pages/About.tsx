import { motion } from 'framer-motion';
import {  BookOpen, Users, Award } from 'lucide-react';

import { useState } from 'react';


export default function About() {
  const [successMessage ] = useState('');

  const stats = [
    { icon: BookOpen, label: 'Projects', value: '20+' },
    { icon: Users, label: 'Conference Paper', value: '20+' },
    { icon: Award, label: 'Success Rate', value: '100%' }
  ];

  const team = [
    { name: 'Dr S.Kusuma', role: 'HOD' },
    { name: 'Dr M.Kiran Kumar', role: 'co-ordinator' },
    { name: 'B.Vidhya Sree', role: 'convenor ' }
    
  ];

  


  return (
    <div className="py-12 bg-[#0d1219] text-gray-200 min-h-screen">
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-gray-900 p-4 rounded shadow-lg">
          {successMessage}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6 text-orange-400">Our Mission</h1>
            <p className="text-xl text-white-400 max-w-3xl mx-auto">
              At D'Festa, we empower students with high-quality knowledge, bridging innovation and accessibility.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat) => (
              <motion.div key={stat.label} whileHover={{ y: -5 }} className="bg-gray-600 p-6 rounded-xl shadow-lg text-center border border-gray-800 hover:border-orange-500/50 transition-colors duration-300">
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                <div className="text-3xl font-bold mb-2 text-black">{stat.value}</div>
                <div className="text-white-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-orange-500">Our Head</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member) => (
                <motion.div key={member.name} whileHover={{ y: -5 }} className="bg-gray-600 rounded-xl shadow-lg overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-colors duration-300">
                  
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-2 text-black">{member.name}</h3>
                    <p className="text-orange-400">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
        </motion.div>
      </div>
    </div>
  );
}
