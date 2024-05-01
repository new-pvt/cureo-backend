import mongoose from "mongoose";


const MasterShema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true },
    dateOfBirth: { type: String },
    phone: { type: String },
    img: {
        type: String,
        default: "6d27d5a62d61ead2a0084c78fb31307afd5fed6e9e42c49feb9efdbf03423061",
    },
    password: { type: String },
    createddate: { type: Date, default: new Date() },
    location: { type: String, default: "Nagpur" },
    role: { type: String, default: "PATIENT" },
    imgurl: {
        type: String,
        default: "https://d2m9x1v3tvj3q8.cloudfront.net/67c30e16c91a42ff9f30f84959a0ce1be155b24d8bbe14583d51cbfcc430fdba"
    },
    gender: { type: String },
    mapLink: {
        type: String,
    },
    bloodgroup: {
        type: String,
    },
    Healthconcern:[{ type: String }],
    medicalRecord: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MedicalRecord' }]


}, { timestamps: true })
const userpatient = mongoose.model("userpatient", MasterShema)
export { userpatient }



