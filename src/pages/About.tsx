import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, BookOpen, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useState } from 'react';
import kusuma from "../images/Kusuma.jpeg";

export default function About() {
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const message = event.target.message.value;

    try {
      await addDoc(collection(db, 'contacts'), {
        name,
        email,
        message,
        timestamp: Timestamp.fromDate(new Date())
      });
      setSuccessMessage('Message sent successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };


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
          <div className="bg-gray-600 rounded-xl shadow-lg p-8 border border-gray-800">
            <h2 className="text-3xl font-bold mb-8 text-center text-orange-400">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4"><MapPin className="w-6 h-6 text-orange-400" /><span >MITS,Madanapalle, AP 517325</span></div>
                <div className="flex items-center space-x-4"><Phone className="w-6 h-6 text-orange-400" /><span>+91 6302159229</span></div>
                <div className="flex items-center space-x-4"><Mail className="w-6 h-6 text-orange-400" /><span>Dfesta@gmail.com</span></div>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Your Name" className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-300" required />
                <input type="email" name="email" placeholder="Your Email" className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-300" required />
                <textarea name="message" placeholder="Your Message" rows={4} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-300" required />
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-400 text-gray-900 font-bold transition-colors duration-300">Send Message</Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
