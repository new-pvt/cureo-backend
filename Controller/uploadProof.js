import { transporter } from "../Middleware/nodemailer.js";
import { uploadFile } from "../Middleware/s3.js";
import { Doctor } from "../Models/AddDoctors.js";
import { Master } from "../Models/Master.js";
import { error, success } from "../Utils/responseWrapper.js";
import crypto from "crypto";

const approve = (req, res) => {
    console.log("Click by mail")
}

const genrateMail = (role, name, email, proof) => {
    const mailOptions = {
        from: "gtest3681@gmail.com",
        to: email,
        subject: `Profile Approval Request: ${role}`, // Subject line
        text: `Dear Nihal,
    
    A new ${role} has signed up on our platform and has requested profile approval.
    
    ${role} Details:
    - Name: ${name}
    - Email: ${email}
    - User Type: ${role}
    
    Attached to this email, you will find the documents uploaded by the user for verification.
    
    Please review the profile information and attached documents at your earliest convenience.
    
    Thank you.
    
    Best regards,
    Team CureO`,
        html: `<p>Dear Nihal,</p>
                <p>A new ${role} has signed up on our platform and has requested profile approval.</p>
                <p>User Details:</p>
                <ul>
                    <li>Name: ${name}</li>
                    <li>Email: ${email}</li>
                    <li>User Type: ${role}</li>
                </ul>
                <p>Attached to this email, you will find the documents uploaded by the user for verification.</p>
                <p>Please review the profile information and attached documents at your earliest convenience.</p>
                <p>Thank you.</p>
                <p>Best regards,<br>Team CureO</p>
                <a href=${proof} >See Document</a>
                `
    }

    transporter.sendMail(mailOptions)
}





const generateFileName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString("hex");


export const uploadProof = async (req, res) => {
    const { id, role } = req.body;
    const file = req.file;

    if (!id || !role || !file) return res.send(error(401, "All Fields Required"))

    const imageName = generateFileName();
    const fileBuffer = file?.buffer;

    try {
        if (fileBuffer) {
            await uploadFile(fileBuffer, imageName, file.mimetype)
        }
        const proof = "https://d2m9x1v3tvj3q8.cloudfront.net/" + imageName

        if (role == "MASTER") {
            const user = await Master.findOneAndUpdate({ _id: id }, { verification: { status: "pending", proof: proof } }, { new: true });
            return res.send(success(200, user));
        }

        if (role == "DOCTOR") {
            const user = await Doctor.findOneAndUpdate({ _id: id }, { $set: { "verification.status": "pending", "verification.proof": proof } }, { new: true });
            res.send(success(200, user));
            const opts = genrateMail(role, user?.nameOfTheDoctor, user?.email, proof)


        }
    } catch (e) {
        return res.send(error(500, e.message));
    }
}
