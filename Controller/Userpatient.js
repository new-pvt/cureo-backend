




import { userpatient } from "../Models/Userpatition.js";
import { Otp } from "../Models/otpSchema.js";
import { error, success } from "../Utils/responseWrapper.js";
import { genrateAccessToken, genrateRefreshToken, sendOTPToEmail } from "./authController.js";
import bcrypt from 'bcrypt'
import { Doctor } from "../Models/AddDoctors.js";
import { Master } from "../Models/Master.js";
import crypto from "crypto";
import { uploadFile } from "../Middleware/s3.js";
import fast2sms from 'fast-two-sms'
import axios from "axios";
import Fuse from 'fuse.js'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
})


const generateFileName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString("hex");

const findUserByEmailOrPhone = async (req, res) => {
    const { emailOrPhone } = req.body;
    if (!emailOrPhone) return res.send((error(401, 'Email or phone is required')));

    try {
        if (typeof emailOrPhone === "string") {
            const patientUser = await userpatient.findOne({ email: emailOrPhone });
            const doctorUser = await Doctor.findOne({ email: emailOrPhone });
            const masterUser = await Master.findOne({ email: emailOrPhone });
            if (!patientUser && !doctorUser && !masterUser) return res.send(error(404, 'User Not Registered'));
            if (patientUser) return res.send(success(200, "Patient"));

            if (doctorUser) return res.send(success(200, "Doctor"));

            if (masterUser) return res.send(success(200, "Master"));
        } else {
            const patientUser = await userpatient.findOne({ phone: emailOrPhone });
            const doctorUser = await Doctor.findOne({ phone: emailOrPhone });
            const masterUser = await Master.findOne({ phone: emailOrPhone });
            if (!patientUser && !doctorUser && !masterUser) return res.send(error(404, 'User Not Registered'));
            if (patientUser) return res.send(success(200, "Patient"));

            if (doctorUser) return res.send(success(200, "Doctor"));

            if (masterUser) return res.send(success(200, "Master"));
        }
    } catch (e) {
        return res.send(error(e.message));
    }



}

const usergetalldoctors = async (req, res) => {

    try {
        const { locationOrNameOfTheDoctor, speciality } = req.query;

        let doctors = await Doctor.find();

        if (locationOrNameOfTheDoctor) {
            const input = locationOrNameOfTheDoctor.trim();
            const options = {
                keys: ['location', 'nameOfTheDoctor', 'landmark', 'enterFullAddress', 'speciality'],
                includeScore: true,
                threshold: 0.4
            };

            const fuse = new Fuse(doctors, options);

            const result = fuse.search(input);

            const matchedDoctors = result.map(item => item.item);

            doctors = matchedDoctors;
        }

        if (speciality) {
            // Filter doctors by specialty
            doctors = doctors.filter(doctor => doctor.speciality === speciality);
        }

        const doctorsWithClinic = doctors.filter(doctor => doctor.hospitalId === "6531c8f389aee1b3fbd0a2d7");
        const sortedDoctors = [...doctorsWithClinic, ...doctors.filter(doctor => doctor.hospitalId !== "6531c8f389aee1b3fbd0a2d7")];
       if(sortedDoctors.length == 0){
        return res.send(success(200, ["No Doctors Found"]));
       }
       return res.send(success(200, sortedDoctors));

    } catch (e) {
        return res.send(error(e.message));
    }
}


// const usergetalldoctors = async (req, res) => {
//     try {

//         const { speciality } = req.query;


//         if (req.query.locationOrNameOfTheDoctor) {
//             const input = req.query.locationOrNameOfTheDoctor.trim();
//             const options = {
//                 keys: ['location', 'nameOfTheDoctor', 'landmark', 'enterFullAddress', 'speciality'],
//                 includeScore: true, 
//                 threshold: 0.4 
//             };

//             const doctors = await Doctor.find();

//             const fuse = new Fuse(doctors, options);

//             const result = fuse.search(input);

//             const matchedDoctors = result.map(item => item.item);

//             return res.send(success(200, matchedDoctors));
//         } else {
//             const doctors = await Doctor.find();
//             const doctorsWithClinic = doctors.filter(doctor => doctor.hospitalId === "6531c8f389aee1b3fbd0a2d7");
//             const sortedDoctors = [...doctorsWithClinic, ...doctors.filter(doctor => doctor.hospitalId !== "6531c8f389aee1b3fbd0a2d7")];
//             res.send(success(200, sortedDoctors));
//         }
//     } catch (e) {
//         return res.send(error(e.message));
//     }
// }


// const usergetalldoctors = async (req, res) => {

//     try {
//         const alldoctors = await Doctor.find({});
//         const doctorSet = new Set();
//         const uniqueDoctors = [];
//         alldoctors.forEach((doctor) => {
//             if (!doctorSet.has(doctor.doctorid)) {
//                 uniqueDoctors.push(doctor);
//                 doctorSet.add(doctor.doctorid);
//             }
//         });
//         return res.send(success(200, uniqueDoctors))
//         // return res.send(success(200,alldoctors))
//     } catch (e) {
//         return res.send(error(e.message))
//     }
// }

const isUserExist = async (req, res) => {
    const { emailOrPhone } = req.body;
    if (!emailOrPhone) return res.send((error(401, 'Email or phone is required')));

    try {
        if (typeof emailOrPhone === "string") {
            const patientUser = await userpatient.findOne({ email: emailOrPhone });
            const doctorUser = await Doctor.findOne({ email: emailOrPhone });
            const masterUser = await Master.findOne({ email: emailOrPhone });
            if (!patientUser && !doctorUser && !masterUser) return res.send(success(200, 'User Not Registered'));
            if (patientUser) return res.send(error(409, "User Already Registered as a Patient With This Email"));

            if (doctorUser) return res.send(error(409, "User Already Registered as a Doctor With This Email"));

            if (masterUser) return res.send(error(409, "User Already Registered as a Hospital With This Email"));
        } else {
            const patientUser = await userpatient.findOne({ phone: emailOrPhone });
            const doctorUser = await Doctor.findOne({ phone: emailOrPhone });
            const masterUser = await Master.findOne({ phone: emailOrPhone });
            if (!patientUser && !doctorUser && !masterUser) return res.send(success(200, 'User Not Registered'));
            if (patientUser) return res.send(error(409, "User Already Registered as a Patient With This Phone"));

            if (doctorUser) return res.send(error(409, "User Already Registered as a Doctor With This Phone"));

            if (masterUser) return res.send(error(409, "User Already Registered as a Hospital With This Phone"));
        }
    } catch (e) {
        return res.send(error(e.message));
    }


}

const sendOtpToEmailOrPhone = async (req, res) => {
    const { emailOrPhone } = req.body;
    const OTP = Math.floor(10000 + Math.random() * 90000);


    if (isNaN(emailOrPhone)) {

        const mailOptions = {
            from: "gtest3681@gmail.com",
            to: emailOrPhone,
            subject: "Medidek OTP VERIFY",
            html:
                `
            <p>Dear,
        Thank you for signing up with Medidek! To complete the registration process and ensure the security of your account, please use the following One-Time Password (OTP) to verify your account:
         OTP: <h1>${OTP}</h1>

         Please enter this OTP within the next 5 minutes to finalize your registration. If you haven't requested this OTP or if you encounter any issues, please contact our support team immediately.

        Thank you for choosing Medidek. We're excited to have you on board and look forward to providing you with an exceptional experience.

         Best regards,

         Team Medidek</p>
            `
        }

        const isotpalready = await Otp.findOne({ email: emailOrPhone })

        if (isotpalready) {
            const updatedotp = await Otp.findOneAndUpdate({ email: emailOrPhone }, { email: emailOrPhone, otp: OTP })
        }
        else {
            const newotp = await Otp.create({ email: emailOrPhone, otp: OTP })
        }

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
                return res.send(error(403, "email not sended"))
            }
            else {
                return res.send(success(200, { message: ['SMS sent successfully.'] }))
            }
        })
        // try {

        //     if (!email || !password) {
        //         // return res.status(400).send("All fields are required");
        //         return res.send(error(400, "All fields are required"));
        //     }

        //     const mailIdExists = await Otp.findOne({ email: emailOrPhone })

        //     if (mailIdExists) {
        //         const updateOtp = await Otp.findByIdAndUpdate({ _id: mailIdExists._id }, { otp: OTP }, { new: true })
        //         updateOtp.save();

        //         await sendOTPToEmail(emailOrPhone, OTP)
        //         res.send(success(200, `OTP sent successfully to ${email}`));

        //     } else {
        //         const saveOtpData = new Otp({ email, otp: OTP });
        //         await saveOtpData.save();

        //         await sendOTPToEmail(email, OTP)
        //         res.send(success(200, `OTP sent successfully to ${email}`));

        //     }
        // } catch (e) {
        //     return res.send(error(400, "Something went wrong"));

        // }
    } else {

        try {

            const smsData = {
                route: "otp",
                variables_values: OTP,
                numbers: `${emailOrPhone}`,
            };


            const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', smsData, {
                headers: {
                    Authorization: process.env.OTP_KEY
                }
            })

            const isOtpExist = await Otp.findOne({ phone: emailOrPhone })

            if (isOtpExist) {
                const updateOtp = await Otp.findByIdAndUpdate({ _id: isOtpExist._id }, { otp: OTP, email: OTP + 1 }, { new: true })
                updateOtp.save();
                return res.send(success(200, response.data));
            } else {
                const saveOtpData = new Otp({ phone: emailOrPhone, otp: OTP, email: OTP + 1 });
                await saveOtpData.save();
                return res.send(success(200, response.data));

            }



        } catch (e) {
            // console.log(e)
            return res.send(error(500, e.message));
        }
    }
}

const varifyOtpForForgotPasswordController = async (req, res) => {
    const { emailOrPhone, otp } = req.body;

    if (!emailOrPhone || !otp) {
        return res.send(error(401, "All fields are required"))
    }

    if (isNaN(emailOrPhone)) {
        try {
            const otpverification = await Otp.findOne({ email: emailOrPhone });

            if (otpverification.otp == otp) {
                return res.send(success(200, "OTP Verified"))
            } else {
                return res.send(error(403, "Invalid OTP"))
            }

        } catch (e) {
            return res.send(error(500, e.message))
        }
    } else {

        try {
            const otpverification = await Otp.findOne({ phone: emailOrPhone });

            if (otpverification.otp == otp) {
                if (otpverification.otp == otp) {
                    return res.send(success(200, "OTP Verified"))
                } else {
                    return res.send(error(403, "Invalid OTP"))
                }

            } else {
                return res.send(error(403, "Invalid OTP"))
            }

        } catch (e) {
            return res.send(error(500, e.message))
        }
    }

};

const resetPassword = async (req, res) => {
    const { emailOrPhone, newPassword, role } = req.body;

    if (!emailOrPhone || !newPassword || !role) return res.send(error(400, "All fields required"))

    if (isNaN(emailOrPhone)) {
        if (role == "DOCTOR") {
            try {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                await Doctor.findOneAndUpdate({ email: emailOrPhone }, { password: hashedPassword })
                return res.send(success(200, "Password Reset Successfully"))
            } catch (e) {
                return res.send(error(500, e.message))
            }


        } else if (role == "MASTER") {
            try {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                await Master.findOneAndUpdate({ email: emailOrPhone }, { password: hashedPassword })
                return res.send(success(200, "Password Reset Successfully"))
            } catch (e) {
                return res.send(error(500, e.message))
            }
        } else {
            try {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                await userpatient.findOneAndUpdate({ email: emailOrPhone }, { password: hashedPassword })
                return res.send(success(200, "Password Reset Successfully"))
            } catch (e) {
                return res.send(error(500, e.message))
            }
        }
    } else {
        if (role == "DOCTOR") {
            try {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                await Doctor.findOneAndUpdate({ phone: emailOrPhone }, { password: hashedPassword })
                return res.send(success(200, "Password Reset Successfully"))
            } catch (e) {
                return res.send(error(500, e.message))
            }


        } else if (role == "MASTER") {
            try {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                await Master.findOneAndUpdate({ phone: emailOrPhone }, { password: hashedPassword })
                return res.send(success(200, "Password Reset Successfully"))
            } catch (e) {
                return res.send(error(500, e.message))
            }
        } else {
            try {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                await userpatient.findOneAndUpdate({ phone: emailOrPhone }, { password: hashedPassword })
                return res.send(success(200, "Password Reset Successfully"))
            } catch (e) {
                return res.send(error(500, e.message))
            }
        }
    }


}
const varifyOtpController = async (req, res) => {
    const { emailOrPhone, password, otp, role } = req.body;

    if (!emailOrPhone || !password || !otp || !role) {
        return res.send(error(401, "all fields are required"))
    }

    if (isNaN(emailOrPhone)) {
        try {
            const otpverification = await Otp.findOne({ email: emailOrPhone });

            if (otpverification.otp == otp) {
                const hashedPassword = await bcrypt.hash(password, 10)
                if (role == "PATIENT") {
                    const user = await userpatient.create({ email: emailOrPhone, password: hashedPassword })
                    const accessToken = genrateAccessToken({ _id: user._id });
                    return res.send(success(200, { accessToken, user }));

                } else if (role == "DOCTOR") {
                    const user = await Doctor.create({ email: emailOrPhone, password: hashedPassword })
                    const accessToken = genrateAccessToken({ _id: user._id });
                    return res.send(success(200, { accessToken, user }));
                } else {
                    const user = await Master.create({ email: emailOrPhone, password: hashedPassword })
                    const accessToken = genrateAccessToken({ _id: user._id });
                    return res.send(success(200, { accessToken, user }));
                }


            } else {
                return res.send(error(403, "Invalid OTP"))
            }

        } catch (e) {
            return res.send(error(500, e.message))
        }
    } else {

        try {
            const otpverification = await Otp.findOne({ phone: emailOrPhone });

            if (otpverification.otp == otp) {
                const hashedPassword = await bcrypt.hash(password, 10)
                if (role == "PATIENT") {
                    const user = await userpatient.create({ phone: emailOrPhone, password: hashedPassword })
                    const accessToken = genrateAccessToken({ _id: user._id });
                    return res.send(success(200, { accessToken, user }));

                } else if (role == "DOCTOR") {
                    const user = await Doctor.create({ phone: emailOrPhone, password: hashedPassword })
                    const accessToken = genrateAccessToken({ _id: user._id });
                    return res.send(success(200, { accessToken, user }));
                } else {
                    const user = await Master.create({ phone: emailOrPhone, password: hashedPassword })
                    const accessToken = genrateAccessToken({ _id: user._id });
                    return res.send(success(200, { accessToken, user }));
                }


            } else {
                return res.send(error(403, "Invalid OTP"))
            }

        } catch (e) {
            return res.send(error(500, e.message))
        }
    }

};


const usersignup = async (req, res) => {
    const { email, password, phone, rol } = req.body;
    if (!email || !password || !phone || !rol) {
        return res.status(200).send({ msg: "Pls filled all given field" });
    }
    const ispatient = await userpatient.findOne({ email, phone });

    const isdoctor = await Doctor.findOne({
        email,
        phone,
    });
    const ishospital = await Master.findOne({ email, phone });

    if (ispatient) {
        return res.send(error(409, "User already exists"));
    }
    if (isdoctor) {
        return res.send(error(409, "User already exists"));
    }
    if (ishospital) {
        return res.send(error(409, "User already exists"));
    }

    try {
        if (rol === "PATIENT") {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await userpatient.create({
                email,
                phone,
                password: hashedPassword,
            });
            const accessToken = genrateAccessToken({ _id: user._id });
            return res.send(success(200, { accessToken, user }));
        } else if (rol === "DOCTOR") {
            const doctorid = crypto.randomInt(0, 1000000);
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await Doctor.create({
                email,
                phone,
                password: hashedPassword,
                doctorid,
            });
            const accessToken = genrateAccessToken({ _id: user._id });
            return res.send(success(200, { accessToken, user }));
        }
        if (rol === "HOSPITAL") {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await Master.create({ email, password: hashedPassword, phone });
            const accessToken = genrateAccessToken({ _id: user._id });
            return res.send(success(200, { accessToken, user }));
        }
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

// usersignin for doctor hopital and patient

const usersignin = async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        // return res.status(400).send("All fields are required");
        return res.send(error(400, "All fields are required"));
    }

    if (typeof email == "string") {
        const ispatient = await userpatient.findOne({ email });
        const isdoctor = await Doctor.findOne({ email });
        const ishospital = await Master.findOne({ email });

        try {
            if (!ispatient && !isdoctor && !ishospital) {
                return res.send(error(404, "User not registered "));
            }

            if (ispatient && role !== "PATIENT") {
                return res.send(error(404, `User exists as Patient. Please signin as Patient`));
            }
            if (isdoctor && role !== "DOCTOR") {
                return res.send(error(404, `User exists as Doctor. Please signin as Doctor`))

            }
            if (ishospital && role !== "MASTER") {
                return res.send(error(404, `User exists as Hospital. Please signin as Hospital`))

            }


            if (ispatient && role === "PATIENT") {
                const matched = await bcrypt.compare(password, ispatient.password);
                if (!matched) {
                    return res.send(error(403, "Incorrect password"))
                }
                const accessToken = genrateAccessToken({ _id: ispatient._id });

                return res.send(success(200, { accessToken, ispatient }));
            }
            if (isdoctor && role === "DOCTOR") {
                const matched = await bcrypt.compare(password, isdoctor.password);
                if (!matched) {
                    return res.send(error(403, "Incorrect password"))
                }
                const accessToken = genrateAccessToken({ _id: isdoctor._id });
                return res.send(success(200, { accessToken, isdoctor }));
            }
            if (ishospital && role === "MASTER") {
                const matched = await bcrypt.compare(password, ishospital.password);
                if (!matched) {
                    return res.send(error(403, "Incorrect password"))
                }
                const accessToken = genrateAccessToken({ _id: ishospital._id });
                return res.send(success(200, { accessToken, ishospital }));
            }



        } catch (e) {
            res.send(error(500, e.message))
        }
    } else {
        const ispatient = await userpatient.findOne({ phone: email });
        const isdoctor = await Doctor.findOne({ phone: email });
        const ishospital = await Master.findOne({ phone: email });

        try {
            if (!ispatient && !isdoctor && !ishospital) {
                return res.send(error(404, "User not registered "));
            }

            if (ispatient && role !== "PATIENT") {
                return res.send(error(404, `User exists as Patient. Please signin as Patient`));
            }
            if (isdoctor && role !== "DOCTOR") {
                return res.send(error(404, `User exists as Doctor. Please signin as Doctor`))

            }
            if (ishospital && role !== "MASTER") {
                return res.send(error(404, `User exists as Hospital. Please signin as Hospital`))

            }


            if (ispatient && role === "PATIENT") {
                const matched = await bcrypt.compare(password, ispatient.password);
                if (!matched) {
                    return res.send(error(403, "Incorrect password"))
                }
                const accessToken = genrateAccessToken({ _id: ispatient._id });

                return res.send(success(200, { accessToken, ispatient }));
            }
            if (isdoctor && role === "DOCTOR") {
                const matched = await bcrypt.compare(password, isdoctor.password);
                if (!matched) {
                    return res.send(error(403, "Incorrect password"))
                }
                const accessToken = genrateAccessToken({ _id: isdoctor._id });
                return res.send(success(200, { accessToken, isdoctor }));
            }
            if (ishospital && role === "MASTER") {
                const matched = await bcrypt.compare(password, ishospital.password);
                if (!matched) {
                    return res.send(error(403, "Incorrect password"))
                }
                const accessToken = genrateAccessToken({ _id: ishospital._id });
                return res.send(success(200, { accessToken, ishospital }));
            }



        } catch (e) {
            res.send(error(500, e.message))
        }
    }


};

const userforgotpassword = async (req, res) => {
    const { phone } = req.body;
    const ispatient = await userpatient.findOne({ phone });
    const isdoctor = await Doctor.findOne({ phone })
    const ishospital = await Master.findOne({ phone })
    try {
        if (ishospital) {
            return res.send(success(200, { role: ishospital.role, phone }))
        }
        if (isdoctor) {
            return res.send(success(200, { role: isdoctor.role, phone }))
        }
        if (ispatient) {
            return res.send(success(200, { role: ispatient.role, phone }))
        } else {
            return res.send(error(404, "user not found"))
        }

    } catch (error) {
        return res.send(error(500, ("error in backend")))
    }
}

const userpasswordupdated = async (req, res) => {
    const { password, role, phone } = req.body;

    try {
        if (role === "PATIENT") {
            const result = await userpatient.findOne({ phone });
            if (!result) return res.send(error(404, "User Not Found"));
            const hashedPassword = await bcrypt.hash(password, 10);
            result.password = hashedPassword;
            result.save();
            return res.send(success(200, { msg: "user password updated succesfully" }));
        }
        if (role === "DOCTOR") {
            const result = await Doctor.findOne({ phone });
            if (!result) return res.send(error(404, "User Not Found"));
            const hashedPassword = await bcrypt.hash(password, 10);
            result.password = hashedPassword;
            result.save();
            return res.send(success(200, { msg: "user password updated succesfully" }));
        }
        if (role === "MASTER") {
            const result = await Master.findOne({ phone });
            if (!result) return res.send(error(404, "User Not Found"));
            const hashedPassword = await bcrypt.hash(password, 10);
            result.password = hashedPassword;
            result.save();
            return res.send(success(200, { msg: "user password updated succesfully" }));
        }

    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const userprofileupdate = async (req, res) => {
    const { id } = req.params;
    const { name, email, dateOfBirth, phone, imgurl, gender, mapLink, bloodgroup, location } = req.body;
    if (!name || !email || !dateOfBirth || !phone, !gender) {
        return res.send(error(409, "pls filled all field"));
    }
    const file = req.file;

    const imageName = file ? generateFileName() : imgurl;

    const fileBuffer = file?.buffer;
    try {
        if (fileBuffer) {
            await uploadFile(fileBuffer, imageName, file.mimetype)
        }
        const data = await userpatient.findByIdAndUpdate({ _id: id }, {
            name, email, dateOfBirth, phone, img: imageName, gender, mapLink, bloodgroup, location
        }, { new: true })
        // data.imgurl = "https://d26dtlo3dcke63.cloudfront.net/" + data.img
        data.imgurl = "https://d2m9x1v3tvj3q8.cloudfront.net/" + data.img
        await data.save();
        return res.send(success(200, data));
    } catch (e) {
        return res.send(error(500, e.message))
    }
}


const changepassword = async (req, res) => {
    const { id } = req.params;
    const { oldpassword, newpassword, role } = req.body;

    if (!oldpassword || !newpassword || !id || !role) {
        return res.send(error(500, "pls filled all field"));
    }
    try {
        if (role === "DOCTOR") {
            const finduser = await Doctor.findOne({ _id: id });
            if (finduser) {
                const matched = await bcrypt.compare(oldpassword, finduser.password);
                if (matched) {
                    const hashedPassword = await bcrypt.hash(newpassword, 10);
                    const changepassword = await Doctor.findByIdAndUpdate({ _id: id }, { password: hashedPassword }, { new: true });
                    return res.send(success(200, changepassword));
                }
                else {
                    return res.send(error(409, "Incorrect Password"));
                }
            }
            else {
                return res.status(200).send({ msg: "user is not present" });
            }
        }
        if (role === "HOSPITAL") {
            const finduser = await Master.findOne({ _id: id });
            if (finduser) {
                const matched = await bcrypt.compare(oldpassword, finduser.password);
                if (matched) {
                    const hashedPassword = await bcrypt.hash(newpassword, 10);
                    const changepassword = await Master.findByIdAndUpdate({ _id: id }, { password: hashedPassword }, { new: true });
                    return res.send(success(200, changepassword));
                }
                else {
                    return res.send(error(409, "Incorrect Password"));
                }
            }
            else {
                return res.status(200).send({ msg: "user is not present" });
            }
        }
        if (role === "PATIENT") {
            const finduser = await userpatient.findOne({ _id: id });
            if (finduser) {
                const matched = await bcrypt.compare(oldpassword, finduser.password);
                if (matched) {
                    const hashedPassword = await bcrypt.hash(newpassword, 10);
                    const changepassword = await userpatient.findByIdAndUpdate({ _id: id }, { password: hashedPassword }, { new: true });
                    return res.send(success(200, changepassword));
                }
                else {
                    return res.send(error(409, "Incorrect Password"));
                }
            }
            else {
                return res.status(200).send({ msg: "user is not present" });
            }
        }

    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const addHealthConcern = async (req, res) => {
    const { id, healthConcern } = req.body;
    try {
        const user = await userpatient.findByIdAndUpdate({ _id: id }, { Healthconcern: healthConcern }, { new: true })
        return res.send(success(200, user))
    } catch (e) {
        return res.send(error(500, e.message))
    }


}

export {
    usersignup,
    usersignin,
    userpasswordupdated,
    userforgotpassword,
    isUserExist,
    usergetalldoctors,
    changepassword,
    userprofileupdate,
    findUserByEmailOrPhone,
    sendOtpToEmailOrPhone,
    varifyOtpController,
    varifyOtpForForgotPasswordController,
    resetPassword,
    addHealthConcern
}

