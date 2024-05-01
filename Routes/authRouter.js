import express from 'express'
import { signinController, refreshAccessTokenController, sendOtpController, varifyOtpAndSignUpController, logoutController } from '../Controller/authController.js';
const authRouter = express.Router();

authRouter.post('/sendotp', sendOtpController)
authRouter.post('/varifyotp', varifyOtpAndSignUpController)     
authRouter.post('/signin', signinController)
authRouter.post('/logout', logoutController)
authRouter.get('/refresh', refreshAccessTokenController)


 export {authRouter}