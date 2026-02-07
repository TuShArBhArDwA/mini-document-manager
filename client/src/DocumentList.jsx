import React, { useState, useEffect } from 'react';
import { getDocuments, getDownloadUrl } from './api';
import { Download, Search, ChevronLeft, ChevronRight, FileText, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import byteSize from 'byte-size';

const DocumentList = ({ refreshTrigger }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filters & Pagination State
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [sortBy, setSortBy] = useState('uploadDate');
    const [order, setOrder] = useState('desc');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const result = await getDocuments({
                page,
                pageSize,
                search: debouncedSearch,
                sortBy,
                order
            });
            setDocuments(result.data);
            setTotalItems(result.pagination.totalItems);
            setError(null);
        } catch (err) {
            setError('Failed to load documents');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [page, debouncedSearch, sortBy, order, refreshTrigger]);

    const handleSort = (field) => {
        if (sortBy === field) {
            setOrder(order === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setOrder('desc'); // Default to desc for new field
        }
    };

    const getSortIcon = (field) => {
        if (sortBy !== field) return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
        return order === 'asc' 
            ? <ArrowUp className="w-4 h-4 text-blue-600" /> 
            : <ArrowDown className="w-4 h-4 text-blue-600" />;
    };

    const totalPages = Math.ceil(totalItems / pageSize);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header & Search */}
            <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Documents
                </h2>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search document names..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-medium">
                        <tr>
                            <th 
                                className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort('title')}
                            >
                                <div className="flex items-center gap-2">Title {getSortIcon('title')}</div>
                            </th>
                            <th 
                                className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort('size')}
                            >
                                <div className="flex items-center gap-2">Size {getSortIcon('size')}</div>
                            </th>
                            <th 
                                className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort('uploadDate')}
                            >
                                <div className="flex items-center gap-2">Date {getSortIcon('uploadDate')}</div>
                            </th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                    Loading documents...
                                </td>
                            </tr>
                        ) : documents.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                    No documents found.
                                </td>
                            </tr>
                        ) : (
                            documents.map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {doc.title}
                                        <div className="text-xs text-gray-400 font-normal mt-0.5">{doc.filename}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        {byteSize(doc.size).toString()}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        {new Date(doc.uploadDate).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a
                                            href={getDownloadUrl(doc.id)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
                                            download
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </a>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalItems > 0 && (
                <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
                    <div>
                        Showing <span className="font-medium">{Math.min((page - 1) * pageSize + 1, totalItems)}</span> to <span className="font-medium">{Math.min(page * pageSize, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentList;
