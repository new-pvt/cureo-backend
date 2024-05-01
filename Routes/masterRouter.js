import express from 'express'
import { hospitalprofileupdate, addDoctorbyhospital, getdoctorbytheirid, editDoctorbyhospital, AddStaff, editStaff, alldoctorandstaffforhospital, getSingleDoctor, getSingleStaff, alldoctors, statusupdatedoctortoremove, getHotspitalsDoctorForHomeScreen, getHotspitalsByIdAndTheirsDoctors, getAllHospitalsWithAllQuery, getallstaffinhospital } from '../Controller/Master.js';
import { requireUser } from '../Middleware/requireUser.js';
const masterRouter = express.Router();
import multer from "multer";
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// hopital managment
masterRouter.put('/master/:id', requireUser, upload.single("image"), hospitalprofileupdate);
masterRouter.post("/getdoctorinfo", requireUser, getdoctorbytheirid)
masterRouter.post('/addDoctor/:hospitalid', requireUser, upload.single("image"), addDoctorbyhospital)
masterRouter.put('/editDoctor/:hospitalid', requireUser, upload.single("image"), editDoctorbyhospital)
masterRouter.post("/addstaff", requireUser, upload.single("image"), AddStaff);
masterRouter.put("/editstaff/:id", requireUser, upload.single("image"), editStaff)
masterRouter.get("/alldoctorandstaff/:hospid", requireUser, alldoctorandstaffforhospital);
masterRouter.get("/getAlldoctor/:hospid", requireUser, alldoctors);
masterRouter.get("/singledoctor/:id", requireUser, getSingleDoctor)
masterRouter.get("/singlestaff/:id", requireUser, getSingleStaff)
masterRouter.put("/updateDoctorStatusToRemove/:doctorid", requireUser, statusupdatedoctortoremove)
masterRouter.get("/getAllHospitalsWithAllQuery", getAllHospitalsWithAllQuery)
masterRouter.get("/getHotspitalsDoctorForHomeScreen", getHotspitalsDoctorForHomeScreen)
masterRouter.get("/getHospitalByIdAndTheirsDoctors/:hospitalId", getHotspitalsByIdAndTheirsDoctors)

masterRouter.get("/getallstaffinhospital/:hospid",requireUser, getallstaffinhospital)

export { masterRouter } 