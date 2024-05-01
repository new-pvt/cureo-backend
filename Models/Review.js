
import mongoose from "mongoose";
const MasterShema = new mongoose.Schema({
    doctorid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userpatient"
    },
    rating: { type: Number },
    message: { type: String },
    // connsultationFee:{type:String}, 
    createddate: { type: Date, default: new Date() },

}, { timestamps: true })

const Review = mongoose.model("Review", MasterShema)

export { Review }



