import express from 'express'
import 'dotenv/config.js'
import { dbConnection } from './DB/db.js'
import { authRouter } from './Routes/authRouter.js'
import { masterRouter } from './Routes/masterRouter.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { Router } from './Routes/DoctorsRouter.js'
import { userCreationRouter } from './Routes/UserpatientRoutes.js'
import { locationrouter } from './Routes/locationroutes.js'
import { Appointment } from './Routes/AppoinmentRoutes.js'
import { contact } from "./Routes/ContactRoutes.js"
import { Record } from './Routes/RecordRoute.js'
import { review } from './Routes/ReviewRoute.js'
import { slotRouter } from './Routes/slotRoute.js'
import { TokenRouter } from './Routes/Tokenroute.js'
import { adminauthRouter } from './Routes/Adminauthroute.js'
import { adminRoiuter } from './Routes/Adminroute.js'
import { adminmasterRouter } from './Routes/Adminmaster.js'
import { admindoctorRouter } from './Routes/Admindoctorroute.js'
import { blogRouter } from './Routes/BlogRoute.js'
import { dynamicAddingDoctorsRouter } from './Routes/DynamicAddingDoctors.js'
import cron from "node-cron"
import { AppointmentGotoMissed } from './Controller/Appointment.js'
import ClinicOrHospitalProof from './Routes/ClinicOrHospitalProof.js'

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(express.json());
app.use(
  cors({
    "origin": "*",
  })
);
app.use(cookieParser());
app.use('/uploads', express.static('./uploads'))

cron.schedule('0 0 * * *', AppointmentGotoMissed);


app.use('/v2', authRouter)
app.use("/v2", masterRouter)
app.use("/v2", Router)
app.use("/v2", userCreationRouter)
app.use("/v2", locationrouter)
app.use("/v2", Appointment)
app.use("/v2", contact)
app.use("/v2", Record)
app.use("/v2", review)
app.use("/v2", slotRouter)
app.use("/v2", TokenRouter)
app.use("/v2", adminRoiuter)
app.use("/v2", admindoctorRouter)
app.use("/v2", adminmasterRouter)
app.use("/v2", adminauthRouter)
app.use("/v2", blogRouter)
app.use("/v2", dynamicAddingDoctorsRouter)
app.use("/v2", ClinicOrHospitalProof)

dbConnection()
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


