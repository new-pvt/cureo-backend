import express from 'express';
import { requireAdmin } from '../Middleware/requireAdmin.js';
import { getAllDashboardCardsData, latestAppointments, newlySignUpPatient, totalAppointmentChartData } from '../Controller/Admindashboard.js';

const adminRoiuter = express.Router();

adminRoiuter.get('/getAllDashboardCardsData', requireAdmin, getAllDashboardCardsData)
adminRoiuter.get('/totalAppointmentChartData/:weekStartDate/:weekEndDate', totalAppointmentChartData)
adminRoiuter.get('/latestAppointments', requireAdmin, latestAppointments)
adminRoiuter.get('/latestPatientsUser', requireAdmin, newlySignUpPatient)

export { adminRoiuter }
