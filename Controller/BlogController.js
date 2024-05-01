import { uploadFile } from "../Middleware/s3.js";
import { Blog } from "../Models/Blog.js";
import { success, error } from "../Utils/responseWrapper.js"
import crypto from "crypto";


const generateFileName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString("hex");

const addBlog = async (req, res) => {
    const {
        author,
        title,
        description,
        publishDate
    } = req.body

    const file = req.file

    if (!author || !title || !description || !publishDate || !file) return res.send(error(400, "All Fields are required"))

    const imageName = generateFileName();
    const fileBuffer = file?.buffer;
    var imgurl;

    try {
        if (fileBuffer) {
            await uploadFile(fileBuffer, imageName, file.mimetype)
            imgurl = "https://d26dtlo3dcke63.cloudfront.net/" + imageName

        }

        const blog = await Blog.create({
            author,
            title,
            description,
            publishDate,
            img: imageName,
            imgurl: imgurl
        });


        res.send(success(200, blog));

    } catch (e) {
        return res.send(error(500, e.message));
    }


}

const getAllBlogs = async (req, res) => {
    try {
        const recentSignUpPatient = await Blog.find().sort({ createdAt: -1 })
        return res.send(success(200, recentSignUpPatient))
    } catch (e) {
        return res.send(error(500, e.message))
    }

}
export { addBlog, getAllBlogs }