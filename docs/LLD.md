# Low Level Design (LLD)

## 1. Database Schema
**Database**: SQLite
**File**: `documents.db`

### Table: `documents`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PK, AUTOINCREMENT | Unique identifier for the document |
| `title` | TEXT | NOT NULL | Display name of the file (defaults to original filename) |
| `filename` | TEXT | NOT NULL | Sanitized filename stored on disk |
| `size` | INTEGER | - | File size in bytes |
| `mimetype` | TEXT | - | MIME type (e.g., `application/pdf`) |
| `uploadDate` | TEXT | - | ISO 8601 Timestamp |
| `path` | TEXT | NOT NULL | Absolute or relative path to the file on disk |

## 2. API Specification

### 2.1 Upload Documents
*   **Endpoint**: `POST /api/documents`
*   **Content-Type**: `multipart/form-data`
*   **Parameters**: `files` (Array of binaries)
*   **Response (201 Created)**:
    ```json
    {
      "message": "Files uploaded successfully",
      "files": [
        { "id": 1, "filename": "report.pdf" }
      ]
    }
    ```

### 2.2 List Documents
*   **Endpoint**: `GET /api/documents`
*   **Query Params**:
    *   `page` (int, default 1)
    *   `pageSize` (int, default 10)
    *   `q` (string, search term)
    *   `sortBy` (string: 'title' | 'size' | 'uploadDate')
    *   `order` (string: 'asc' | 'desc')
*   **Response (200 OK)**:
    ```json
    {
      "data": [
        { "id": 1, "title": "...", "size": 1024, "uploadDate": "..." }
      ],
      "pagination": {
        "page": 1, 
        "totalItems": 50,
        "totalPages": 5
      }
    }
    ```

### 2.3 Download Document
*   **Endpoint**: `GET /api/documents/:id/download`
*   **Response**: Binary Stream (File Download)
*   **Headers**: 
    *   `Content-Disposition: attachment; filename="..."`
    *   `Content-Type: <mimetype>`

## 3. Code Component Structure (Frontend)

### `App.jsx`
*   Main container.
*   Manages `refreshKey` state to trigger list updates after upload.

### `Upload.jsx`
*   **State**: `files` (Array), `uploading` (Boolean), `success` (Boolean).
*   **Handlers**: 
    *   `handleFileChange`: Updates state on selection.
    *   `handleUpload`: Calls API and invokes `onUploadSuccess`.

### `DocumentList.jsx`
*   **State**: `documents` (Array), `pagination` (Object), `filters` (Object).
*   **Effect**: Fetches data on mount or when filters/page change.
*   **Render**: Displays table with:
    *   Sortable headers (Click handlers update `sortBy` state).
    *   Search Input (Debounced update to `q` state).
    *   Pagination Controls.

## 4. Backend Module Structure
*   `server.js`: Entry point. Configures Express, CORS, and Routes.
*   `database.js`: Singleton SQLite connection. Handles table initialization.
*   `uploads/`: Directory for persistent file storage.
