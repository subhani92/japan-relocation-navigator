import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { storageService } from "../services/storage.service.js";
import { extractJobProfileFromDoc } from "../services/gemini.service.js";
import { firestoreService } from "../services/firestore.service.js";
import { UploadRecord } from "../types/relocation.types.js";

const router = Router();

// Configure multer for memory storage (we'll process the buffer and write it)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, PNG, and JPG are supported."));
    }
  },
});

router.post("/", upload.single("file"), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file was uploaded." });
      return;
    }

    console.log(`Received file upload: ${req.file.originalname} (${req.file.mimetype})`);

    // 1. Upload to storage (local folder accessible publicly)
    const fileUrl = await storageService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // 2. Extract job offer profile using Gemini Vision
    const extractedData = await extractJobProfileFromDoc(req.file.buffer, req.file.mimetype);

    console.log("Extracted profile data from document:", extractedData);

    // 3. Save to uploads collection
    const uploadId = crypto.randomUUID();
    const uploadRecord: UploadRecord = {
      uploadId,
      fileUrl,
      extractedData,
    };

    await firestoreService.saveUpload(uploadRecord);

    // 4. Return the extracted profile as requested
    res.json({
      uploadId,
      fileUrl,
      extractedData,
    });
  } catch (error) {
    next(error);
  }
});

export const uploadRoutes = router;
export default router;
