import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import useStore from '../state/useStore';

const DarkModeToggle = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);
const toggleDarkMode = useStore((state) => state.toggleDarkMode);


  const handleToggle = () => {
    console.log('Toggle clicked, current isDarkMode:', isDarkMode);
    toggleDarkMode();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      className="group relative p-3 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-6 h-6">
        {/* Sun Icon */}
        <motion.div
          animate={{
            opacity: isDarkMode ? 0 : 1,
            rotate: isDarkMode ? 90 : 0,
            scale: isDarkMode ? 0.5 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sun className="w-6 h-6 text-yellow-500" />
        </motion.div>
        
        {/* Moon Icon */}
        <motion.div
          animate={{
            opacity: isDarkMode ? 1 : 0,
            rotate: isDarkMode ? 0 : -90,
            scale: isDarkMode ? 1 : 0.5,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Moon className="w-6 h-6 text-blue-400" />
        </motion.div>
      </div>
      
      {/* Glow Effect */}
      <motion.div
        animate={{
          opacity: isDarkMode ? 0.3 : 0.2,
          scale: isDarkMode ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
        className={`absolute inset-0 rounded-2xl blur-md -z-10 ${
          isDarkMode ? 'bg-blue-400' : 'bg-yellow-400'
        }`}
      />
      
      {/* Tooltip */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
          <div className="border-4 border-transparent border-b-gray-900 dark:border-b-gray-100" />
        </div>
      </div>
    </motion.button>
  );
};

export default DarkModeToggle;