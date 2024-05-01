import express from 'express'
import { acceptAppointmentBy, editDoctorfile, getAllDoctorWithAllQuery, getDoctorWithSpeciality, getSpeacilityList, multipleloginprofile } from '../Controller/DoctorController.js';
const Router = express.Router();
import { requireUser } from '../Middleware/requireUser.js'
import multer from "multer";
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

Router.put('/editDoctorfile/:id', requireUser, upload.single("image"), editDoctorfile);
Router.put('/editAcceptAppointmentBy/:id', requireUser, acceptAppointmentBy);
Router.get("/multipleloginprofile/:doctorid", requireUser, multipleloginprofile);

Router.get("/getAllDoctorWithAllQuery", getAllDoctorWithAllQuery);

Router.get("/getDoctorWithSpeciality", getDoctorWithSpeciality);
Router.get("/getSpeacilityList", getSpeacilityList);




export { Router };