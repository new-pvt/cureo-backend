


import { contact } from "../Models/Contact.js";
import { error, success } from "../Utils/responseWrapper.js";

const contactCreation = async (req, res) => {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
        return res.status(404).send("pls filled all fields")
    }
    try {
        let result = await contact.create({ name, email, phone, message });
        res.send(
            success(201, result))
    } catch (e) {
        res.send(
            error(500, e))
    }
}


const getContact = async (req, res) => {
    try {
        let result = await contact.find()
        res.send(
            success(201, result))
    } catch (e) {
        res.send(
            error(500, e))
    }
}
export { contactCreation, getContact }

