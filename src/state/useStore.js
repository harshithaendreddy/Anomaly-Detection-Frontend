import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isDarkMode: false,
        isLoading: false,
        error: null,
        uploadedFile: null,
        uploadProgress: 0,
        analysisResult: null,
        
        // Actions
        toggleDarkMode: () => {
  const newDarkMode = !get().isDarkMode;
  set({ isDarkMode: newDarkMode });

  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
},


        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
        setUploadedFile: (file) => set({ uploadedFile: file }),
        setUploadProgress: (progress) => set({ uploadProgress: progress }),
        setAnalysisResult: (result) => set({ analysisResult: result }),
        resetState: () => set({
          isLoading: false,
          error: null,
          uploadedFile: null,
          uploadProgress: 0,
          analysisResult: null,
        }),
      }),
      {
        name: 'anomaly-detection-store',
        partialize: (state) => ({ isDarkMode: state.isDarkMode }),
      }
    ),
    {
      name: 'anomaly-detection-store',
    }
  )
);

export default useStore;