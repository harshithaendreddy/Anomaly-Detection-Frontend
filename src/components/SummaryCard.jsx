import React from 'react';
import { motion } from 'framer-motion';

const SummaryCard = ({
  title,
  value,
  icon: Icon,
  color,
  description,
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-blue-500',
          text: 'text-blue-600 dark:text-blue-400',
          bgLight: 'bg-blue-50 dark:bg-blue-900/20',
        };
      case 'secondary':
        return {
          bg: 'bg-gray-500',
          text: 'text-gray-600 dark:text-gray-400',
          bgLight: 'bg-gray-50 dark:bg-gray-900/20',
        };
      case 'success':
        return {
          bg: 'bg-green-500',
          text: 'text-green-600 dark:text-green-400',
          bgLight: 'bg-green-50 dark:bg-green-900/20',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500',
          text: 'text-yellow-600 dark:text-yellow-400',
          bgLight: 'bg-yellow-50 dark:bg-yellow-900/20',
        };
      case 'danger':
        return {
          bg: 'bg-red-500',
          text: 'text-red-600 dark:text-red-400',
          bgLight: 'bg-red-50 dark:bg-red-900/20',
        };
      default:
        return {
          bg: 'bg-gray-500',
          text: 'text-gray-600 dark:text-gray-400',
          bgLight: 'bg-gray-50 dark:bg-gray-900/20',
        };
    }
  };

  const colors = getColorClasses();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${colors.bgLight} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colors.text}`} aria-hidden="true" />
        </div>
      </div>
      
      {/* Decorative gradient line */}
      <div className={`h-1 ${colors.bg} rounded-full mt-4 opacity-20`} />
    </motion.div>
  );
};

export default SummaryCard;