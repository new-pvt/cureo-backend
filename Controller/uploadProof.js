import { uploadFile } from "../Middleware/s3.js";
import { Doctor } from "../Models/AddDoctors.js";
import { Master } from "../Models/Master.js";
import { error, success } from "../Utils/responseWrapper.js";
import crypto from "crypto";


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
            const user = await Doctor.findOneAndUpdate({ _id: id }, { $set: { "verification.status": "pending", "verification.proof": proof }}, { new: true });
            return res.send(success(200, user));

        }
    } catch (e) {
        return res.send(error(500, e.message));
    }
}
