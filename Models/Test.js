import mongoose from "mongoose";


const DoctorSchema = new mongoose.Schema({
    nameOfTheDoctor: { type: String },
    qulification: { type: String, },
    speciality: { type: String },
    yearOfExprience:
        { type: Number },
    email: {
        type: String,
        required: true,
    },
    phone:
    {
        type: Number,
        min: 10,
        required: true,
    },
    password: {
        type: String,
    },
    username: {
        type: String,
    },
    connsultationFee: {
        type: Number
    },
    location: {
        type: String,
        default: null
    },
    hospitalId:
    {
        type: mongoose.Schema.Types.ObjectId, ref: 'Master',
        default: "6531c8f389aee1b3fbd0a2d7"
    },
    img: {
        type: String,
        default: "67c30e16c91a42ff9f30f84959a0ce1be155b24d8bbe14583d51cbfcc430fdba",
    },
    category1: {
        type: String,
        required: true,
        default: "None"
    },
    category2: {
        type: String,
        required: true,
        default: "None"
    },
    category3: {
        type: String,
        required: true,
        default: "None"
    },
    category4: {
        type: String,
        required: true,
        default: "None"
    },
    description: {
        type: String,
        required: true,
        default: "description"
    },
    createddate: { type: Date, default: new Date() },
    status: { type: String, default: 'ACTIVE' },
    role: { type: String, default: "DOCTOR" },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    doctorid: {
        type: Number,
        required: true,
    },
    imgurl: {
        type: String,
        default: "https://d26dtlo3dcke63.cloudfront.net/67c30e16c91a42ff9f30f84959a0ce1be155b24d8bbe14583d51cbfcc430fdba"
    },
    mapLink: {
        type: String
    },
    acceptAppointments: {
        type: String,
        required: true,
        default: "byToken"
    },
    landmark: { type: String },
    enterFullAddress: { type: String },
}, { timestamps: true })

const Test = mongoose.model("test", DoctorSchema)

export { Test }



