import express from 'express'
import { RecordCreation, getRecordforPatient } from '../Controller/RecordController.js';
import { uploadRecord } from '../Multer/MedicalRecordsConfig.js';
import { requireUser } from '../Middleware/requireUser.js';
import multer from "multer";
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const Record = express.Router();

Record.post('/uploadRecord/:id', requireUser, upload.single("image"), RecordCreation)
Record.get("/getRecordOfPatient/:id", requireUser, getRecordforPatient)

export { Record }

