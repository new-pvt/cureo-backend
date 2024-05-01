import express from 'express';
import { requireAdmin } from '../Middleware/requireAdmin.js';
import multer from "multer";
import { addBlog, getAllBlogs } from '../Controller/BlogController.js';


const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const blogRouter = express.Router();

blogRouter.post('/addBlog', requireAdmin, upload.single("image"), addBlog)
blogRouter.get('/getALLBlogs', upload.single("image"), getAllBlogs)

export { blogRouter }