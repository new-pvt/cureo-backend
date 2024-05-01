import express from 'express';
import { addDoctor, getAllDoctors } from '../Controller/Admindoctor.js';
import multer from "multer";
import { requireAdmin } from '../Middleware/requireAdmin.js';
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


const admindoctorRouter = express.Router();

admindoctorRouter.get('/getAllDoctors', requireAdmin, getAllDoctors)
admindoctorRouter.post('/addDoctor', requireAdmin, upload.single("image"), addDoctor)

export { admindoctorRouter }