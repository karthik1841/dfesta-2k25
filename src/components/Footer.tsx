import { Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";

interface Member {
  id: string;
  name: string;
  role: string;
  phone: string;
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [students, setStudents] = useState<Member[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsQuery = query(
          collection(db, "students"),
          where("role", "==", "student")
        );
        
        const querySnapshot = await getDocs(studentsQuery);
        const studentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || '',
          role: doc.data().role || '',
          phone: doc.data().phone || ''
        }));

        setStudents(studentsData.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <footer className="bg-gray-600 text-black py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Instagram Link */}
          <div className="flex items-center space-x-3">
            <Instagram className="w-5 h-5 text-orange-500" />
            <a
              href="https://www.instagram.com/dfesta_25?igsh=MTdjNXR0eThkNTJvMQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:underline"
            >
              @dfesta
            </a>
          </div>

          {/* Students List */}
          <div className="flex flex-wrap justify-center gap-4">
            {students.map((student) => (
              <span key={student.id} className="text-black">
                {student.name} - <span className="text-orange-500">{student.phone}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-black mt-4 pt-4">
          <p className="text-center text-black">
            © {currentYear} D'Festa. All rights reserved.
          </p>
          <p className="text-sm text-orange-500 text-center">
            Designed by <span className="text-orange-500 font-medium ">JK ❤️</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
