import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
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
    hospital_name: {
        type: String,
    },
    hospital_type: {
        type: String,
    },
    hospital_location: {
        type: String,
    },
    hospital_landmark: {
        type: String,
    },
    hospital_address: {
        type: String,
    },
    mapLink: {
        type: String
    },

})

const User = mongoose.model('user', userSchema);

export { User };