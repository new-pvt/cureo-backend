
import mongoose from "mongoose";
const MasterShema = new mongoose.Schema({
    nameOfStaff: { type: String },
    gender: { type: String, default: 'Female' },
    designation: { type: String, },
    email: { type: String },
    phone: { type: String },
    createddate: { type: Date, default: new Date() },
    hospitalId:
    {
        type: mongoose.Schema.Types.ObjectId, ref: 'Master',
    },
    mapLink: {
        type: String
    },
    dateOfBirth: {
        type: String,
    },
    img: {
        type: String,
        default: "6d27d5a62d61ead2a0084c78fb31307afd5fed6e9e42c49feb9efdbf03423061",
    },
    imgurl: {
        type: String,
        default: "https://d26dtlo3dcke63.cloudfront.net/67c30e16c91a42ff9f30f84959a0ce1be155b24d8bbe14583d51cbfcc430fdba"

    },
    status: { type: String, default: 'ACTIVE' }
}, { timestamps: true })

const staff = mongoose.model("staff", MasterShema)

export { staff }



