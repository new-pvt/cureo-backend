import express from "express"
const slotRouter = express.Router();
import { createslot, getslot, userslot } from "../Controller/slotController.js"
import { requireUser } from "../Middleware/requireUser.js";

slotRouter.post("/creatSlotForDoctor", requireUser, createslot);
slotRouter.get("/getSlotDetailForDoctorForPerticularDate/:doctorid/:date", getslot);
slotRouter.get("/getAvailbleSlotsForAnUser/:doctorid/:date", userslot);
// slotRouter.get("/slot", getslot);
// slotRouter.get("/userslot", userslot);

export { slotRouter }
