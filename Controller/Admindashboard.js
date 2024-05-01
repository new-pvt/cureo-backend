import { Doctor } from "../Models/AddDoctors.js"
import { AppointmentModel } from "../Models/Appointments.js";
import { Master } from "../Models/Master.js";
import { Tokens } from "../Models/Token.js";
import { userpatient } from "../Models/Userpatition.js";
import { Slots } from "../Models/slots.js";
import { AppointmentTokenModel } from "../Models/tokencreate.js";
import { error, success } from "../Utils/responseWrapper.js";
import moment from "moment";

const getAllDashboardCardsData = async (req, res) => {
    const date = moment().format("YYYY-MM-DD")
    const currentDate = new Date(date);
    try {
        const alldoctors = await Doctor.find({});
        const todaysDoctors = await Doctor.find({ createddate: { $gte: currentDate } });
        let newarr = [];
        let todayarr = [];

        for (let doctor of alldoctors) {
            var getdocts = await Doctor.find({ doctorid: doctor.doctorid })
            if (newarr.length == 0) {
                newarr.push(getdocts[0])
            }
            else {
                for (let i = 0; i < newarr.length; i++) {
                    let c = i;
                    if (newarr[c].doctorid === getdocts[0].doctorid) {
                        break;
                    }
                    else {
                        c++;
                    }
                    if (c == newarr.length) {
                        newarr.push(getdocts[0])
                        break;
                    }
                }
            }
        }

        for (let doctor of todaysDoctors) {
            var getdocts = await Doctor.find({ doctorid: doctor.doctorid })
            if (todayarr.length == 0) {
                todayarr.push(getdocts[0])
            }
            else {
                for (let i = 0; i < todayarr.length; i++) {
                    let c = i;
                    if (todayarr[c].doctorid === getdocts[0].doctorid) {
                        break;
                    }
                    else {
                        c++;
                    }
                    if (c == todayarr.length) {
                        todayarr.push(getdocts[0])
                        break;
                    }
                }
            }
        }
        const allHospitals = await Master.find().countDocuments();
        const todaysHospital = await Master.find({ createddate: { $gte: currentDate } }).countDocuments();
        const allPatient = await userpatient.find().countDocuments();
        const todaysPatient = await userpatient.find({ createddate: { $gte: currentDate } }).countDocuments();
        const allSlotAppointments = await AppointmentModel.find().countDocuments();
        const todaysSlotAppointments = await AppointmentModel.find({ createddate: { $gte: currentDate } }).countDocuments();
        const allTokenAppointments = await AppointmentTokenModel.find().countDocuments();
        const todaysTokenAppointments = await AppointmentTokenModel.find({ createddate: { $gte: currentDate } }).countDocuments();

        return res.send(success(200, {
            totalDoctors: { totalDoctors: newarr.length, todaysDoctor: todayarr.length },
            totalHospitals: { totalHospitals: allHospitals, todaysHospital },
            totalPatient: { totalPatient: allPatient, todaysPatient },
            totalAppointments: {
                appointmentBySlot: allSlotAppointments,
                todaysSlotAppointments,
                todaysTokenAppointments,
                appointmentByToken: allTokenAppointments,
            }


        }))
    } catch (e) {
        return res.send(error(e.message))
    }

}


const totalAppointmentChartData = async (req, res) => {
    const { weekStartDate, weekEndDate } = req.params
    try {
        const startDate = new Date(weekStartDate);
        const endDate = new Date(weekEndDate);

        const dataFromCollection1 = await AppointmentModel.find({
            createddate: { $gte: startDate, $lt: endDate }
        });
        const dataFromCollection2 = await AppointmentTokenModel.find({ createddate: { $gte: startDate, $lt: endDate } });
        const combinedDataPerDay = {};
        for (let i = 0; i < 7; i++) {
            const currentDay = moment(startDate).add(i, 'days').format('YYYY-MM-DDThh:mm:ss');
            combinedDataPerDay[currentDay] = {
                collection1Data: dataFromCollection1.filter(item => item.createddate === currentDay),
                collection2Data: dataFromCollection2.filter(item => item.createddate === currentDay),

            }
        }
        return res.send(success(200, combinedDataPerDay))
    } catch (e) {
        return res.send(error(500, e.message))
    }

}

const latestAppointments = async (req, res) => {
    try {
        const latestAppointmentBySlotData = await AppointmentModel.find()
        const latestAppointmentByTokenData = await AppointmentTokenModel.find()

        const combinedData = [...latestAppointmentBySlotData, ...latestAppointmentByTokenData]
        combinedData.sort((a, b) => b.createddate - a.createddate);
        return res.send(success(200, combinedData))
    } catch (e) {
        return res.send(error(500, e.message))
    }

}
const newlySignUpPatient = async (req, res) => {
    try {
        const recentSignUpPatient = await userpatient.find().sort({ createddate: -1 })
        return res.send(success(200, recentSignUpPatient))
    } catch (e) {
        return res.send(error(500, e.message))
    }

}
export { getAllDashboardCardsData, totalAppointmentChartData, latestAppointments, newlySignUpPatient }