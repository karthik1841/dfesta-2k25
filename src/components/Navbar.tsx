import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, User } from "lucide-react";
import { Button } from "./ui/button";
import AuthModal from "./AuthModal";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { SpicedText1 } from "../pages/Home";

export default function Navbar({ isAdmin }: { isAdmin: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Auto-close menu when clicking anywhere inside the navbar
  
  

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowProfileMenu(false);
      navigate("/");
      setIsOpen(false); // Ensure mobile menu closes on sign-out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/projects" },
    { name: "About Us", path: "/about" },
  ];

  return (
    <nav className="fixed w-full bg-black/95 backdrop-blur-md z-50 shadow-lg border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <span className="text-gray-300">
                <SpicedText1 />
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-7">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? "text-orange-500"
                    : "text-gray-300 hover:text-orange-500"
                } transition-all duration-200 hover:scale-105`}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                >
                  <User className="w-5 h-5" />
                  <span>{user.email?.split("@")[0]}</span>
                </Button>
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl py-2 z-50"
                    >
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-orange-400 transition-colors"
                          onClick={() => {
                            setShowProfileMenu(false);
                            setIsOpen(false); // Close menu when clicking
                          }}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-orange-400 transition-colors"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={() => {
                  setShowAuthModal(true);
                  setIsOpen(false); // Close menu when opening login modal
                }}
                className="flex items-center space-x-2 text-gray-300 hover:text-orange-400 hover:bg-gray-800 transition-all duration-200"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Button>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-orange-500 transition-colors focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
            ref={mobileMenuRef}
          >
            <div className="px-4 pt-4 pb-6 space-y-2 bg-[#0d1219] border-t border-gray-800 shadow-xl">
              {navItems.map((item) => (
                <motion.div key={item.name} whileHover={{ x: 10 }}>
                  <Link
                    to={item.path}
                    className="block px-3 py-2 rounded-md text-lg font-medium text-orange-300 hover:text-orange-400 hover:bg-gray-600 transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
             
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        defaultMode={true} 
      />
    </nav>
  );
}
