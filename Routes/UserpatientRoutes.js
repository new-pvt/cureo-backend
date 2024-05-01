

import express from 'express'
import { usersignup, usersignin, userpasswordupdated, userforgotpassword, isUserExist, usergetalldoctors, changepassword, userprofileupdate, findUserByEmailOrPhone, sendOtpToEmailOrPhone, varifyOtpController, varifyOtpForForgotPasswordController, resetPassword, addHealthConcern } from '../Controller/Userpatient.js';
import { requireUser } from '../Middleware/requireUser.js'
import multer from "multer";
import { Searchdoctorbylocation, Searchdoctorbyuser } from '../Controller/searchcontroller.js';
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const userCreationRouter = express.Router();

userCreationRouter.put('/changepassword/:id', requireUser, changepassword);
userCreationRouter.put('/updateuserpatient/:id', requireUser, upload.single("image"), userprofileupdate);
userCreationRouter.post('/isUserExist', isUserExist)
userCreationRouter.post('/sendOtpToEmailOrPhone', sendOtpToEmailOrPhone);
userCreationRouter.post('/varifyOtpForForgotPassword', varifyOtpForForgotPasswordController);
userCreationRouter.post('/varifyOtpController', varifyOtpController);
userCreationRouter.post('/resetPassword', resetPassword);
userCreationRouter.post('/userCreation', usersignup)
userCreationRouter.post('/userpasswordupdated', userpasswordupdated)
userCreationRouter.get('/getusergetalldoctors', usergetalldoctors)
userCreationRouter.post('/FindUserByNameAndPassword', usersignin)
userCreationRouter.post('/forgotpassword', userforgotpassword)
userCreationRouter.get('/searchdoctor/:lat/:long', Searchdoctorbyuser)
userCreationRouter.post('/addHealthConcern', requireUser, addHealthConcern)

userCreationRouter.post('/findPatientByEmailOrPhone', findUserByEmailOrPhone);


userCreationRouter.post('/doctorsByLocation', Searchdoctorbylocation)
// userCreationRouter.get('/alldoctors', alldoctors)


// userCreationRouter.get("/getalldoctors", usergetalldoctors)     







export { userCreationRouter } 
