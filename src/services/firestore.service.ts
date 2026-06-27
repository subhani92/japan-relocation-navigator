import fs from "fs";
import path from "path";
import { RelocationReport, UploadRecord } from "../types/relocation.types.js";

// We will use a local JSON database file for 100% out-of-the-box reliability.
// If the user configures Firebase later, it can easily write to Firestore.
// Let's implement a clean local file-based database that persists inside a "data" directory.
const DB_DIR = path.join(process.cwd(), "data");
const REPORTS_FILE = path.join(DB_DIR, "reports.json");
const UPLOADS_FILE = path.join(DB_DIR, "uploads.json");

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Ensure database files exist
if (!fs.existsSync(REPORTS_FILE)) {
  fs.writeFileSync(REPORTS_FILE, JSON.stringify({}, null, 2));
}
if (!fs.existsSync(UPLOADS_FILE)) {
  fs.writeFileSync(UPLOADS_FILE, JSON.stringify({}, null, 2));
}

// Helper to read JSON
function readJSON(file: string): Record<string, any> {
  try {
    const data = fs.readFileSync(file, "utf8");
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

// Helper to write JSON
function writeJSON(file: string, data: Record<string, any>) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export class FirestoreService {
  static async saveReport(report: RelocationReport): Promise<void> {
    const db = readJSON(REPORTS_FILE);
    db[report.reportId] = report;
    writeJSON(REPORTS_FILE, db);
    console.log(`Saved report ${report.reportId} to database.`);
  }

  static async getReport(reportId: string): Promise<RelocationReport | null> {
    const db = readJSON(REPORTS_FILE);
    const report = db[reportId];
    return report || null;
  }

  static async getAllReports(): Promise<RelocationReport[]> {
    const db = readJSON(REPORTS_FILE);
    return Object.values(db).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async saveUpload(upload: UploadRecord): Promise<void> {
    const db = readJSON(UPLOADS_FILE);
    db[upload.uploadId] = upload;
    writeJSON(UPLOADS_FILE, db);
    console.log(`Saved upload ${upload.uploadId} to database.`);
  }

  static async getUpload(uploadId: string): Promise<UploadRecord | null> {
    const db = readJSON(UPLOADS_FILE);
    const upload = db[uploadId];
    return upload || null;
  }
}
export const firestoreService = FirestoreService;
