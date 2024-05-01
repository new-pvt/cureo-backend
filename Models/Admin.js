import mongoose from 'mongoose'

const adminSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
}, { timestamps: true });
const Admin = mongoose.model('admin', adminSchema);

export { Admin };