import { uploadFile } from "../Middleware/s3.js";
import { Doctor } from "../Models/AddDoctors.js"
import { error, success } from "../Utils/responseWrapper.js"
import bcrypt from "bcrypt"
import crypto from "crypto";



const generateFileName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString("hex");



const getAllDoctors = async (req, res) => {
    try {
        const alldoctors = await Doctor.find({});
        let newarr = [];
        for (let doctor of alldoctors) {
            var getdocts = await Doctor.find({ doctorid: doctor.doctorid })
            if (newarr.length == 0) {
                newarr.push(getdocts[0])
            }
            else {
                for (let i = 0; i < newarr.length; i++) {
                    let c = i;
                    if (newarr[c].doctorid === getdocts[0].doctorid) {
                        break;
                    }
                    else {
                        c++;
                    }
                    if (c == newarr.length) {
                        newarr.push(getdocts[0])
                        break;
                    }
                }
            }
        }
        return res.send(success(200, newarr.length))
        // return res.send(success(200,alldoctors))
    } catch (e) {
        return res.send(error(e.message))
    }

}

const addDoctor = async (req, res) => {
    const {
        nameOfTheDoctor,
        qulification,
        speciality,
        yearOfExprience,
        connsultationFee,
        description,
        email,
        phone,
        password,
        landmark,
        enterFullAddress,
        acceptAppointments,
        imgurl,
        location,
        category1,
        category2,
        category3,
        category4,
        mapLink,
    } = req.body

    const file = req.file


    if (!nameOfTheDoctor ||
        !qulification ||
        !speciality ||
        !yearOfExprience ||
        !connsultationFee ||
        !description ||
        !email ||
        !phone ||
        !password ||
        !acceptAppointments ||
        !landmark ||
        !enterFullAddress ||
        !location) {
        // return res.status(400).send("All fields are required");
        return res.send(error(400, "All fields are required"));
    }

    const imageName = file ? generateFileName() : imgurl;
    const fileBuffer = file?.buffer;

    try {



        const isAlreadyExist = await Doctor.findOne({ email })
        if (isAlreadyExist) return res.send(error(409, "Doctor already exists"));

        if (fileBuffer) {
            await uploadFile(fileBuffer, imageName, file.mimetype)
        }


        const hashedPassword = await bcrypt.hash(password, 10)

        const doctorid = crypto.randomInt(0, 1000000);


        const newDoctor = await Doctor.create({
            nameOfTheDoctor,
            qulification,
            speciality,
            yearOfExprience,
            connsultationFee,
            description,
            email,
            phone,
            password: hashedPassword,
            acceptAppointments,
            img: imageName,
            location,
            category1,
            category2,
            category3,
            category4,
            landmark,
            enterFullAddress,
            doctorid,
            mapLink,
        })
        newDoctor.imgurl = "https://d26dtlo3dcke63.cloudfront.net/" + newDoctor.img
        await newDoctor.save();
        res.send(success(201, newDoctor));
    } catch (e) {
        res.send(error(500, e.message))
    }
}

export {
    getAllDoctors,
    addDoctor
}