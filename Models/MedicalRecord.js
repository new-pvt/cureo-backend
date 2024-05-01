
import mongoose from "mongoose";
const MasterShema = new mongoose.Schema({
    medicalImg: { type: String },
    name: { type: String },
    medicalRecordName: { type: String },
    createddate: { type: Date, default: new Date() },
}, { timestamps: true })

const MedicalRecord = mongoose.model("MedicalRecord", MasterShema)

export { MedicalRecord }



