import express from 'express'
import multer from 'multer'
import { uploadProof } from '../Controller/uploadProof.js';
const ClinicOrHospitalProof = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

ClinicOrHospitalProof.post('/uploadProof', upload.single("image"), uploadProof);

export default ClinicOrHospitalProof;