import mongoose from "mongoose";


const MasterShema =new mongoose.Schema({
    patientName :{type:String },
    age:{type:String},
    phoneNumber:{type:String},
    gender:{type:String},
    appointmentDate:{type:String},
    appointmentTime:{type:String},
    doctorsId:{type: mongoose.Schema.Types.ObjectId, ref:'Doctor'},
    doctorsName:{type:String},
    hospitalId:{type:String},
    updatedEmailAddress:{type:String},
    addDateofBirth:{type:String},
    password:{type:String},                                             
    status:{type:String ,default:"pending"},
    userId:{type: mongoose.Schema.Types.ObjectId, ref:'userpatient'},
    token:{type:String},
    createddate:{type:Date, default: Date.now()}
})


const Appointment= mongoose.model("userappointment",MasterShema)

export {Appointment}



