import React, { useState } from 'react';
import Upload from './Upload';
import DocumentList from './DocumentList';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    // Trigger list refresh
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Mini Document Manager
          </h1>
          <p className="text-gray-500 mt-2">
            Upload, manage, and download your files efficiently.
          </p>
        </header>

        <section>
          <Upload onUploadSuccess={handleUploadSuccess} />
        </section>

        <section>
          <DocumentList refreshTrigger={refreshKey} />
        </section>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Made with 💙 by{' '}
            <a
              href="https://github.com/TuShArBhArDwA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Tushar Bhardwaj
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
