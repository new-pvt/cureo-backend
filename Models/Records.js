
import mongoose from "mongoose";
const MedicalHistorySchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userpatient"
    },
    img: {
        type: String,
        default: "6d27d5a62d61ead2a0084c78fb31307afd5fed6e9e42c49feb9efdbf03423061",
    },
    imgurl: {
        type: String,
        default: "https://d26dtlo3dcke63.cloudfront.net/67c30e16c91a42ff9f30f84959a0ce1be155b24d8bbe14583d51cbfcc430fdba"

    },
    imgname:{
        type:String,
    },
    imgtype:{
        type:String,
    },
    imgsize:{
        type:Number,
    },
    createddate: { type: Date, default: new Date() },

}, { timestamps: true })

const MedicalHistory = mongoose.model("MedicalHistory", MedicalHistorySchema)

export { MedicalHistory }



