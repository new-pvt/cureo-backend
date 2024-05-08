import mongoose from 'mongoose'
const otpSchema = mongoose.Schema({
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