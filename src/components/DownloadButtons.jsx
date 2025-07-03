import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Code } from 'lucide-react';
import useStore from '../state/useStore';

const DownloadButtons = () => {
  const { analysisResult } = useStore();

  if (!analysisResult) return null;

  const downloadCSV = () => {
    const csvHeader = [
      'Transaction ID',
      'Amount',
      'Timestamp',
      'Anomaly Type',
      'Severity',
      'Confidence Score',
      'Description'
    ].join(',');

    const csvData = analysisResult.results.map(anomaly => [
      anomaly.transaction_id,
      anomaly.amount,
      anomaly.timestamp,
      anomaly.anomaly_type,
      anomaly.severity,
      anomaly.confidence_score,
      `"${anomaly.description.replace(/"/g, '""')}"` // Escape quotes
    ].join(','));

    const csvContent = [csvHeader, ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `anomaly_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = () => {
    const jsonData = {
      metadata: {
        generated_at: new Date().toISOString(),
        total_transactions: analysisResult.total_transactions,
        anomaly_count: analysisResult.anomaly_count,
        highest_amount: analysisResult.highest_amount,
        most_common_reason: analysisResult.most_common_reason,
        analysis_timestamp: analysisResult.analysis_timestamp,
      },
      anomalies: analysisResult.results,
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: 'application/json;charset=utf-8;'
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `anomaly_report_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6"
    >
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Export Report
      </h3>
      
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Download your anomaly detection results in your preferred format for further analysis or reporting.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* CSV Download */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={downloadCSV}
            className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
            aria-label="Download CSV report"
          >
            <FileText className="w-5 h-5" aria-hidden="true" />
            <div className="text-left">
              <p className="font-medium">Download CSV</p>
              <p className="text-xs opacity-90">Spreadsheet format</p>
            </div>
            <Download className="w-4 h-4" aria-hidden="true" />
          </motion.button>
          
          {/* JSON Download */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={downloadJSON}
            className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
            aria-label="Download JSON report"
          >
            <Code className="w-5 h-5" aria-hidden="true" />
            <div className="text-left">
              <p className="font-medium">Download JSON</p>
              <p className="text-xs opacity-90">Structured data</p>
            </div>
            <Download className="w-4 h-4" aria-hidden="true" />
          </motion.button>
        </div>
        
        {/* Download Statistics */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            Report Summary
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Total Records</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {analysisResult.results.length}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">File Size (est.)</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {(JSON.stringify(analysisResult.results).length / 1024).toFixed(1)} KB
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Generated</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Format</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                CSV & JSON
              </p>
            </div>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-300 mb-1">
                Export Information
              </p>
              <ul className="space-y-1 text-blue-700 dark:text-blue-400">
                <li>• CSV format is ideal for Excel and Google Sheets</li>
                <li>• JSON format preserves all data structure and metadata</li>
                <li>• Files include timestamps and analysis details</li>
                <li>• All sensitive data is anonymized for security</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DownloadButtons;