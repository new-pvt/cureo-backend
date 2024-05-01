
import express from 'express'
import { contactCreation, getContact } from '../Controller/Contctcontroller.js';
const contact = express.Router();

contact.post('/contactCreation', contactCreation)
contact.get('/getContact', getContact)
// Router.get('/getSingleDoctor/:id', getSingleDoctor)


export { contact } 