"use client";

import React, { useState, useEffect } from 'react';
import { 
  Shapes, 
  Moon,
  Sun,
  Plus,
  LogIn
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

function RoomPage() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
      document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localToken = localStorage.getItem('token');
      setToken(localToken);
    }
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      console.log("No token found, please log in.");
      return;
    }
    
    try {
      const response = await axios.post("/api/v1/user/room", {
        slug: roomName
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const data = await response.data;
      const roomId = data.roomId;

      if (!roomId) {
        console.log("Provide RoomId");
        return;
      }
      router.push(`/canvas/${roomId}`);

    } catch(e) {
      console.log(e);
    }  
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    const slug = roomName;
    
    // use ${process.env.NEXT_PUBLIC_HTTP_BACKEND} in get request for local development
    try {
      const response = await axios.get(`/api/v1/user/room/${slug}`);
      
      const roomId = response.data.roomId;

      if (!roomId) {
        console.error("Room not found");
        return;
      }
      router.push(`/canvas/${roomId}`);

    } catch(e) {
      console.error("Error joining room:", e);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 dark:bg-gray-950 transition-colors duration-200">
      {/* Header */}
      <header className="border-b border-purple-200 dark:border-gray-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Shapes className="h-8 w-8 text-purple-600" />
            <span className="font-bold text-xl dark:text-white ml-3">Drawify</span>
          </div>
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-gray-300" />
            ) : (
              <Moon className="h-5 w-5 text-purple-600" />
            )}
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-purple-900 dark:text-white mb-4">
            Welcome to Drawify
          </h1>
          <p className="text-lg text-purple-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join an existing room or create a new one to start collaborating.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Create Room Card */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 flex flex-col items-center border-2 border-purple-200 hover:border-purple-300 transition-colors">
            <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2 dark:text-white">Create a New Room</h2>
            <p className="text-purple-700 dark:text-gray-300 text-center mb-6">
              Start a new drawing room and invite others to join.
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create Room
            </button>
          </div>
          
          {/* Join Room Card */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 flex flex-col items-center border-2 border-purple-200 hover:border-purple-300 transition-colors">
            <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <LogIn className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2 dark:text-white">Join Existing Room</h2>
            <p className="text-purple-700 dark:text-gray-300 text-center mb-6">
              Enter a room name to join an existing session.
            </p>
            <button 
              onClick={() => setShowJoinModal(true)}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="h-5 w-5" />
              Join Room
            </button>
          </div>
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6 relative border-2 border-purple-200">
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-200"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Create a New Room</h2>
            <form onSubmit={handleCreateRoom}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="create-room-name" className="block text-sm font-medium text-purple-700 dark:text-gray-300 mb-1">
                    Room Name
                  </label>
                  <input
                    id="create-room-name"
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full px-4 py-2 border border-purple-200 dark:border-gray-700 rounded-md focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
                    placeholder="My Drawing Room"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="create-user-name" className="block text-sm font-medium text-purple-700 dark:text-gray-300 mb-1">
                    Your Name
                  </label>
                  <input
                    id="create-user-name"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-2 border border-purple-200 dark:border-gray-700 rounded-md focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6 relative border-2 border-purple-200">
            <button 
              onClick={() => setShowJoinModal(false)}
              className="absolute top-4 right-4 text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-200"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Join a Room</h2>
            <form onSubmit={handleJoinRoom}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="join-room-name" className="block text-sm font-medium text-purple-700 dark:text-gray-300 mb-1">
                    Room Name
                  </label>
                  <input
                    id="join-room-name"
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full px-4 py-2 border border-purple-200 dark:border-gray-700 rounded-md focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Enter room name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="join-user-name" className="block text-sm font-medium text-purple-700 dark:text-gray-300 mb-1">
                    Your Name
                  </label>
                  <input
                    id="join-user-name"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-2 border border-purple-200 dark:border-gray-700 rounded-md focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn className="h-5 w-5" />
                  Join Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomPage;