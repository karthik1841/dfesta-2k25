import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Star, BookOpen, Award, MessageSquare, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Editor from '@monaco-editor/react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { db, storage } from '@/lib/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';

interface Course {
  id: string;
  title: string;
  description?: string;
  aboutCourse?: string;
  prerequisites?: string;
  duration?: string;
  level?: string;
  price?: number;
  image?: string;
  videoContent?: any[];
  syllabus?: any[];
  assignments?: any[];
  resources?: any[];
  students?: number;
  rating?: number;
  learningObjectives?: string;
}

interface CourseDocument {
  id: string;
  title: string;
  path: string;
  url?: string;
}

export default function CourseDetails2() {
  const location = useLocation();
  const { course } = location.state || {};
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [pythonCode, setPythonCode] = useState('print("Hello, World!")');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you with your learning today?' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [documents, setDocuments] = useState<CourseDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Define your documents
        const courseDocuments: CourseDocument[] = [
          { id: '1', title: 'Class 1 - TUPLE', path: 'Content/class13.docx' },
          { id: '2', title: 'Class 2 - Lists', path: 'Content/class4.docx' },
          { id: '3', title: 'Class 3 - Dictionaries', path: 'Content/class7.docx' },
          { id: '3', title: 'Class 4 - basic', path: 'Conten/class8.docx' },
          

          // Add more documents as needed
        ];

        // Fetch URLs for all documents
        const docsWithUrls = await Promise.all(
          courseDocuments.map(async (doc) => {
            try {
              const docRef = ref(storage, doc.path);
              const url = await getDownloadURL(docRef);
              return { ...doc, url };
            } catch (error) {
              console.error(`Error fetching document ${doc.title}:`, error);
              return doc;
            }
          })
        );

        setDocuments(docsWithUrls);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast.error('Failed to load documents');
      }
    };

    fetchDocuments();
    fetchVideoContent();
  }, []);

  // Fetch video content from Firebase Storage
  const fetchVideoContent = async () => {
    try {
      const videoDocuments: CourseDocument[] = [
        { id: '1', title: 'Introduction to Python', path: 'Videos/video1.mp4' },
        { id: '2', title: 'Python Variables & Data Types', path: 'Videos/video2.mp4' },
        { id: '3', title: 'Python ', path: 'Videos/video3.mp4' },
        // Add more video documents as needed
      ];

      // Fetch URLs for all videos
      const videosWithUrls = await Promise.all(
        videoDocuments.map(async (video) => {
          try {
            const videoRef = ref(storage, video.path);
            const url = await getDownloadURL(videoRef);
            return { ...video, url };
          } catch (error) {
            console.error(`Error fetching video ${video.title}:`, error);
            return video;
          }
        })
      );

      setCourse((prevCourse) => ({
        ...prevCourse,
        videoContent: videosWithUrls,
      }));
    } catch (error) {
      console.error('Error fetching video content:', error);
      toast.error('Failed to load video content');
    }
  };

  

  const VideoPlayer = ({ video }) => {
    const [quality, setQuality] = useState('720p'); // Default quality

    if (!video || !video.url) return null; // Ensure video URL is available

    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          className="mb-2 p-2 bg-gray-700 text-white border border-gray-600 rounded"
        >
          <option value="360p">360p</option>
          <option value="480p">480p</option>
          <option value="720p">720p</option>
          <option value="1080p">1080p</option>
        </select>
        <video
          controls
          className="w-full aspect-video"
          src={video.url} // Ensure the video URL is used here
          poster={video.thumbnail || "default-poster.jpg"} // Provide a default poster if none exists
        >
          Your browser does not support the video tag.
        </video>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-white">{video.title}</h3>
          <p className="text-gray-400">{video.description}</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <Button 
            onClick={() => navigate('/programs')}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
          >
            Return to Programs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Course Header */}
          <div className="relative h-96 rounded-xl overflow-hidden mb-8">
            <img
              src={course.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085"}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent flex items-center">
              <div className="max-w-3xl mx-auto text-center text-white p-8">
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <div className="flex justify-center items-center space-x-6">
                  <div className="flex items-center text-gray-300">
                    <Clock className="w-5 h-5 mr-2 text-yellow-400" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Users className="w-5 h-5 mr-2 text-yellow-400" />
                    <span>{course.students || 0} students</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Star className="w-5 h-5 mr-2 text-yellow-400" />
                    <span>{course.rating || 4.5}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-4 mb-8 overflow-x-auto">
            {['about', 'content', 'assignments', 'resources', 'ide', 'chat'].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab 
                    ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-600' 
                    : 'text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {activeTab === 'about' && (
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold mb-4 text-yellow-400">About This Course</h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 mb-6">{course.aboutCourse || course.description}</p>
                    <h3 className="text-xl font-semibold mb-3 text-white">Prerequisites</h3>
                    <p className="text-gray-300 mb-6">{course.prerequisites}</p>
                    <h3 className="text-xl font-semibold mb-3 text-white">Learning Objectives</h3>
                    <p className="text-gray-300">{course.learningObjectives}</p>
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold mb-4 text-yellow-400">Course Content</h2>
                  
                  {/* Document Links */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-white">Course Materials</h3>
                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div key={doc.id} className="mb-4">
                          <button
                            onClick={() => setSelectedDoc(selectedDoc === doc.id ? null : doc.id)}
                            className="flex items-center p-3 border border-gray-700 rounded-lg 
                                     hover:bg-gray-700 w-full text-gray-300 transition-colors duration-300"
                          >
                            <BookOpen className="w-5 h-5 mr-2 text-yellow-400" />
                            <span>{doc.title}</span>
                          </button>
                          
                          {selectedDoc === doc.id && doc.url && (
                            <div className="mt-4 bg-gray-700 p-4 rounded-lg">
                              <iframe
                                src={`https://docs.google.com/viewer?url=${encodeURIComponent(doc.url)}&embedded=true`}
                                width="100%"
                                height="500px"
                                frameBorder="0"
                                className="bg-white rounded"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Video Player */}
                  {selectedVideo && (
                    <div className="mb-6 relative">
                      <VideoPlayer video={selectedVideo} />
                      <button
                        onClick={() => setSelectedVideo(null)}
                        className="absolute top-2 right-2 bg-red-0 text-white rounded-full p-2"
                      >
                        X
                      </button>
                    </div>
                  )}
                  
                  {/* Video List */}
                  <div className="space-y-4">
                    {course.videoContent?.map((video, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -2 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedVideo?.title === video.title
                            ? 'bg-gray-700 border-yellow-500/50'
                            : 'bg-gray-800 border-gray-700 hover:border-yellow-500/30'
                        }`}
                        onClick={() => setSelectedVideo(video)}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center mr-4">
                            <Play className="w-5 h-5 text-yellow-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1 text-white">{video.title}</h3>
                            <p className="text-sm text-gray-400">{video.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Syllabus */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Course Syllabus</h3>
                    <div className="space-y-6">
                      {course.syllabus?.map((week, index) => (
                        <div key={index} className="border-b pb-4">
                          <h3 className="text-xl font-semibold mb-2">Week {week.week}: {week.topic}</h3>
                          <p className="text-gray-600">{week.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'assignments' && (
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold mb-4 text-yellow-400">Assignments</h2>
                  <div className="space-y-6">
                    {course.assignments?.map((assignment, index) => (
                      <div key={index} className="border-b pb-4">
                        <h3 className="text-xl font-semibold mb-2">{assignment.title}</h3>
                        <p className="text-gray-300 mb-2">{assignment.description}</p>
                        <p className="text-sm text-gray-500">Due: {assignment.dueDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold mb-4 text-yellow-400">Additional Resources</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.resources?.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-4 border rounded-lg hover:bg-gray-700"
                      >
                        <BookOpen className="w-6 h-6 text-yellow-400 mr-3" />
                        <div>
                          <h3 className="font-semibold">{resource.title}</h3>
                          <p className="text-sm text-gray-500">{resource.type}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'ide' && (
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold mb-4 text-yellow-400">Python IDE</h2>
                  <div className="h-[500px] rounded-lg overflow-hidden">
                    <Editor
                      height="100%"
                      defaultLanguage="python"
                      value={pythonCode}
                      onChange={(value) => setPythonCode(value || '')}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                      }}
                    />
                  </div>
                  <Button className="mt-4">Run Code</Button>
                </div>
              )}

              {activeTab === 'chat' && (
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold mb-4 text-yellow-400">Course Assistant</h2>
                  <div className="h-[400px] overflow-y-auto mb-4 space-y-4">
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-yellow-600 text-white'
                              : 'bg-gray-700'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Ask a question..."
                      className="flex-1 p-2 border rounded-lg"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Course Progress */}
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-yellow-400">Course Progress</h2>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full 
                                     text-yellow-400 bg-yellow-400/20">
                        In Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-yellow-400">
                        30%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                    <div
                      style={{ width: "30%" }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"
                    ></div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-yellow-400">Next Steps</h2>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-300">
                    <BookOpen className="w-5 h-5 mr-2 text-yellow-400" />
                    Complete Module 2
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Award className="w-5 h-5 mr-2 text-yellow-400" />
                    Take Quiz 1
                  </li>
                </ul>
              </div>

              {/* Course Info */}
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-yellow-400">Course Information</h2>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="font-semibold text-white">{course.duration}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Level:</span>
                    <span className="font-semibold text-white capitalize">{course.level}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Price:</span>
                    <span className="font-semibold text-white">${course.price}</span>
                  </li>
                </ul>
              </div>

              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold">
                Enroll Now
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
