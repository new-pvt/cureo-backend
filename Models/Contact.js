
import mongoose from "mongoose";
const MasterShema = new mongoose.Schema({
    name: { type: String },
    phone: { type: String, },
    email: { type: String },
    message: { type: String },
    createddate: { type: Date, default: new Date() },
}, { timestamps: true })

const contact = mongoose.model("contact", MasterShema)

export { contact }



