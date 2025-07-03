import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import useStore from '../state/useStore';
import axios from 'axios';

const FileUpload = () => {
  const {
    uploadedFile,
    uploadProgress,
    isLoading,
    error,
    setUploadedFile,
    setUploadProgress,
    setLoading,
    setError,
    setAnalysisResult,
  } = useStore();

  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setError(null);
      setUploadProgress(0);
    }
  }, [setUploadedFile, setError, setUploadProgress]);

  const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const response = await axios.post('https://anomaly-detection-backend-5zl8.onrender.com/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(percentCompleted);
        },
      });

      setAnalysisResult(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred during analysis'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setError(null);
  };

  const getDropzoneClassName = () => {
    let className = 'border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer ';
    
    if (isDragActive || isDragAccept) {
      className += 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ';
    } else if (isDragReject) {
      className += 'border-red-500 bg-red-50 dark:bg-red-900/20 ';
    } else {
      className += 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 ';
    }
    
    return className;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6"
    >
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Upload Transaction Data
      </h3>

      {!uploadedFile ? (
        <div {...getRootProps()} className={getDropzoneClassName()}>
          <input {...getInputProps()} aria-label="File upload" />
          <motion.div
            animate={{ y: isDragActive ? -5 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Upload 
              className={`w-12 h-12 mx-auto mb-4 ${
                isDragActive ? 'text-blue-500' : 'text-gray-400'
              }`}
              aria-hidden="true"
            />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              or click to browse files
            </p>
            <div className="text-sm text-gray-400 dark:text-gray-500">
              Supports CSV, JSON, and TXT files (max 10MB)
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* File Preview */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-500" aria-hidden="true" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg"
            >
              <AlertCircle className="w-5 h-5" aria-hidden="true" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Success Message */}
          {uploadedFile && !error && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg"
            >
              <CheckCircle className="w-5 h-5" aria-hidden="true" />
              <span>File uploaded successfully. Ready for analysis.</span>
            </motion.div>
          )}

          {/* Analyze Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
              isLoading
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing...</span>
              </div>
            ) : (
              'Analyze for Anomalies'
            )}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default FileUpload;