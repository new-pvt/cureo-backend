


import { location } from "../Models/Location.js";
import { Doctor } from "../Models/AddDoctors.js";
import { error, success } from "../Utils/responseWrapper.js";

const LocationCreation = async (req, res) => {
    try {
        let result = await location.create(req.body)
        res.send(
            success(201, result))
    } catch (e) {
        res.send(
            error(500, e))
    }
}
const getDoctorforLocation = async (req, res) => {
    try {
        let result = await Doctor.find({ location: req.body.location, hospitalId: req.params.id })
        res.send(
            success(201, result))
    } catch (e) {
        res.send(
            error(500, e))
    }
}

const getDoctorforspecialties = async (req, res) => {
    try {
        let result = await Doctor.find({ speciality: { $regex: req.body.speciality, $options: "i" } })
        res.send(
            success(201, result))
    } catch (e) {
        res.send(
            error(500, e))
    }
}

const getDoctorforspecialtiesAbhay = async (req, res) => {

    const search = req.query.search || ""
    const speciality = req.query.speciality || ""
    const location = req.query.location || ""

    const query = {
        // hospitalId: req.params.hosp_id,
        nameOfTheDoctor: { $regex: search, $options: "i" },
        speciality: { $regex: speciality, $options: "i" },
        location: { $regex: location, $options: "i" }
    }
    try {
        let result = await Doctor.find(query);
        res.send(
            success(201, result))
    } catch (e) {
        res.send(
            error(500, e))
    }
}




export { LocationCreation, getDoctorforLocation, getDoctorforspecialties, getDoctorforspecialtiesAbhay }

