import React from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import useStore from '../state/useStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnomalyChart = () => {
  const { analysisResult, isDarkMode } = useStore();

  if (!analysisResult) return null;

  // Process data for anomaly type distribution
  const anomalyCounts = analysisResult.results.reduce((acc, anomaly) => {
    acc[anomaly.anomaly_type] = (acc[anomaly.anomaly_type] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(anomalyCounts);
  const data = Object.values(anomalyCounts);

  const colors = [
    '#ef4444', // red
    '#f59e0b', // amber
    '#3b82f6', // blue
    '#10b981', // emerald
    '#8b5cf6', // violet
    '#f97316', // orange
    '#06b6d4', // cyan
    '#84cc16', // lime
  ];

  const barData = {
    labels,
    datasets: [
      {
        label: 'Anomaly Count',
        data,
        backgroundColor: colors.map(color => color + '80'), // Add transparency
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const pieData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: isDarkMode ? '#1f2937' : '#ffffff',
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDarkMode ? '#f8fafc' : '#374151',
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        titleColor: isDarkMode ? '#f8fafc' : '#374151',
        bodyColor: isDarkMode ? '#f8fafc' : '#374151',
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          stepSize: 1,
        },
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb',
        },
      },
      x: {
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          maxRotation: 45,
        },
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDarkMode ? '#f8fafc' : '#374151',
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        titleColor: isDarkMode ? '#f8fafc' : '#374151',
        bodyColor: isDarkMode ? '#f8fafc' : '#374151',
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6"
    >
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Anomaly Distribution
      </h3>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="h-80">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Count by Type
          </h4>
          <Bar data={barData} options={chartOptions} />
        </div>
        
        {/* Pie Chart */}
        <div className="h-80">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Percentage Distribution
          </h4>
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {labels.length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Anomaly Types</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {analysisResult.anomaly_count}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Anomalies</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {((analysisResult.anomaly_count / analysisResult.total_transactions) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Anomaly Rate</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.max(...data)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Max Type Count</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AnomalyChart;