import express from "express"
import { requireUser } from "../Middleware/requireUser.js";
const TokenRouter = express.Router();
import { bookappointmentbytoken, createToken, getTokenData } from "../Controller/TokenController.js"
import { createAppointmnt, updateAppointmnt, updateAppointmntForAppointmentByToken } from "../Controller/Appointment.js";

TokenRouter.post("/creatTokenForDoctor", requireUser, createToken);
TokenRouter.post("/bookAppointment",  createAppointmnt);
// TokenRouter.get("/checkDoctorAvailbilityForAppointmentByToken/:doctorid/:date", requireUser, getTokenData);
TokenRouter.put("/editAppointment/:appointmentId", requireUser, updateAppointmnt);
TokenRouter.put("/editAppointmentForAppointmentByToken/:appointmentId", requireUser, updateAppointmntForAppointmentByToken);

TokenRouter.get("/getAppointmentByTokenSlotDetailForDoctorForPerticularDate/:doctorid/:date", requireUser, getTokenData);

TokenRouter.post("/bookappointmentbytoken", requireUser, bookappointmentbytoken)
// slotRouter.get("/slot", getslot);
// slotRouter.get("/userslot", userslot);

export { TokenRouter }
