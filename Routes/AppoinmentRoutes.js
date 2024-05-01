import express from 'express'
import { getAppoinmentForDoctorInHospital, AppointmentCreation, Instantbooking, getAppointmentForPatient, updateAppointment, getCancelAppointmentForPatient, updateUserAppointmentStatus, getPendingAppointmentsForHospitalAndDoctors, getCompleteAppointmentsForHospitalAndDoctors, getAllAppointmentsForPerticularHospital, getPendingAppointmentsForHospital, getCompleteAppointmentsForHospital, getMissedAppointmentsForHospital, getCompletedAppointmentForPatient, createAppointmentByHospitals, getPendingAppointmentForPatient, getMissedAppointmentsForHospitalAndDoctors } from '../Controller/UserAppointment.js';
import { requireUser } from '../Middleware/requireUser.js';
import { requirePatient } from '../Middleware/requirePatient.js';
import { getUpcomingAppointmentForAnUser, getCompletedAppointmentsForAnUser, getMissedAppointmentsForAnUser, getallappointmentofdoctor, getAllPendingAppointmentOfDoctor, getAllCompletedAppointmentOfDoctor, getAllMissedAppointmentOfDoctor, changeappointmentstatus, getsingleappointmentbyid, Appointmentstatusinpercentage, TodayAppointment, Totalapatient, Futureappointment, getallappointmentsforparticularhospitalidpending, getallappointmentsforparticularhospitalidcompleted, getallappointmentsforparticularhospitalidmissed, getAllPendingAppointmentByTokenOfDoctor, getAllCompletedAppointmentByTokenOfDoctor, getAllMissedAppointmentByTokenOfDoctor, changeappointmentstatusForAppointmentByToken, TodayAppointmentByToken, AppointmentstatusinpercentageForAppointmentByToken, FutureappointmentForAppointmentByToken, getallappointmentsByTokenforparticularhospitalidpending, getallappointmentsByTokenforparticularhospitalidcompleted, getallappointmentsByTokenforparticularhospitalidmissed, searchappointmentsbyuser } from '../Controller/Appointment.js';
const Appointment = express.Router();

//For Doctor

    //Slot
    Appointment.get('/getPendingAppoinmentForDoctor/:doctorid/:date', requireUser, getAllPendingAppointmentOfDoctor)
    Appointment.get('/getCompletedAppoinmentForDoctor/:doctorid/:date', requireUser, getAllCompletedAppointmentOfDoctor)
    Appointment.get('/getMissedAppoinmentForDoctor/:doctorid/:date', requireUser, getAllMissedAppointmentOfDoctor)


    //Token
    Appointment.get('/getPendingAppoinmentByTokenForDoctor/:doctorid/:date', requireUser, getAllPendingAppointmentByTokenOfDoctor)
    Appointment.get('/getCompletedAppoinmentByTokenForDoctor/:doctorid/:date', requireUser, getAllCompletedAppointmentByTokenOfDoctor)
    Appointment.get('/getMissedAppoinmentByTokenForDoctor/:doctorid/:date', requireUser, getAllMissedAppointmentByTokenOfDoctor)




Appointment.get('/getAllAppointmentsForPerticularHospital/:hospitalid/:date', getallappointmentsforparticularhospitalidpending)
Appointment.get('/getAllAppointmentsForPerticularHospitalByToken/:hospitalid/:date/pendingByToken', getallappointmentsByTokenforparticularhospitalidpending)

Appointment.get('/getCompleteAppointmentsForHospital/:hospitalid/:date', getallappointmentsforparticularhospitalidcompleted)


Appointment.get('/getCompleteAppointmentsForHospitalByToken/:hospitalid/:date/completedByToken', getallappointmentsByTokenforparticularhospitalidcompleted)


Appointment.get('/getMissedAppointmentsForHospital/:hospitalid/:date',
    getallappointmentsforparticularhospitalidmissed)

Appointment.get('/getMissedAppointmentsByTokenForHospital/:hospitalid/:date/missedByToken',
    getallappointmentsByTokenforparticularhospitalidmissed)

// Get All completed Appointments for Doctor

// Get All Missed Appointments for Doctor

// Get All pending Appointments By Token for Doctor

// Get All completed Appointments By Token for Doctor

// Get All Missed Appointments By Token for Doctor



// Pi chart Api rout here
Appointment.get('/getPiChartData/:doctorid/:date/piChart', requireUser, Appointmentstatusinpercentage)

Appointment.get('/getPiChartDataForAppointmentByToken/:doctorid/:date/piChart', requireUser, AppointmentstatusinpercentageForAppointmentByToken)

//Today's Appointments Route
Appointment.get('/todaysAppointement/:doctorid/:date/:todaysAppointment', requireUser, TodayAppointment)


Appointment.get('/todaysAppointementByToken/:doctorid/:date/:todaysAppointment', requireUser, TodayAppointmentByToken)

//Total petient Route
Appointment.get('/totalPatient/:doctorid/:date/totalPatient', requireUser, Totalapatient)

//Future Appointments Route
Appointment.get('/futureAppointment/:doctorid/futureAppointment', requireUser, Futureappointment)

Appointment.get('/futureAppointmentForAppointmentByToken/:doctorid/futureAppointment', requireUser, FutureappointmentForAppointmentByToken)


Appointment.get('/getPendingAppointmentsForHospital/:hosep_id', requireUser, getPendingAppointmentsForHospital)




Appointment.get('/getPendingAppointmentsForHospitalAndDoctors/:hosep_id/:doctor_id', requireUser, getPendingAppointmentsForHospitalAndDoctors)



Appointment.get('/getCompleteAppointmentsForHospitalAndDoctors/:hosep_id/:doctor_id', requireUser, getCompleteAppointmentsForHospitalAndDoctors)
Appointment.get('/getMissedAppointmentsForHospitalAndDoctors/:hosep_id/:doctor_id', requireUser, getMissedAppointmentsForHospitalAndDoctors)



Appointment.post('/createAppoinment', AppointmentCreation)

Appointment.post('/createAppointmentByHospitals', requireUser, createAppointmentByHospitals)


Appointment.post('/instantcreateAppoinment', requireUser, Instantbooking)


Appointment.get('/getPatientAppointment/:Patient_id', requireUser, getAppointmentForPatient)

//Abhay Made this Api for website
//From here all appointments apis for patient only

// 1. Get All pending appointments for perticular patient
Appointment.get('/getPendingAppointmentForPatient/:Patient_id', requireUser, getUpcomingAppointmentForAnUser)
Appointment.get('/getPendingAppointmentForDoctor/:doctorid/:date', requireUser, getAllPendingAppointmentOfDoctor)

// 2. Get All completed appointments for perticular patient

Appointment.get("/getCompletedAppointment/:Patient_id", requireUser, getCompletedAppointmentsForAnUser)


// 3. Get All Missed appointments for perticular patient

Appointment.get("/getMissedAppointment/:Patient_id", requireUser, getMissedAppointmentsForAnUser)

Appointment.get("/getsingleappointmentbyid/:appointmentId/:status", requireUser, getsingleappointmentbyid)


Appointment.put("/updateUserAppointment/:id", requireUser, updateAppointment)

Appointment.put('/updateUserAppointmentStatus/:id', requireUser, changeappointmentstatus)



Appointment.put('/updateAppointmentByTokenUserAppointmentStatus/:id', requireUser, changeappointmentstatusForAppointmentByToken)


Appointment.get("/getCancelAppointment/:Patient_id", requireUser, getCancelAppointmentForPatient)


Appointment.get("/searchappointmentsbyuser", searchappointmentsbyuser)





export { Appointment }