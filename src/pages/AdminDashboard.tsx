import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, FileText, Bell, CheckCircle, Upload, Edit, Trash2, Download, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth, db, storage } from '@/lib/firebase';
import { collection, query, getDocs, updateDoc, doc, addDoc, deleteDoc, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import { image } from 'framer-motion/client';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    category: '',
    image: '',
    excerpt: '',
    price: '',
    websiteLink: '',
    resources: [{ title: '', url: '', type: '' }],

    tags: []
  });
  const [programs, setPrograms] = useState([]);
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [newProgram, setNewProgram] = useState({
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

      if (!userDoc.docs[0]?.data()?.role === 'faculty') {
        navigate('/');
      }
    };

    checkAdmin();
  }, [navigate]);

  const fetchUsers = async () => {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(usersData);
  };

  const fetchBlogs = async () => {
    const blogsRef = collection(db, 'blogs');
    const snapshot = await getDocs(blogsRef);
    const blogsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setBlogs(blogsData);
  };

  const fetchPrograms = async () => {
    const programsRef = collection(db, 'programs');
    const snapshot = await getDocs(programsRef);
    const programsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPrograms(programsData);
  };

  const fetchNotifications = async () => {
    const notificationsRef = collection(db, 'contacts');
    const snapshot = await getDocs(notificationsRef);
    const notificationsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNotifications(notificationsData);
  };

  useEffect(() => {
    fetchUsers();
    fetchBlogs();
    fetchPrograms();
    fetchNotifications();
  }, []);

  const handleVerifyUser = async (userId, isVerified) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { verified: isVerified });
    fetchUsers();
  };
  const handleImageUpload = async (file) => {
    if (!file) return '';
    const storageRef = ref(storage, `program-images/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };
  const handleAddBlog = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'blogs'), {
        ...newBlog,
        author: auth.currentUser?.email,
        createdAt: new Date().toISOString()
      });
      toast.success('Blog post added successfully!');
      setShowAddBlog(false);
      setNewBlog({
        title: '',
        content: '',
        category: '',
        image: '',
        excerpt: '',
        price: '',
        websiteLinks: '',
        tags: [],
      });
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to add blog post');
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteDoc(doc(db, 'blogs', blogId));
        toast.success('Blog post deleted successfully!');
        fetchBlogs();
      } catch (error) {
        toast.error('Failed to delete blog post');
      }
    }
  };

  const handleAddProgram = async (e) => {
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

  const handleDeleteProgram = async (programId) => {
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
              
              { id: 'programs', icon: FileText, label: 'events' }
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

            {activeTab === 'blogs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Services Management</h2>
                  <Button onClick={() => setShowAddBlog(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </div>

                {showAddBlog && (
                  <div className="mb-6">
                    <form onSubmit={handleAddBlog} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Service Title"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                        value={newBlog.title}
                        onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                        required
                      />
                      <input
                        type="file" // Changed from type="image"
                        accept="image/*"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                        onChange={(e) => setImageFile(e.target.files[0])}
                      />
                      <textarea
                        placeholder="Service Content"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 h-32"
                        value={newBlog.content}
                        onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Category"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                        value={newBlog.category}
                        onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Registration Price"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                        value={newBlog.price}
                        onChange={(e) => setNewBlog({ ...newBlog, price: e.target.value })} // Fixed from title
                        required
                      />
                      <input
                        type="text"
                        placeholder="Website Link"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                        value={newBlog.websiteLink} // Fixed from newProgram.websiteLinks
                        onChange={(e) => setNewBlog({ ...newBlog, websiteLink: e.target.value })} // Fixed from newProgram
                        required
                      />
                      <div className="flex justify-end space-x-4">
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-gray-300 hover:text-white"
                          onClick={() => setShowAddBlog(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-yellow-400 text-gray-900 hover:bg-yellow-500">
                          Add Service
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blogs.map((blog) => (
                    <motion.div
                      key={blog.id}
                      whileHover={{ y: -5 }}
                      className="bg-gray-700 rounded-lg shadow p-6 border border-gray-600"
                    >
                      <h3 className="text-lg font-bold mb-2 text-white">{blog.title}</h3>
                      <p className="text-gray-300 mb-4">{blog.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-400 font-semibold">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            className="text-gray-300 hover:text-white"
                            onClick={() => handleDeleteBlog(blog.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            className="text-gray-300 hover:text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'programs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Program Management</h2>
                  <Button onClick={() => setShowAddProgram(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Add event
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
                        required />








                      <div className="flex justify-end space-x-4">
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-gray-300 hover:text-white"
                          onClick={() => setShowAddProgram(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-yellow-400 text-gray-900 hover:bg-yellow-500">Add Program</Button>
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
                      <p className="text-gray-300 mb-4">Website: <a href={program.websiteLink} target="_blank" rel="noopener noreferrer">{program.websiteLink}</a></p>
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

            {activeTab === 'notifications' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Notifications</h2>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        whileHover={{ y: -5 }}
                        className="bg-gray-700 rounded-lg shadow p-6 border border-gray-600"
                      >
                        <h3 className="text-lg font-bold mb-2 text-white">{notification.name}</h3>
                        <p className="text-gray-300 mb-4">{notification.email}</p>
                        <p className="text-gray-300 mb-4">{notification.message}</p>
                        <span className="text-gray-500 text-sm">

                        </span>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-400">No notifications available.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}