import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import useStore from '../state/useStore';
import FileUpload from '../components/FileUpload';
import SummaryCard from '../components/SummaryCard';
import AnomalyChart from '../components/AnomalyChart';
import ResultTable from '../components/ResultTable';
import DownloadButtons from '../components/DownloadButtons';
import DarkModeToggle from '../components/DarkModeToggle';
import { Brain, Shield, TrendingUp } from 'lucide-react';



const Home = () => {
  const { isDarkMode, analysisResult } = useStore();
  useEffect(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    useStore.setState({ isDarkMode: savedTheme === 'dark' });
  }
}, []);


  // Apply dark mode to document on mount and when isDarkMode changes
  useEffect(() => {
  const html = document.documentElement;

  if (isDarkMode) {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}, [isDarkMode]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5" />
        <div className="relative container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-3"
            >
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <Brain className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  AI-Powered Anomaly Analysis
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Smart transaction insights driven by GPT-based AI models
                </p>
              </div>
            </motion.div>
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Upload Your Data for Analysis
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Quickly detect outliers and suspicious patterns in your data using powerful language models. Just upload your transaction file and let our AI do the rest!
            </p>
          </motion.section>

          {/* File Upload Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <FileUpload />
          </motion.section>

          {/* Results Section */}
          {analysisResult && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-8"
            >
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard
                  title="Total Anomalies"
                  value={analysisResult.anomaly_count}
                  icon={Shield}
                  color="danger"
                  description="Suspicious transactions detected"
                />
                <SummaryCard
                  title="Highest Amount"
                  value={`$${analysisResult.highest_amount.toLocaleString()}`}
                  icon={TrendingUp}
                  color="warning"
                  description="Most significant transaction"
                />
                <SummaryCard
                  title="Common Reason"
                  value={analysisResult.most_common_reason}
                  icon={Brain}
                  color="primary"
                  description="Primary anomaly type"
                />
              </div>

              {/* Chart and Download Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnomalyChart />
                <DownloadButtons />
              </div>

              {/* Results Table */}
              <ResultTable />
            </motion.section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;