import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Programs from './pages/Programs';
import Blogs from './pages/Blogs';
import About from './pages/About';
import CourseDetail from './pages/CourseDetail';
import BlogDetail from './pages/BlogDetail';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import CourseDetails2 from './pages/CourseDetails2';

import { useEffect, useState } from 'react';
import { auth, db } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

function App() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      try {
        if (user) {
          console.log('Logged in user:', user);

          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.exists() ? userDoc.data() : null;

          const isUserAdmin =
            userData?.role?.toLowerCase?.() === 'admin' ||
            user.email?.toLowerCase() === 'dfesta2k25@gmail.com';

          setIsAdmin(isUserAdmin);
          console.log('Is Admin:', isUserAdmin);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar isAdmin={isAdmin} />
        <div className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/projects" element={<CourseDetail />} />
            <Route path="/projects/:id" element={<CourseDetail />} />
            <Route path="/services" element={<Blogs />} />
            <Route path="/services/:id" element={<BlogDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
<<<<<<< HEAD
            {isAdmin && <Route path="/admin" element={<AdminDashboard />} />}
            <Route path="*" element={<NotFound />} />
=======
            <Route path="/course-details-2" element={<CourseDetails2 />} />
            <Route
              path="/admin"
              element={isAdmin ? <AdminDashboard /> : <div>Not Authorized</div>}
            />
>>>>>>> 734e508 (ds)
          </Routes>
        </div>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;
