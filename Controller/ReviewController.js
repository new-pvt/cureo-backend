import { Review } from "../Models/Review.js";
import { Doctor } from "../Models/AddDoctors.js";
import { error, success } from "../Utils/responseWrapper.js"

export const ReviewCreation = async (req, res) => {
    const { rating, message } = req.body;
    const { doctorid, userid } = req.params;
    if (!doctorid || !userid || !rating) {
        return res.send(error(500, "pls filled all field"));

    }
    try {

        const newReview = await Review.create(
            {
                doctorid,
                userid,
                rating,
                message
            }
        )
        // Find the Doctor by ID
        let doctor = await Doctor.findById(doctorid).sort({createddate:-1});

        // Push the newReview's ID into the doctor's reviews array
        doctor.reviews.push(newReview._id);

        // Save the doctor document
        await doctor.save();

        res.send(success(201, newReview));
    } catch (e) {
        res.send(error(500, e.message));
    }
}


export const GetReview = async (req, res) => {
    try {
        const { id } = req.params;

        // Create a new Review document
        const newReview = await Review.create(req.body);

        // Find the Doctor by ID
        let doctor = await Doctor.findById(id);

        // Push the newReview's ID into the doctor's reviews array
        doctor.reviews.push(newReview._id);

        // Save the doctor document
        await doctor.save();

        res.send(success(201, { newReview, doctor }));
    } catch (e) {
        res.send(error(500, e.message));
    }
}
