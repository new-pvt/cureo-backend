import express from 'express';
import { addCompleteDoctor, addDUID, addUsername, dynamicAddingDoctors, renameKeyApi } from '../Controller/dynamicAddingDoctorsController.js';

const dynamicAddingDoctorsRouter = express.Router();

dynamicAddingDoctorsRouter.get('/dynamicAddingDoctors', dynamicAddingDoctors);
dynamicAddingDoctorsRouter.post('/renameKey', renameKeyApi);


// dynamicAddingDoctorsRouter.post('/addRequireData', addRequireData);

// dynamicAddingDoctorsRouter.post('/addUsername', addUsername);
dynamicAddingDoctorsRouter.post('/addDoctorid', addDUID);
dynamicAddingDoctorsRouter.post('/addDoctorsinsertmany', addCompleteDoctor);


export {dynamicAddingDoctorsRouter}