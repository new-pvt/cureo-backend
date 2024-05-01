
import express from 'express'
import { courseCreation ,getCourse ,getCourseByName, getSingleCourse} from '../Controller/CourseController.js';
const course = express.Router();

course.post('/courseCreation', courseCreation)
course.get('/getCourse', getCourse)
course.get('/getSingleCourse/:courseId', getSingleCourse)
course.post("/getCourseByName",getCourseByName)
// Router.get('/getSingleDoctor/:id', getSingleDoctor)


 export {course} 