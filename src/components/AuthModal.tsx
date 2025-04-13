import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import toast from 'react-hot-toast';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode: boolean;
}

export default function AuthModal({ isOpen, onClose, defaultMode }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(defaultMode);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    role: 'student'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!isLogin) {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match!');
          return;
        }

        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );

        // Create user document in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          verified: formData.role === 'student', // Auto-verify students
          createdAt: new Date().toISOString()
        });

        toast.success('Account created successfully!');
        
        
        if (formData.role === 'faculty') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();

        if (userData && userData.role === 'faculty') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        toast.success('Successfully logged in!');
      }
      
      onClose();
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phone: '',
        role: 'student'
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

<motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="relative z-[101] w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden mx-auto my-auto"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold-200 to-indigo-50 -z-10" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-300 rounded-full -translate-y-16 translate-x-16 opacity-30" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-300 rounded-full translate-y-16 -translate-x-16 opacity-30" />

            <div className="max-h-[80vh] overflow-y-auto p-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                  >
                    {isLogin ? (
                      <LogIn className="w-12 h-12 text-yellow-500" />
                    ) : (
                      <UserPlus className="w-12 h-12 text-yellow-500" />
                    )}
                  </motion.div>

                  <h2 className="text-4xl font-bold text-center mb-2 text-yellow-800">
                    {isLogin ? 'Welcome Back!' : 'Create Account'}
                  </h2>
                  <p className="text-gray-700 text-center mb-8">
                    {isLogin 
                      ? 'Sign in to access your account' 
                      : 'Join us and start learning today'}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4 w-full">
                    {!isLogin && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            required
                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors
                                     focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            required
                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors
                                     focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors
                                 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors
                                 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>

                    {!isLogin && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          required
                          className="block w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors
                                   focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                      </div>
                    )}

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button type="submit" className="w-full py-6 text-lg font-semibold bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                        {isLogin ? 'Login' : 'Sign Up'}
                      </Button>
                    </motion.div>
                  </form>

                  <p className="mt-6 text-center text-sm text-gray-600">
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-yellow-600 hover:text-yellow-500 font-medium transition-colors"
                    >
                      {isLogin ? 'Sign up' : 'Login'}
                    </button>
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}