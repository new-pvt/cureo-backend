import mongoose from 'mongoose'

const blogSchema = mongoose.Schema({
    author: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    imgurl: {
        type: String,
    },
    users: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "userpatient"
            },
            view: {
                type: Number,
                default: 0,
            }
        },

    ],
    views: {
        type: Number,
        default: 0,
    }
    // {
    //     type: String,
    //     required: true
    // },
}, { timestamps: true });
const Blog = mongoose.model('blog', blogSchema);

export { Blog };