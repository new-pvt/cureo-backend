import express from 'express';
import { requireAdmin } from '../Middleware/requireAdmin.js'
import multer from "multer";
import { addHospital } from '../Controller/Adminmaster.js';
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const adminmasterRouter = express.Router();

adminmasterRouter.post('/addHospital', requireAdmin, upload.single("image"), addHospital)

export { adminmasterRouter }