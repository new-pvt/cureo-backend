import mongoose from "mongoose";


const MasterShema = new mongoose.Schema({
    nameOfTheDoctor: { type: String },
    qulification: { type: String, },
    speciality: { type: String },
    yearOfExprience:
        { type: Number },
    email: {
        type: String,
        unique: true
    },
    username: {
        type: String,
    },
    phone:
    {
        type: Number,
        unique: true
    },
    password: {
        type: String,
    },
    connsultationFee: {
        type: Number
    },
    location: {
        type: String,
        default: null
    },
    gender: {
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
        default: "https://d2m9x1v3tvj3q8.cloudfront.net/67c30e16c91a42ff9f30f84959a0ce1be155b24d8bbe14583d51cbfcc430fdba"
    },
    mapLink: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    acceptAppointments: {
        type: String,
        required: true,
        default: "byToken"
    },
    landmark: { type: String },
    enterFullAddress: { type: String },
    services: [{ type: String }],
    verification: {
        status: {
            type: String,
            required: true,
            default: "Not Applied Yet"
        },
        message: {
            type: String,
        },
        proof: {
            type: String
        }
    }

}, { timestamps: true })

const Doctor = mongoose.model("Doctor", MasterShema)

export { Doctor }



