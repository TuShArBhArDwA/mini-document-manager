import React, { useState } from 'react';
import { Upload as UploadIcon, X, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadDocuments } from './api';

const Upload = ({ onUploadSuccess }) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
        setError(null);
        setSuccess(false);
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploading(true);
        setError(null);
        try {
            await uploadDocuments(files);
            setSuccess(true);
            setFiles([]);
            if (onUploadSuccess) onUploadSuccess();
            // Reset success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <UploadIcon className="w-5 h-5 text-blue-600" />
                Upload Documents
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-1 w-full">
                    <label className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        cursor-pointer
                    ">
                        <input 
                            type="file" 
                            multiple 
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </label>
                    {files.length > 0 && (
                        <p className="mt-2 text-sm text-gray-600">
                            {files.length} file(s) selected
                        </p>
                    )}
                </div>

                <button
                    onClick={handleUpload}
                    disabled={uploading || files.length === 0}
                    className={`px-6 py-2 rounded-md text-white font-medium transition-colors
                        ${uploading || files.length === 0 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Upload successful!
                </div>
            )}
        </div>
    );
};

export default Upload;
