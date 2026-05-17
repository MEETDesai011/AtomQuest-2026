import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary Caught:", error, errorInfo);
    
    // Automatically reload on chunk load failure (stale cache after deployment)
    const isChunkLoadFailed = error?.message?.toLowerCase().includes('failed to fetch dynamically imported module') || 
                              error?.message?.toLowerCase().includes('importing a module script failed');
                              
    if (isChunkLoadFailed) {
      // Prevent infinite reload loops with a 10-second debounce
      const lastReload = sessionStorage.getItem('chunk_reloaded_time');
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
        sessionStorage.setItem('chunk_reloaded_time', now.toString());
        window.location.reload(true);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
          <div className="max-w-md bg-white dark:bg-[#0b1326] p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-500 dark:text-[#c7c4d7] mb-4">
              An unexpected error occurred in the dashboard. Please refresh the page.
            </p>
            <p className="text-sm text-gray-500 dark:text-[#c7c4d7] font-mono bg-gray-50 dark:bg-[#171f33] p-2 rounded">
              {this.state.error?.toString()}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
