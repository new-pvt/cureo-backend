import mongoose from "mongoose";
const Appointment = new mongoose.Schema({
    doctorid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userpatient"
    },
    hospitalid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Master"
    },
    name: {
        type: String,
        default: "name"
    },
    age: {
        type: Number,
        default: 9189214567
    },
    gender: {
        type: String,
        default: "Gender"
    },
    phone: {
        type: Number,
        default: 9189214567
    },
    AppointmentNotes: {
        type: String,
        default: "Notes",
    },
    appointmentDate: {
        type: Date,
    },
    AppointmentTime: {
        type: String,
    },
    status:
    {
        type: String,
        default: "pending"
    },
    remark: {
        type: String,
    },
    createddate: { type: Date, default: new Date() },

}, { timestamps: true })

const AppointmentModel = mongoose.model("Appointment", Appointment);
export { AppointmentModel }