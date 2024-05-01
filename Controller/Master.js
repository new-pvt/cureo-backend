import { getObjectSignedUrl, uploadFile } from "../Middleware/s3.js";
import { Doctor } from "../Models/AddDoctors.js";
import { staff } from "../Models/Addstaff.js";
import { Master } from "../Models/Master.js";
import { error, success } from "../Utils/responseWrapper.js";
import crypto from "crypto";

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const getHotspitalsDoctorForHomeScreen = async (req, res) => {
  try {
    const findHospitals = await Master.find().populate("doctors");
    // const findHospitals = await Master.find({hospitalId:{$ne: "6531c8f389aee1b3fbd0a2d7"}}).populate("doctors");

    return res.send(success(200, findHospitals))
  } catch (error) {
    return res.send(error(error.message))
  }
}
const getHotspitalsByIdAndTheirsDoctors = async (req, res) => {
  const { hospitalId } = req.params
  try {
    const findHospitals = await Master.findOne({ _id: hospitalId }).populate("doctors")

    return res.send(success(200, findHospitals))
  } catch (error) {
    return res.send(error(error.message))
  }
}

const hospitalprofileupdate = async (req, res) => {
  const { id } = req.params;
  const file = req.file;
  const {
    nameOfhospitalOrClinic,
    hospitalType,
    location,
    landmark,
    enterFullAddress,
    imgurl,
    mapLink
  } = req.body;


  if (
    !nameOfhospitalOrClinic ||
    !hospitalType ||
    !location ||
    !landmark ||
    !enterFullAddress
  ) {
    return res.send(error(409, "pls filled all field in given fields"));
  }
  const imageName = file ? generateFileName() : imgurl;
  const fileBuffer = file?.buffer;
  if (fileBuffer) {
    await uploadFile(fileBuffer, imageName, file.mimetype);
  }
  try {
    const data = await Master.findByIdAndUpdate(
      { _id: id },
      {
        nameOfhospitalOrClinic,
        hospitalType,
        location,
        landmark,
        enterFullAddress,
        img: imageName,
        mapLink,
      },
      { new: true }
    ).select("-password")

    data.imgurl = "https://d2m9x1v3tvj3q8.cloudfront.net/" + data.img
    await data.save();


    var hospid = data._id;
    const result = await Doctor.find({ hospitalId: hospid });
    for (let newloaction of result) {
      newloaction.location = data.location;
      await newloaction.save();
    }
    res.send(success(200, data));
  } catch (e) {
    res.send(error(500, e.message));
  }
};
const getdoctorbytheirid = async (req, res) => {
  const { doctorid, hospitalId } = req.body;
  if (!doctorid && !hospitalId) {
    return res.send(error(409, { msg: "pls give doctorid and hospitalid" }));
  }
  try {
    const isdoctoravailableinhospital = await Doctor.findOne({ $and: [{ doctorid }, { hospitalId }, { status: "ACTIVE" }] })
    if (isdoctoravailableinhospital) {
      return res.send(error(403, "Doctor already exists."))
    }
    const doctorinfo = await Doctor.findOne({
      $and: [{ doctorid: doctorid }, { hospitalId: "6531c8f389aee1b3fbd0a2d7" }]
    });
    if (!doctorinfo) {
      return res.send(error(404, "Invalid doctor id"))
    }
    return res.send(success(200, doctorinfo));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

const getAllHospitalsWithAllQuery = async (req, res) => {

  // const nameOfTheDoctor = req.query.nameOfTheDoctor || ""
  // const speciality = req.query.speciality || ""
  // const location = req.query.location || ""
  // const landmark = req.query.landmark || ""
  // const enterFullAddress = req.query.landmark || ""

  try {
    const userInput = req.query.userInput;

    // Use the user input to search the database in all specified keys
    const hospitals = await Master.find({
      $or: [
        { nameOfhospitalOrClinic: new RegExp(userInput, 'i') },
        { hospitalType: new RegExp(userInput, 'i') },
        { location: new RegExp(userInput, 'i') },
        { landmark: new RegExp(userInput, 'i') },
        { mapLink: new RegExp(userInput, 'i') },
        // { connsultationFee: new RegExp(userInput, 'i') }
      ]
    });

    return res.send(success(200, hospitals));

  } catch (e) {
    res.send(error(500, e.message));
  }

};

//Testing this api for add doctor's in hospital and push doctor's id into doctors array

const addDoctorbyhospital = async (req, res) => {
  const { hospitalid } = req.params;
  const file = req.file;
  const {
    nameOfTheDoctor,
    qulification,
    speciality,
    yearOfExprience,
    email,
    phone,
    connsultationFee,
    doctorid,
    imgurl,
    category1,
    category2,
    category3,
    category4,
    description,
    gender,
    services,
    location,
    landmark,
    enterFullAddress,
    mapLink,
  } = req.body;

  if (
    !nameOfTheDoctor ||
    !qulification ||
    !speciality ||
    !yearOfExprience ||
    !email ||
    !phone ||
    !connsultationFee ||
    !doctorid ||
    !hospitalid ||
    !location ||
    !landmark ||
    !services ||
    !gender ||
    !enterFullAddress
  ) {
    return res.send(error(401, "All fields are compulsory"));
  }
  const imageName = file ? generateFileName() : imgurl;
  const fileBuffer = file?.buffer;
  if (fileBuffer) {
    await uploadFile(fileBuffer, imageName, file.mimetype);
  }

  try {
    const isdoctoravailableinhospital = await Doctor.findOne({ $and: [{ doctorid }, { hospitalId: hospitalid }, { status: "ACTIVE" }] })
    if (isdoctoravailableinhospital) {
      return res.send(error(500, { msg: "This doctor already available in your hospital" }))
    }
    const isdoctorpreviouslyavailableinhospital = await Doctor.findOne({ $and: [{ doctorid }, { hospitalId: hospitalid }, { status: "REMOVED" }] })
    if (isdoctorpreviouslyavailableinhospital) {
      const editDoctor = await Doctor.findOneAndUpdate(
        { $and: [{ doctorid }, { hospitalId: hospitalid }, { status: "REMOVED" }] },
        {
          nameOfTheDoctor,
          qulification,
          speciality,
          yearOfExprience,
          email,
          phone,
          connsultationFee,
          hospitalId: hospitalid,
          doctorid,
          img: imageName,
          status: "ACTIVE",
          category1,
          category2,
          category3,
          category4,
          description,
          mapLink,
          location,
          landmark,
          gender,
          services,
          enterFullAddress,
        },
        { new: true }
      );

      editDoctor.imgurl = "https://d2m9x1v3tvj3q8.cloudfront.net/" + editDoctor.img
      return res.send(success(200, { editDoctor }));
    }
    const addDoctor = await Doctor.create({
      nameOfTheDoctor,
      qulification,
      speciality,
      yearOfExprience,
      email,
      phone,
      connsultationFee,
      hospitalId: hospitalid,
      img: imageName,
      doctorid,
      category1,
      category2,
      category3,
      category4,
      description,
      location,
      gender,
      services,
      landmark,
      enterFullAddress,
      mapLink,
    });

    await Master.findOneAndUpdate(
      { _id: hospitalid },
      { $addToSet: { doctors: addDoctor._id } }
    );

    addDoctor.imgurl = "https://d2m9x1v3tvj3q8.cloudfront.net/" + addDoctor.img
    return res.send(success(200, { addDoctor }));

  } catch (e) {
    res.send(error(500, e.message));
  }

};
// const addDoctorbyhospital = async (req, res) => {
//   const { hospitalid } = req.params;
//   const file = req.file;
//   const {
//     nameOfTheDoctor,
//     qulification,
//     speciality,
//     yearOfExprience,
//     email,
//     phone,
//     connsultationFee,
//     doctorid,
//     imgurl,
//     category1,
//     category2,
//     category3,
//     category4,
//     description,
//     location,
//     mapLink,
//   } = req.body;

//   if (
//     !nameOfTheDoctor ||
//     !qulification ||
//     !speciality ||
//     !yearOfExprience ||
//     !email ||
//     !phone ||
//     !connsultationFee ||
//     !doctorid ||
//     !hospitalid ||
//     !location
//   ) {
//     return res.send(error(401, "All fields are compulsory"));
//   }
//   const imageName = file ? generateFileName() : imgurl;
//   const fileBuffer = file?.buffer;
//   if (fileBuffer) {
//     await uploadFile(fileBuffer, imageName, file.mimetype);
//   }

//   try {
//     const isdoctoravailableinhospital = await Doctor.findOne({ $and: [{ doctorid }, { hospitalId: hospitalid }, { status: "ACTIVE" }] })
//     if (isdoctoravailableinhospital) {
//       return res.send(error(500, { msg: "this doctor already available in your hospital" }))
//     }
//     const isdoctorpreviouslyavailableinhospital = await Doctor.findOne({ $and: [{ doctorid }, { hospitalId: hospitalid }, { status: "REMOVED" }] })
//     if (isdoctorpreviouslyavailableinhospital) {
//       const editDoctor = await Doctor.findOneAndUpdate(
//         { $and: [{ doctorid }, { hospitalId: hospitalid }, { status: "REMOVED" }] },
//         {
//           nameOfTheDoctor,
//           qulification,
//           speciality,
//           yearOfExprience,
//           email,
//           phone,
//           connsultationFee,
//           hospitalId: hospitalid,
//           doctorid,
//           img: imageName,
//           status: "ACTIVE",
//           category1,
//           category2,
//           category3,
//           category4,
//           description,
//           mapLink,
//         },
//         { new: true }
//       );

//       editDoctor.imgurl = "https://d26dtlo3dcke63.cloudfront.net/" + editDoctor.img
//       return res.send(success(200, { editDoctor }));
//     }
//     const addDoctor = await Doctor.create({
//       nameOfTheDoctor,
//       qulification,
//       speciality,
//       yearOfExprience,
//       email,
//       phone,
//       connsultationFee,
//       hospitalId: hospitalid,
//       img: imageName,
//       doctorid,
//       category1,
//       category2,
//       category3,
//       category4,
//       description,
//       location,
//       mapLink,
//     });
//     addDoctor.imgurl = "https://d26dtlo3dcke63.cloudfront.net/" + addDoctor.img
//     return res.send(success(200, { addDoctor }));

//   } catch (e) {
//     res.send(error(500, e.message));
//   }
// };

const getSingleDoctor = async (req, res) => {
  try {
    let result = await Doctor.findById(req.params.id).populate("reviews");
    await result.populate("reviews.userid");
    result.imgurl = "https://d2m9x1v3tvj3q8.cloudfront.net/" + result.img

    res.send(success(201, result));
  } catch (e) {
    return res.send(error(500, e));
  }
};
const getSingleStaff = async (req, res) => {
  try {
    let result = await staff.findById(req.params.id);
    result.imgurl = "https://d2m9x1v3tvj3q8.cloudfront.net/" + result.img
    res.send(success(201, result));
  } catch (error) {
    return res.send(error(500, e));
  }
};
const editDoctorbyhospital = async (req, res) => {
  const { hospitalid } = req.params;
  const file = req.file;
  const {
    nameOfTheDoctor,
    qulification,
    speciality,
    yearOfExprience,
    email,
    phone,
    password,
    connsultationFee,
    doctorid,
    category1,
    category2,
    category3,
    category4,
    description,
    mapLink,
  } = req.body;

  if (
    !nameOfTheDoctor ||
    !qulification ||
    !speciality ||
    !yearOfExprience ||
    !email ||
    !phone ||
    !password ||
    !connsultationFee ||
    !doctorid
  ) {
    return res.send(error(404, { msg: "All fields are compulsory" }));
  }
  try {
    const imageName = file ? generateFileName() : "6d27d5a62d61ead2a0084c78fb31307afd5fed6e9e42c49feb9efdbf03423061";
    const fileBuffer = file?.buffer;
    if (fileBuffer) {
      await uploadFile(fileBuffer, imageName, file.mimetype);
    }

    const editDoctor = await Doctor.findOneAndUpdate(
      { $and: [{ doctorid }, { hospitalId: hospitalid }] },
      {
        nameOfTheDoctor,
        qulification,
        speciality,
        yearOfExprience,
        email,
        phone,
        password,
        connsultationFee,
        hospitalId: hospitalid,
        doctorid,
        img: imageName,
        category1,
        category2,
        category3,
        category4,
        description,
        mapLink,
      },
      { new: true }
    );

    editDoctor.imgurl = "https://d2m9x1v3tvj3q8.cloudfront.net/" + editDoctor.img
    return res.send(success(200, { editDoctor }));
  } catch (error) {
    res.status(500).send({ error, status: "error", code: 500 });
  }
};
const AddStaff = async (req, res) => {
  const file = req.file;
  const {
    nameOfStaff,
    designation,
    email,
    phone,
    hospitalId,
    gender,
    dateOfBirth
  } = req.body;
  if (
    !nameOfStaff ||
    !designation ||
    !email ||
    !phone ||
    !hospitalId ||
    !gender ||
    !dateOfBirth
  ) {
    return res.send(error(400, "pls filled all field"));
  }

  const imageName = file ? generateFileName() : "6d27d5a62d61ead2a0084c78fb31307afd5fed6e9e42c49feb9efdbf03423061";
  const fileBuffer = file?.buffer;
  if (fileBuffer) {
    await uploadFile(fileBuffer, imageName, file.mimetype);
  }

  try {
    let result = await staff.create({
      gender,
      nameOfStaff,
      designation,
      email,
      phone,
      hospitalId,
      dateOfBirth,
      img: imageName,
    });
    result.imgurl = "https://d2m9x1v3tvj3q8.cloudfront.net/" + result.img
    await result.save();
    return res.send(success(201, result));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
const editStaff = async (req, res) => {
  const file = req.file;
  const { id } = req.params;
  const {
    nameOfStaff,
    designation,
    email,
    phone,
    hospitalId,
    gender,
    dateOfBirth,
    imgurl,
    mapLink,
  } = req.body;

  const imageName = file ? generateFileName() : imgurl;
  const fileBuffer = file?.buffer;
  if (fileBuffer) {
    await uploadFile(fileBuffer, imageName, file.mimetype);

  }

  try {
    const result = await staff.findByIdAndUpdate(
      { _id: id },
      {
        nameOfStaff,
        designation,
        email,
        phone,
        hospitalId,
        gender,
        dateOfBirth,
        img: imageName,
      },
      { new: true }
    );

    result.imgurl = await getObjectSignedUrl(result.img);
    return res.send(success(201, result));
  } catch (e) {
    return res.send(error(500, e));
  }
};
const alldoctorandstaffforhospital = async (req, res) => {
  const { hospid } = req.params;
  try {
    const alldoctors = await Doctor.find({ hospitalId: hospid });
    const allstaffs = await staff.find({ hospitalId: hospid });
    for (let doctor of alldoctors) {
      doctor.imgurl = await getObjectSignedUrl(doctor.img)
    }
    for (let staff of allstaffs) {
      staff.imgurl = await getObjectSignedUrl(staff.img)
    }
    // alldoctors.imgurl = await getObjectSignedUrl(alldoctors.img);
    // allstaffs.imgurl = await getObjectSignedUrl(allstaffs.img);
    return res.send(success(200, { alldoctors, allstaffs }));
  } catch (e) {
    res.send(error(e.message));
  }
};
const alldoctors = async (req, res) => {
  const { hospid } = req.params;
  const { search } = req.query;

  try {
    let query = { hospitalId: hospid, status: "ACTIVE" };

    if (search) {
      if (/^\d+$/.test(search)) {
        // Check if search query is a number
        query.$or = [
          { doctorid: search },
          { phone: search } // Assuming phone number can be searched as well
        ];
      } else {
        query.$or = [
          { nameOfTheDoctor: new RegExp(search, 'i') },
          { speciality: new RegExp(search, 'i') }
        ];
      }
    }


    const doctors = await Doctor.find(query);
    // const alldoctors = await Doctor.find({ hospitalId: hospid, status: "ACTIVE" });
    for (let doctor of doctors) {
      doctor.imgurl = "https://d2m9x1v3tvj3q8.cloudfront.net/" + doctor.img
    }
    return res.send(success(200, doctors));
  } catch (e) {
    res.send(error(e.message));
  }
};
const statusupdatedoctortoremove = async (req, res) => {
  const { doctorid } = req.params
  const { status } = req.body;
  if (!status || !doctorid) {
    return res.send(error(400, "pls filled all fields"))
  }
  try {
    const removedocotr = await Doctor.findByIdAndUpdate(doctorid, { status: status }, { new: true });
    return res.send(success(200, `Doctor ${removedocotr?.nameOfTheDoctor} Removed Succesfully`));
  } catch (e) {
    return res.send(error(500, e.message))
  }
}

const getallstaffinhospital = async (req, res) => {
  const { hospid } = req.params;
  try {
    const allstaffs = await staff.find({ hospitalId: hospid, status: "ACTIVE" });
    for (let staff of allstaffs) {
      staff.imgurl = "https://d2m9x1v3tvj3q8.cloudfront.net/" + staff.img
    }
    return res.send(success(200, allstaffs));
  } catch (error) {
    return res.send(error(500, e.message))
  }

}

export {
  getSingleStaff,
  hospitalprofileupdate,
  getdoctorbytheirid,
  addDoctorbyhospital,
  editDoctorbyhospital,
  AddStaff,
  editStaff,
  alldoctorandstaffforhospital,
  getSingleDoctor,
  alldoctors,
  getAllHospitalsWithAllQuery,
  statusupdatedoctortoremove,
  getHotspitalsDoctorForHomeScreen,
  getHotspitalsByIdAndTheirsDoctors,
  getallstaffinhospital
};
