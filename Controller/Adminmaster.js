import { uploadFile } from "../Middleware/s3.js";
import { Master } from "../Models/Master.js";
import { error, success } from "../Utils/responseWrapper.js"
import bcrypt from "bcrypt"
import crypto from "crypto";



const generateFileName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString("hex");

const addHospital = async (req, res) => {
    const {
        nameOfhospitalOrClinic,
        hospitalType,
        location,
        landmark,
        enterFullAddress,
        email,
        phone,
        password,
        imgurl,
        mapLink
    } = req.body

    const file = req.file


    if (!nameOfhospitalOrClinic ||
        !hospitalType ||
        !location ||
        !landmark ||
        !enterFullAddress ||
        !email ||
        !phone ||
        !password) {
        // return res.status(400).send("All fields are required");
        return res.send(error(400, "All fields are required"));
    }

    const imageName = file ? generateFileName() : imgurl;
    const fileBuffer = file?.buffer;

    try {



        const isAlreadyExist = await Master.findOne({ email })
        if (isAlreadyExist) return res.send(error(409, "Hospital already exists"));

        if (fileBuffer) {
            await uploadFile(fileBuffer, imageName, file.mimetype)
        }


        const hashedPassword = await bcrypt.hash(password, 10)

        const newHospital = await Master.create({
            nameOfhospitalOrClinic,
            hospitalType,
            location,
            landmark,
            enterFullAddress,
            email,
            phone,
            img: imageName,
            password: hashedPassword,
            mapLink,
        })
        newHospital.imgurl = "https://d26dtlo3dcke63.cloudfront.net/" + newHospital.img
        await newHospital.save();
        res.send(success(201, newHospital));
    } catch (e) {
        res.send(error(500, e.message))
    }
}

export {
    addHospital
}