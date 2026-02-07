const API_BASE_URL = '/api';

export const uploadDocuments = async (files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    const response = await fetch(`${API_BASE_URL}/documents`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Upload failed');
    }
    return response.json();
};

export const getDocuments = async ({ page = 1, pageSize = 10, search = '', sortBy = 'uploadDate', order = 'desc' }) => {
    const params = new URLSearchParams({
        page,
        pageSize,
        q: search,
        sortBy,
        order
    });

    const response = await fetch(`${API_BASE_URL}/documents?${params}`);
    if (!response.ok) {
        throw new Error('Failed to fetch documents');
    }
    return response.json();
};

export const getDownloadUrl = (id) => {
    return `${API_BASE_URL}/documents/${id}/download`;
};
