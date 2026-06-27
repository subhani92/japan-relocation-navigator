import fs from "fs";
import path from "path";

// Local storage directory inside the public directory
// This guarantees that any uploaded file is immediately accessible from the browser!
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export class StorageService {
  /**
   * Uploads a file (stores locally) and returns the public URL
   */
  static async uploadFile(fileBuffer: Buffer, originalName: string, mimeType: string): Promise<string> {
    const ext = path.extname(originalName) || getExtFromMime(mimeType);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}${ext}`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    fs.writeFileSync(filePath, fileBuffer);
    console.log(`Successfully stored uploaded file: ${filePath}`);

    // Return the relative URL from the host
    return `/uploads/${fileName}`;
  }
}

function getExtFromMime(mime: string): string {
  switch (mime) {
    case "application/pdf":
      return ".pdf";
    case "image/png":
      return ".png";
    case "image/jpeg":
    case "image/jpg":
      return ".jpg";
    default:
      return ".bin";
  }
}

export const storageService = StorageService;
