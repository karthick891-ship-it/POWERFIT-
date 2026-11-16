# PowerFit Gym — fixed backend package

This version removes `better-sqlite3`, which was failing to compile on the Windows/Node.js 24 setup because C++ Build Tools were not installed.

## Run on Windows 11

1. Extract this ZIP.
2. Open Terminal in the extracted folder (the folder containing `server.js` and `package.json`).
3. Run:

   ```cmd
   npm install
   npm start
   ```

4. Open:

   http://localhost:3000

## Backend

- `POST /api/enquiries` validates and saves membership enquiries.
- Enquiries are stored in `data/enquiries.json`; the folder/file is created automatically.
- `GET /api/health` checks that the backend is running.
- The frontend form posts to the backend API.

## Important notes

- This is a local development backend, not yet a public hosted website.
- JSON file storage is suitable for a small local demo, not a busy production service with concurrent writes.
- Before collecting real customer information publicly, add HTTPS, rate limiting/spam protection, backups, privacy notices, and an authenticated admin dashboard.
- Replace sample business contact details, trainers, and prices before publishing.
