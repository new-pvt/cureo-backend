import mongoose from "mongoose";


const MasterShema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
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
        default: "https://d2m9x1v3tvj3q8.cloudfront.net/1d7a0733c82b1cdf9f08e2424ea9ef95f070dc8ab773ff4fa55d7641eaf97956"
    },
    gender: { type: String },
    mapLink: {
        type: String,
    },
    bloodgroup: {
        type: String,
    },
    Healthconcern: [{ type: String }],
    medicalRecord: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MedicalRecord' }]


}, { timestamps: true })
const userpatient = mongoose.model("userpatient", MasterShema)
export { userpatient }



