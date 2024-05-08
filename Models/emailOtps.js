import mongoose from 'mongoose'
const emailOtpsSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    otp: {
        type: Number,

    },

})

const EmailOtps = mongoose.model('EmailOtp', emailOtpsSchema);

export { EmailOtps };