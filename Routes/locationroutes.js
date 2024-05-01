
import express from 'express'
import { getDoctorforLocation ,LocationCreation ,getDoctorforspecialties, getDoctorforspecialtiesAbhay } from '../Controller/LocationController.js';
const locationrouter = express.Router();

locationrouter.get('/getDoctorForLocation/:id', getDoctorforLocation)
locationrouter.post('/locationcreation', LocationCreation)
locationrouter.post('/getDoctorforSpecialties', getDoctorforspecialties)
locationrouter.get('/getDoctorforSpecialties/abhay', getDoctorforspecialtiesAbhay)
// Router.get('/getSingleDoctor/:id', getSingleDoctor)


 export {locationrouter} 