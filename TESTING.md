# Manual Verification Checklist

Follow these steps to ensure your assignment meets all strict requirements.

## 1. Setup & Launch
- [ ] **Backend**: Open terminal, `cd server`, `npm install`, `npm start`. Ensure it says "Server running...".
- [ ] **Frontend**: Open new terminal, `cd client`, `npm install`, `npm run dev`.
- [ ] **Browser**: Open the Local URL (usually `http://localhost:5173`).

## 2. Functional Requirements Test

### A. Upload Documents (Critical)
- [ ] **Action**: Click "Choose Files". Select **3 different files** (e.g., an image, a PDF, a text file) at once.
- [ ] **Action**: Click "Upload".
- [ ] **Expectation**: 
    - A success message appears.
    - The file list automatically refreshes.
    - All 3 files appear in the list.
    - **Check Backend**: Look in `server/uploads/` folder. Do you see the 3 files there?

### B. List & Pagination
- [ ] **Action**: Upload enough files to have more than 10 total (e.g., upload 8 more files).
- [ ] **Expectation**:
    - The list shows only 10 items (Page 1).
    - "Showing 1-10 of X" text is correct.
    - "Next" (`>`) button is enabled.
- [ ] **Action**: Click "Next".
- [ ] **Expectation**: Shows the remaining files. "Previous" (`<`) button is enabled.

### C. Text Search
- [ ] **Action**: Type a unique word from one of your file titles into the Search box.
- [ ] **Expectation**:
    - The list filters immediately or after a short delay.
    - Only matching files are shown.
- [ ] **Action**: Clear the search box.
- [ ] **Expectation**: Full list returns.

### D. Sorting
- [ ] **Action**: Click "Size" column header.
- [ ] **Expectation**: List reorders by file size.
- [ ] **Action**: Click "Size" again.
- [ ] **Expectation**: Order reverses (Ascending <-> Descending).
- [ ] **Action**: Click "Date" header to return to default sorting.

### E. Streaming Download
- [ ] **Action**: Click "Download" on a large file (or any file).
- [ ] **Expectation**: File downloads with the **correct name** and **extension**.
- [ ] **Verify**: Open the downloaded file to ensure it's not corrupted. (This proves the stream worked).

## 3. Submission Deliverables Check
- [ ] **Code Structure**: Ensure `client` and `server` folders are distinct.
- [ ] **README.md**:
    - Includes Setup Instructions? (Yes)
    - Includes **Design Questions** answers? (Yes, explicitly required).
    - Includes **Tradeoffs** section? (Yes).
- [ ] **Architecture Diagram**:
    - Is it in the README or a separate file? (It's in the README as Mermaid code. **Tip**: You might want to take a screenshot of the rendered diagram diagram to include as a PNG if they strictly asked for PNG/PDF, or just export the README as PDF).
- [ ] **Screen Recording**:
    - **Plan your recording**: 
        1. Show empty list (or start fresh).
        2. Upload 3 files.
        3. Show them appear.
        4. Sort by Size.
        5. Search for a file.
        6. Download a file.
        7. Keep it under 5 minutes.

## 4. Edge Case Check
- [ ] **Empty State**: Determine what happens if the database is empty (Should show "No documents found").
- [ ] **Server Restart**: Stop the server (`Ctrl+C`) and start it again. The uploaded files should still be there (Persistence check).
