import mongoose from "mongoose";
const notifyMe = new mongoose.Schema({
    email :{type:String },
});

const Notify = mongoose.model('notify',notifyMe);

export {Notify};