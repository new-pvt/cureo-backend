import mongoose from 'mongoose'
const otpSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    otp: {
        type: Number,

    },
    phone: {
        type: Number,
        unique: true,
    },

})

const Otp = mongoose.model('UserOtps', otpSchema);

export { Otp };