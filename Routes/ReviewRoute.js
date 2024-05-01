
import express from 'express'
import { ReviewCreation } from "../Controller/ReviewController.js"
import { requireUser } from '../Middleware/requireUser.js';
const review = express.Router();

review.post('/reviewCreation/:doctorid/:userid', requireUser, ReviewCreation)
// Router.get('/getSingleDoctor/:id', getSingleDoctor)


export { review } 