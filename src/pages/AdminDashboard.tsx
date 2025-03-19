import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, FileText, CheckCircle, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth, db} from '@/lib/firebase';
import { collection, query, getDocs, updateDoc, doc, addDoc, deleteDoc, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Define types
interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  verified: boolean;
}



interface Program {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  category: string;
  level: string;
  aboutCourse: string;
  learningObjectives: string;
  videoContent: { title: string; url: string; description: string }[];
  syllabus: { week: string; topic: string; content: string }[];
  assignments: { title: string; description: string; dueDate: string }[];
  resources: { title: string; url: string; type: string }[];
  websiteLink: string;
  imageUrl: string;
  createdAt?: string;
  createdBy?: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>('users');
  const [users, setUsers] = useState<User[]>([]);
  
  
  const [programs, setPrograms] = useState<Program[]>([]);
  const [showAddProgram, setShowAddProgram] = useState<boolean>(false);
  const [newProgram, setNewProgram] = useState<Program>({
    id: '',
    title: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    level: 'beginner',
    aboutCourse: '',
    learningObjectives: '',
    videoContent: [{ title: '', url: '', description: '' }],
    syllabus: [{ week: '', topic: '', content: '' }],
    assignments: [{ title: '', description: '', dueDate: '' }],
    resources: [{ title: '', url: '', type: '' }],
    websiteLink: '',
    imageUrl: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/');
        return;
      }

      const userDoc = await getDocs(query(
        collection(db, 'users'),
        where('email', '==', user.email)
      ));

      if (userDoc.docs[0]?.data()?.role === 'faculty') {
        navigate('/');
      }
    };

    checkAdmin();
  }, [navigate]);

  const fetchUsers = async () => {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    const usersData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as User));
    setUsers(usersData);
  };

 

  const fetchPrograms = async () => {
    const programsRef = collection(db, 'programs');
    const snapshot = await getDocs(programsRef);
    const programsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Program));
    setPrograms(programsData);
  };

  useEffect(() => {
    fetchUsers();
    
    fetchPrograms();
  }, []);

  const handleVerifyUser = async (userId: string, isVerified: boolean) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { verified: isVerified });
    fetchUsers();
  };


  

  const handleAddProgram = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'programs'), {
        ...newProgram,
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser?.email
      });
      toast.success('Program added successfully!');
      setShowAddProgram(false);
      setNewProgram({
        id: '',
        title: '',
        description: '',
        price: '',
        duration: '',
        category: '',
        level: 'beginner',
        aboutCourse: '',
        learningObjectives: '',
        videoContent: [{ title: '', url: '', description: '' }],
        syllabus: [{ week: '', topic: '', content: '' }],
        assignments: [{ title: '', description: '', dueDate: '' }],
        resources: [{ title: '', url: '', type: '' }],
        websiteLink: '',
        imageUrl: ''
      });
      fetchPrograms();
    } catch (error) {
      toast.error('Failed to add program');
    }
  };

  const handleDeleteProgram = async (programId: string) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await deleteDoc(doc(db, 'programs', programId));
        toast.success('Program deleted successfully!');
        fetchPrograms();
      } catch (error) {
        toast.error('Failed to delete program');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1219] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl text-orange-500 font-bold">Admin Dashboard</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { icon: Users, title: 'Total Users', value: users.length },
              { icon: BookOpen, title: 'Total Projects', value: programs.length },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
              >
                <stat.icon className="w-8 h-8 text-orange-400 mb-4" />
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                <p className="text-gray-400">{stat.title}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'users', icon: Users, label: 'Users' },
              { id: 'programs', icon: FileText, label: 'Events' }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.id)}
                className={`${activeTab === tab.id
                    ? 'bg-orange-500 text-white-900 hover:bg-orange-500'
                    : 'text-white-400 hover:text-white bg-orange-500 hover:bg-gray-700'
                  }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">User Management</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-200">
                                  {user.fullName}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-orange-400">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.verified
                                ? 'bg-green-900 text-green-300'
                                : 'bg-yellow-900 text-yellow-300'
                              }`}>
                              {user.verified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button
                              onClick={() => handleVerifyUser(user.id, !user.verified)}
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {user.verified ? 'Unverify' : 'Verify'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            

            {activeTab === 'programs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Program Management</h2>
                  <Button onClick={() => setShowAddProgram(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                </div>

                {showAddProgram && (
                  <div className="mb-6">
                    <form onSubmit={handleAddProgram} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Program Title"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                        value={newProgram.title}
                        onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Image URL"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                        value={newProgram.imageUrl}
                        onChange={(e) => setNewProgram({ ...newProgram, imageUrl: e.target.value })}
                      />
                      <textarea
                        placeholder="Program Description"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 h-32"
                        value={newProgram.description}
                        onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Category"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                        value={newProgram.category}
                        onChange={(e) => setNewProgram({ ...newProgram, category: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Website Link"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                        value={newProgram.websiteLink}
                        onChange={(e) => setNewProgram({ ...newProgram, websiteLink: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Price"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                        value={newProgram.price}
                        onChange={(e) => setNewProgram({ ...newProgram, price: e.target.value })}
                        required
                      />
                      <div className="flex justify-end space-x-4">
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-gray-300 hover:text-white"
                          onClick={() => setShowAddProgram(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-yellow-400 text-gray-900 hover:bg-yellow-500">
                          Add Program
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {programs.map((program) => (
                    <motion.div
                      key={program.id}
                      whileHover={{ y: -5 }}
                      className="bg-gray-700 rounded-lg shadow p-6 border border-gray-600"
                    >
                      <h3 className="text-lg font-bold mb-2 text-white">{program.title}</h3>
                      <p className="text-gray-300 mb-4">{program.description}</p>
                      <p className="text-gray-300 mb-4">Category: {program.category}</p>
                      <p className="text-gray-300 mb-4">
                        Website: <a href={program.websiteLink} target="_blank" rel="noopener noreferrer">{program.websiteLink}</a>
                      </p>
                      <div className="flex justify-between items-center">
                        <Button
                          variant="ghost"
                          className="text-gray-300 hover:text-white"
                          onClick={() => handleDeleteProgram(program.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}