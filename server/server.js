const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Routes

// 1. Upload Documents
app.post('/api/documents', upload.array('files'), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    const promises = req.files.map(file => {
        return new Promise((resolve, reject) => {
            const title = file.originalname; // Default title to filename
            const uploadDate = new Date().toISOString();

            const sql = `INSERT INTO documents (title, filename, size, mimetype, uploadDate, path) VALUES (?, ?, ?, ?, ?, ?)`;
            const params = [title, file.filename, file.size, file.mimetype, uploadDate, file.path];

            db.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, filename: file.originalname });
                }
            });
        });
    });

    Promise.all(promises)
        .then(results => res.status(201).json({ message: 'Files uploaded successfully', files: results }))
        .catch(err => res.status(500).json({ error: 'Database error', details: err.message }));
});

// 2. List Documents (Pagination, Sorting, Search)
app.get('/api/documents', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const search = req.query.q || '';
    const sortBy = req.query.sortBy || 'uploadDate'; // Default sort by date
    const order = req.query.order === 'asc' ? 'ASC' : 'DESC'; // Default DESC

    // Validate sort column to prevent SQL injection
    const validColumns = ['title', 'uploadDate', 'size'];
    const sortColumn = validColumns.includes(sortBy) ? sortBy : 'uploadDate';

    let sql = `SELECT * FROM documents`;
    let countSql = `SELECT COUNT(*) as count FROM documents`;
    let params = [];

    if (search) {
        sql += ` WHERE title LIKE ?`;
        countSql += ` WHERE title LIKE ?`;
        params.push(`%${search}%`);
    }

    sql += ` ORDER BY ${sortColumn} ${order} LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);

    db.get(countSql, search ? [`%${search}%`] : [], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const totalItems = row.count;
        const totalPages = Math.ceil(totalItems / pageSize);

        db.all(sql, params, (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({
                data: rows,
                pagination: {
                    page,
                    pageSize,
                    totalItems,
                    totalPages
                }
            });
        });
    });
});

// 3. Download Document (Streaming)
app.get('/api/documents/:id/download', (req, res) => {
    const id = req.params.id;

    db.get(`SELECT * FROM documents WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Document not found' });
        }

        const filePath = row.path;
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found on server' });
        }

        res.setHeader('Content-Disposition', `attachment; filename="${row.title}"`);
        res.setHeader('Content-Type', row.mimetype);

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
