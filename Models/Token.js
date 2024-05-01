import mongoose from "mongoose";

// This schema for online appointments slots 
const TokenSchema = new mongoose.Schema({
    doctor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
    },
    date: {
        type: Date,
    },
    Starttime1: {
        type: String,
        default: 0
    },
    Endtime1: {
        type: String,
        default: 0
    },
    Starttime2: {
        type: String,
        default: 0
    },
    Endtime2: {
        type: String,
        default: 0
    },
    Starttime3: {
        type: String,
        default: 0
    },
    Endtime3: {
        type: String,
        default: 0
    },
    appointmentByToken: {
        type: Boolean,
        default: true
    },
    createddate: { type: Date, default: new Date() },
}, { timestamps: true })

const Tokens = mongoose.model("AppointmentToken", TokenSchema);
export { Tokens };