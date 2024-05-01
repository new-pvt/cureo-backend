import { Doctor } from "../Models/AddDoctors.js";
import { error, success } from "../Utils/responseWrapper.js";
import { uploadFile, getObjectSignedUrl } from '../Middleware/s3.js';
import crypto from "crypto";

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");






const editDoctorfile = async (req, res) => {
  const { id } = req.params;
  const {
    nameOfTheDoctor,
    qulification,
    speciality,
    yearOfExprience,
    connsultationFee,
    category1,
    category2,
    category3,
    category4,
    description,
    email,
    phone,
    acceptAppointments,
    gender,
    imgurl,
    location,
    services,
    landmark,
    enterFullAddress,
    dateOfBirth
  } = req.body
  const file = req.file


  if (!nameOfTheDoctor || !qulification || !speciality
    || !yearOfExprience || !connsultationFee || !email || !phone || !acceptAppointments || !location || !services || !gender || !landmark || !enterFullAddress || !description || !dateOfBirth
  ) {
    return res.send(error(500, { msg: "pls filled all field" }));
  }
  const imageName = file ? generateFileName() : imgurl;
  const fileBuffer = file?.buffer;

  try {
    if (fileBuffer) {
      await uploadFile(fileBuffer, imageName, file.mimetype)
    }
    // return console.log(services);
    const data = await Doctor.findByIdAndUpdate({ _id: id }, {
      nameOfTheDoctor,
      qulification,
      speciality,
      yearOfExprience,
      connsultationFee,
      img: imageName,
      category1,
      category2,
      category3,
      category4,
      description,
      email,
      phone,
      acceptAppointments,
      location,
      landmark,
      enterFullAddress,
      services,
      gender,
      dateOfBirth
    }, { new: true });
    data.imgurl = "https://d2m9x1v3tvj3q8.cloudfront.net/" + data.img
    await data.save();
    res.send(success(200, data));

  } catch (e) {
    res.send(error(500, e.message));
  }
}


const multipleloginprofile = async (req, res) => {
  const { doctorid } = req.params;
  if (!doctorid) {
    return res.send(error(400, "Pls give doctor id"));
  }
  try {
    const alldocts = await Doctor.find({ doctorid }).populate("hospitalId")
    for (let doctor of alldocts) {
      doctor.imgurl = "https://d2m9x1v3tvj3q8.cloudfront.net/" + doctor.img
    }
    return res.send(success(200, alldocts));
  } catch (e) {
    return res.send(error(500, e.message))
  }

}

const acceptAppointmentBy = async (req, res) => {
  const { id } = req.params
  const { acceptAppointments } = req.body

  try {
    const doctor = await Doctor.findByIdAndUpdate({ _id: id }, { acceptAppointments }, { new: true })

    return res.send(success(200, doctor))

  } catch (e) {
    return res.send(error(500, e.message))
  }

}


const getAllDoctorWithAllQuery = async (req, res) => {

  const { locationOrNameOfTheDoctor, speciality } = req.query;

  if (locationOrNameOfTheDoctor && speciality) {
    const query = {
      location: { $regex: locationOrNameOfTheDoctor || "", $options: "i" },
      landmark: { $regex: locationOrNameOfTheDoctor || "", $options: "i" },
      enterFullAddress: { $regex: locationOrNameOfTheDoctor || "", $options: "i" },
      nameOfTheDoctor: { $regex: locationOrNameOfTheDoctor || "", $options: "i" },
      speciality: { $regex: speciality || "", $options: "i" },
    }
    try {
      const doctors = await Doctor.find(query);
      return res.send(success(200, doctors));

    } catch (error) {
      return res.send(error(500, e.message))
    }
  } else if (locationOrNameOfTheDoctor) {
    const query = {
      location: { $regex: locationOrNameOfTheDoctor || "", $options: "i" },
      landmark: { $regex: locationOrNameOfTheDoctor || "", $options: "i" },
      enterFullAddress: { $regex: locationOrNameOfTheDoctor || "", $options: "i" },
      nameOfTheDoctor: { $regex: locationOrNameOfTheDoctor || "", $options: "i" },
    }
    try {
      const doctors = await Doctor.find(query);
      return res.send(success(200, doctors));

    } catch (error) {
      return res.send(error(500, e.message))
    }
  } else if (speciality) {
    const query = {
      speciality: { $regex: speciality || "", $options: "i" },
    }
    try {
      const doctors = await Doctor.find(query);
      return res.send(success(200, doctors));

    } catch (error) {
      return res.send(error(500, e.message))
    }
  } else {
    const doctors = await Doctor.find();
    return res.send(success(200, doctors));
  }
  console.log("This is speciality", speciality)
  // const nameOfTheDoctor = req.query.nameOfTheDoctor || ""
  // const speciality = req.query.speciality || ""
  // const location = req.query.location || ""
  // const landmark = req.query.landmark || ""
  // const enterFullAddress = req.query.landmark || ""



  try {
    // const userInput = req.query.userInput;


    // Use the user input to search the database in all specified keys
    // const doctors = await Doctor.find({
    //   $or: [
    //     { nameOfTheDoctor: new RegExp(locationOrNameOfTheDoctor, 'i') },
    //     { speciality: new RegExp(speciality, 'i') },
    //     { location: new RegExp(locationOrNameOfTheDoctor, 'i') },
    //     { landmark: new RegExp(locationOrNameOfTheDoctor, 'i') },
    //     // { connsultationFee: new RegExp(userInput, 'i') }
    //   ]
    // });


  } catch (e) {
    res.send(error(500, e.message));
  }

};

const getDoctorWithSpeciality = async (req, res) => {

  const speciality = req.query.speciality || "";

  // const query = {
  //   speciality: { $regex: search, $options: "i" }
  //         }
  try {

    const doctors = await Doctor.find({
      speciality: { $regex: speciality, $options: "i" }
    });

    return res.send(success(200, doctors));

  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getSpeacilityList = async (req, res) => {

  const { speciality } = req.query;

  try {

    const specialityList = await Doctor.find().distinct('speciality')

    return res.send(success(200, specialityList));
  } catch (e) {
    return res.send(error(500, e.message));
  }


};

// const getAllDoctorWithSpecificQuery = async (req, res) => {

//   // const nameOfTheDoctor = req.query.nameOfTheDoctor || ""
//   // const speciality = req.query.speciality || ""
//   // const location = req.query.location || ""
//   // const landmark = req.query.landmark || ""
//   // const enterFullAddress = req.query.landmark || ""

//   try {
//     const userInput = req.query.userInput;

//     // Use the user input to search the database in all specified keys
//     // const doctors = await Doctor.find({
//     //   $or: [
//     //     { nameOfTheDoctor: new RegExp(userInput, 'i') },
//     //     { speciality: new RegExp(userInput, 'i') },
//     //     { location: new RegExp(userInput, 'i') },
//     //     { landmark: new RegExp(userInput, 'i') },
//     //     // { connsultationFee: new RegExp(userInput, 'i') }
//     //   ]
//     // });

//     // export const getAllUsers = async (req, res) => {
//       console.log(req.query);
//       const speciality = req.query.speciality || ""
//       const gender = req.query.gender || ""
//       const status = req.query.status || ""
//       const sort = req.query.sort || ""
//       const page = req.query.page || 1
//       const ITEM_PER_PAGE = 4;

//       const query = {
//           fname: { $regex: search, $options: "i" }
//       }

//       if (gender !== "All") {
//           query.gender = gender
//       }

//       if (status !== "All") {
//           query.status = status
//       }

//       try {

//           const skip = (page - 1) * ITEM_PER_PAGE
//           const count = await User.countDocuments(query)


//           const users = await User.find(query)
//               .sort({ datecreated: sort == "new" ? -1 : 1 })
//               .limit(ITEM_PER_PAGE)
//               .skip(skip)

//               const pageCount = Math.ceil(count/ITEM_PER_PAGE)


//           res.status(200).json({
//               Pagination:{
//                   count, pageCount
//               },
//               users})
//       } catch (error) {
//           res.status(401).json(error)
//           console.log("Error While getting users data");
//       }
//   // }

//     return res.send(success(200, doctors));

//   } catch (e) {
//     res.send(error(500, e.message));
//   }

// };





export { editDoctorfile, multipleloginprofile, getAllDoctorWithAllQuery, getDoctorWithSpeciality, acceptAppointmentBy, getSpeacilityList }

