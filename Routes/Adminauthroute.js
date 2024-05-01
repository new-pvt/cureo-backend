import express from 'express';
import { adminLogin, createAdminUser, logoutController, refreshAccessTokenController } from '../Controller/adminauthcontroller.js';


const adminauthRouter = express.Router();
adminauthRouter.post('/createAdmin', createAdminUser);

adminauthRouter.post('/adminLogin', adminLogin);

adminauthRouter.post('/logout', logoutController)

adminauthRouter.get('/refresh', refreshAccessTokenController)

export { adminauthRouter }