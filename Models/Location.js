
import mongoose from "mongoose";
const MasterShema =new mongoose.Schema({
    city :{type:String },
    searchDoctor:{type:String,}
    // connsultationFee:{type:String}, 
})

const location= mongoose.model("location",MasterShema)

export {location}



