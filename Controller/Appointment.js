import moment from "moment/moment.js";
import { AppointmentModel } from "../Models/Appointments.js"
import { success, error } from "../Utils/responseWrapper.js";
import { AppointmentTokenModel } from "../Models/tokencreate.js";

const createAppointmnt = async (req, res) => {
    const {
        doctorid,
        userid,
        name,
        age,
        gender,
        phone,
        AppointmentNotes,
        appointmentDate,
        AppointmentTime,
        role
    } = req.body;

    if (
        !doctorid ||
        !userid ||
        !name ||
        !age ||
        !gender ||
        !phone ||
        !appointmentDate ||
        !role ||
        !AppointmentTime) {
        return res.send(error(400, "all fields  required"));
    }


    try {
        if (role === "MASTER") {
            const Appointmentdata = await AppointmentModel.create({
                doctorid,
                hospitalid: userid,
                name,
                age,
                gender,
                phone,
                AppointmentNotes,
                appointmentDate,
                AppointmentTime
            })
            return res.send(success(201, Appointmentdata))

        }
        const isappointmentexist = await AppointmentModel.findOne({ $and: [{ doctorid }, { userid }, { appointmentDate }, { status: "pending" }] });
        if (isappointmentexist !== null) {
            return res.send(error(409, "Appointment is already exist"));
        }
        else {
            const Appointmentdata = await AppointmentModel.create({
                doctorid,
                userid: userid,
                name,
                age,
                gender,
                phone,
                AppointmentNotes,
                appointmentDate,
                AppointmentTime
            })
            // await Appointmentdata.populate(["doctorid", "userid"])
            return res.send(success(201, Appointmentdata))
        }

    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const updateAppointmnt = async (req, res) => {
    const { appointmentId } = req.params;
    const {
        doctorid,
        userid,
        name,
        age,
        gender,
        phone,
        AppointmentNotes,
        appointmentDate,
        AppointmentTime,
        status
    } = req.body;

    if (
        !doctorid ||
        !userid ||
        !name ||
        !age ||
        !gender ||
        !phone ||
        !appointmentDate ||
        !AppointmentNotes ||
        !AppointmentTime ||
        !status) {
        return res.send(error(400, "all fields  required"));
    }


    try {
        const appointmentupdated = await AppointmentModel.findByIdAndUpdate({ _id: appointmentId }, {
            doctorid,
            userid,
            name,
            age,
            gender,
            phone,
            AppointmentNotes,
            appointmentDate,
            AppointmentTime,
            status,
        }, { new: true });
        return res.send(success(200, appointmentupdated));
    } catch (e) {
        return res.send(error(e.message));
    }
}


const updateAppointmntForAppointmentByToken = async (req, res) => {
    const { appointmentId } = req.params;
    const {
        doctorid,
        userid,
        name,
        age,
        gender,
        phone,
        AppointmentNotes,
        appointmentDate,
        status
    } = req.body;

    if (
        !doctorid ||
        !userid ||
        !name ||
        !age ||
        !gender ||
        !phone ||
        !appointmentDate ||
        !AppointmentNotes ||
        !status) {
        return res.send(error(400, "all fields  required"));
    }


    try {
        const appointmentupdated = await AppointmentTokenModel.findByIdAndUpdate({ _id: appointmentId }, {
            doctorid,
            userid,
            name,
            age,
            gender,
            phone,
            AppointmentNotes,
            appointmentDate,
            status,
        }, { new: true });
        return res.send(success(200, appointmentupdated));
    } catch (e) {
        return res.send(error(e.message));
    }
}

const appointmentstatus = async (req, res) => {
    const { userid, status } = req.body;
    try {
        const allapointmentbystatus = await AppointmentModel.find({ $and: [{ userid }, { status }] });
        return res.status(200).send(allapointmentbystatus);
    } catch (error) {
        return res.status(500).send(error);
    }
}

const getsingleappointmentbyid = async (req, res) => {
    const { appointmentId, status } = req.params;
    if (!appointmentId) {
        return res.send(error(400, "id is required"));
    }
    try {
        const singleappointment = await AppointmentModel.findOne({ $and: [{ _id: appointmentId }, { status }] }).populate("doctorid")
        const singleappointmentbytoken = await AppointmentTokenModel.findOne({ $and: [{ _id: appointmentId }, { status }] }).populate("doctorid")
        if (singleappointment) {
            return res.send(success(200, singleappointment));
        }
        else if (singleappointmentbytoken) {
            return res.send(success(200, singleappointmentbytoken));
        }
        else {
            return res.send(error(404, "not appointment found"))
        }
    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const changeappointmentstatus = async (req, res) => {
    const { id } = req.params;
    const { status, remark } = req.body;
    try {
        const chnageappointmentstatusbydoctor = await AppointmentModel.findByIdAndUpdate({ _id: id }, { status, remark }, { new: true });
        return res.send(success(200, "status changed succesfully"));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}



const changeappointmentstatusForAppointmentByToken = async (req, res) => {
    const { id } = req.params;
    const { status, remark } = req.body;
    try {
        const chnageappointmentstatusbydoctor = await AppointmentTokenModel.findByIdAndUpdate({ _id: id }, { status, remark }, { new: true });
        return res.send(success(200, "status changed succesfully"));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}


const getallappointmentofdoctor = async (req, res) => {
    const { doctorid } = req.params;
    try {
        const allappointment = await AppointmentModel.find({ doctorid }).populate("userid");
        return res.send(success(200, allappointment));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}
const getAllPendingAppointmentOfDoctor = async (req, res) => {
    const { doctorid, date } = req.params;
    const nidate = new Date(date);

    try {
        const allSlotappointment = await AppointmentModel.find({
            $and: [{ doctorid: doctorid },
            { status: "pending" },
            { appointmentDate: nidate }
            ]
        }).populate(["userid"]);

        return res.send(success(200, allSlotappointment));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}
const getAllCompletedAppointmentOfDoctor = async (req, res) => {
    const { doctorid, date } = req.params;
    try {
        const allappointment = await AppointmentModel.find({
            $and: [{ doctorid },
            { status: "completed" },
            { appointmentDate: date }
            ]
        }).populate("userid");
        return res.send(success(200, allappointment));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}
const getAllMissedAppointmentOfDoctor = async (req, res) => {
    const { doctorid, date } = req.params;
    try {
        const allappointment = await AppointmentModel.find({
            $and: [{ doctorid },
            { status: { $in: ["missed", "cancelled"] } },
            { appointmentDate: date }
            ]
        }).populate("userid");
        return res.send(success(200, allappointment));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}

//Get Appointment by Token


const getAllPendingAppointmentByTokenOfDoctor = async (req, res) => {
    const { doctorid, date } = req.params;
    const newdate = new Date(date)

    try {
        const allappointment = await AppointmentTokenModel.find({
            $and: [{ doctorid },
            { status: "pending" },
            { appointmentDate: { $eq: newdate } }
            ]
        }).populate(["userid"]);
        return res.send(success(200, allappointment));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}
const getAllCompletedAppointmentByTokenOfDoctor = async (req, res) => {
    const { doctorid, date } = req.params;
    const newdate = new Date(date)

    try {
        const allappointment = await AppointmentTokenModel.find({
            $and: [{ doctorid },
            { status: "completed" },
            { appointmentDate: newdate }
            ]
        }).populate("userid");
        return res.send(success(200, allappointment));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}
const getAllMissedAppointmentByTokenOfDoctor = async (req, res) => {
    const { doctorid, date } = req.params;
    const newdate = new Date(date)

    try {
        const allappointment = await AppointmentTokenModel.find({
            $and: [{ doctorid },
            { status: { $in: ["missed", "cancelled"] } },
            { appointmentDate: newdate }
            ]
        }).populate("userid");
        return res.send(success(200, allappointment));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}

// get all Pending appointments for perticular patient

const getUpcomingAppointmentForAnUser = async (req, res) => {
    const { Patient_id, doctorid } = req.params;
    if (doctorid) {
        const allappointment = await AppointmentModel.find({
            $and: [{ userid: doctorid },
            { status: "pending" }
            ]
        }).populate("doctorid");

        const allappointmentbytoken = await AppointmentTokenModel.find({
            $and: [{ doctorid: doctorid },
            { status: "pending" }
            ]
        })
        try {
            // if (allappointment.length === 0 || allappointmentbytoken.length === 0) {
            //     return res.send(success(200, "no appointment found by this doctor"));
            // }

            return res.send(success(200, [allappointment, allappointmentbytoken]));
        } catch (e) {
            return res.send(error(500, e.message));
        }
    }
    if (Patient_id) {
        const allappointment = await AppointmentModel.find({
            $and: [{ userid: Patient_id },
            { status: "pending" }
            ]
        }).populate("doctorid");

        const allappointmentbytoken = await AppointmentTokenModel.find({
            $and: [{ userid: Patient_id },
            { status: "pending" }
            ]
        }).populate("doctorid")
        try {
            // if (allappointment.length === 0 || allappointmentbytoken.length === 0) {
            //     return res.send(success(200, "no appointment found by this doctor"));
            // }
            // else {
            return res.send(success(200, [...allappointment, ...allappointmentbytoken]));
            // }
        } catch (e) {
            return res.send(error(500, e.message));
        }
    }



}

// get all completed appointments for perticular patient
const getCompletedAppointmentsForAnUser = async (req, res) => {
    const { Patient_id } = req.params;
    const allappointment = await AppointmentModel.find({
        $and: [{ userid: Patient_id },
        { status: "completed" }
        ]
    }).populate("doctorid");
    const allappointmentbytoken = await AppointmentTokenModel.find({
        $and: [{ userid: Patient_id },
        { status: "completed" }
        ]
    }).populate("doctorid")
    try {
        if (allappointment.length === 0 || allappointmentbytoken.length === 0) {
            return res.send(success(200, "no appointment found by this doctor"));
        }
        return res.send(success(200, [...allappointment, ...allappointmentbytoken]));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}

// get all completed appointments for perticular patient

const getMissedAppointmentsForAnUser = async (req, res) => {
    const { Patient_id } = req.params;
    try {
        const allappointment = await AppointmentModel.find(
            {
                userid: Patient_id,
                status: { $in: ["missed", "cancelled"] }
            }
        ).populate("doctorid");
        const allappointmentbytoken = await AppointmentTokenModel.find(
            {
                userid: Patient_id,
                status: { $in: ["missed", "cancelled"] }
            }
        ).populate("doctorid")
        // if (allappointment.length === 0 || allappointmentbytoken.length === 0) {
        //     return res.send(success(200, "no appointment found by this doctor"));
        // }

        return res.send(success(200, [...allappointment, ...allappointmentbytoken]));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}


const searchappointmentsbyuser = async (req, res) => {
    try {
        const { userid } = req.body;
        const { doctorname } = req.query;
        const appointmentsByDoctor = [];
        const appointmentsTokenByDoctor = [];
        const searchTerm = doctorname.toLowerCase();
        const Allappointments = await AppointmentModel.find({ userid: userid }).populate("doctorid")
        const AllappointmentsByToken = await AppointmentTokenModel.find({ userid: userid }).populate("doctorid")
        Allappointments.forEach(appointment => {
            if (appointment.doctorid.nameOfTheDoctor.toLowerCase().includes(searchTerm)) {
                appointmentsByDoctor.push(appointment);
            }
        });
        AllappointmentsByToken.forEach(appointment => {
            if (appointment.doctorid.nameOfTheDoctor.toLowerCase().includes(searchTerm)) {
                appointmentsByDoctor.push(appointment);
            }
        });
        return res.send([...appointmentsByDoctor, ...appointmentsTokenByDoctor])
    } catch (e) {
        return res.send(error(500, e.message))
    }
}







const getallappointmentsforparticularhospitalidpending = async (req, res) => {
    const { hospitalid, date } = req.params;
    const newdate = new Date(date)
    if (!hospitalid) {
        return res.send(error(404, "filed missing required parameter"))
    }
    try {
        const allappointment = await AppointmentModel.find({
            $and: [{ hospitalid }, { status: "pending" }, { appointmentDate: newdate }]
        }).populate("doctorid")
        return res.send(success(200, allappointment))
    } catch (e) {
        return res.send(error(500, e.message))
    }
}
const getallappointmentsByTokenforparticularhospitalidpending = async (req, res) => {
    const { hospitalid, date } = req.params;
    const newdate = new Date(date)
    if (!hospitalid) {
        return res.send(error(404, "filed missing required parameter"))
    }
    try {
        const allappointment = await AppointmentTokenModel.find({
            $and: [{ hospitalid }, { status: "pending" }, { appointmentDate: newdate }]
        }).populate("doctorid")
        return res.send(success(200, allappointment))
    } catch (e) {
        return res.send(error(500, e.message))
    }
}
const getallappointmentsforparticularhospitalidcompleted = async (req, res) => {
    const { hospitalid, date } = req.params;
    const newdate = new Date(date)
    if (!hospitalid) {
        return res.send(error(404, "filed missing required parameter"))
    }
    try {
        const allappointment = await AppointmentModel.find({
            $and: [{ hospitalid }, { status: "completed" }, { appointmentDate: newdate }]
        }).populate("doctorid")
        return res.send(success(200, allappointment))
    } catch (e) {
        return res.send(error(500, e.message))
    }
}

const getallappointmentsByTokenforparticularhospitalidcompleted = async (req, res) => {
    const { hospitalid, date } = req.params;
    const newdate = new Date(date)
    if (!hospitalid) {
        return res.send(error(404, "filed missing required parameter"))
    }
    try {
        const allappointment = await AppointmentTokenModel.find({
            $and: [{ hospitalid }, { status: "completed" }, { appointmentDate: newdate }]
        }).populate("doctorid")
        return res.send(success(200, allappointment))
    } catch (e) {
        return res.send(error(500, e.message))
    }
}
const getallappointmentsforparticularhospitalidmissed = async (req, res) => {
    const { hospitalid, date } = req.params;
    const newdate = new Date(date)
    if (!hospitalid) {
        return res.send(error(404, "filed missing required parameter"))
    }
    try {
        const allappointment = await AppointmentModel.find({
            $and: [{ hospitalid }, { status: "missed" }, { appointmentDate: newdate }]
        }).populate("doctorid")
        return res.send(success(200, allappointment))
    } catch (e) {
        return res.send(error(500, e.message))
    }
}

const getallappointmentsByTokenforparticularhospitalidmissed = async (req, res) => {
    const { hospitalid, date } = req.params;
    const newdate = new Date(date)
    if (!hospitalid) {
        return res.send(error(404, "filed missing required parameter"))
    }
    try {
        const allappointment = await AppointmentTokenModel.find({
            $and: [{ hospitalid }, { status: "missed" }, { appointmentDate: newdate }]
        }).populate("doctorid")
        return res.send(success(200, allappointment))
    } catch (e) {
        return res.send(error(500, e.message))
    }
}


const Totalapatient = async (req, res) => {
    const { doctorid, date } = req.params;
    const newdate = new Date(date);
    const year = newdate.getFullYear()
    const month = newdate.getMonth();
    const intialdate = `${year}-${month}-01`
    const intialdat = new Date(intialdate);

    try {
        const allpatient = await AppointmentModel.
            find({ $and: [{ doctorid }, { appointmentDate: { $gte: intialdat } }, { appointmentDate: { $lte: newdate } }] }).countDocuments();
        return res.send(success(200, allpatient));
    } catch (e) {
        return res.send(error(e.message));
    }
}

const TodayAppointment = async (req, res) => {
    const { doctorid, date } = req.params;
    const today = new Date(date)
    try {
        const totalAppointments = await AppointmentModel.find({ $and: [{ doctorid }, { appointmentDate: today }] }).countDocuments();
        const completeAppointments = await AppointmentModel.find({
            $and: [{ doctorid },
            { status: { $in: ["missed", "cancelled", "completed"] } },
            { appointmentDate: today }
            ]
        }).countDocuments();
        // awaiit aajkiappointment.C
        return res.send(success(200, { totalAppointments, completeAppointments }));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const TodayAppointmentByToken = async (req, res) => {
    const { doctorid, date } = req.params;
    const today = new Date(date)
    try {
        const totalAppointments = await AppointmentTokenModel.find({ $and: [{ doctorid }, { appointmentDate: today }] }).countDocuments();
        const completeAppointments = await AppointmentTokenModel.find({
            $and: [{ doctorid },
            { status: { $in: ["missed", "cancelled", "completed"] } },
            { appointmentDate: today }
            ]
        }).countDocuments();
        // awaiit aajkiappointment.C
        return res.send(success(200, { totalAppointments, completeAppointments }));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const Futureappointment = async (req, res) => {
    const { doctorid } = req.params;
    const today = moment().format("YYYY-MM-DD")
    const date = new Date(today);
    try {
        const newappointment = await AppointmentModel.
            find({ $and: [{ doctorid }, { status: "pending" }, { appointmentDate: { $gte: date } }] }).countDocuments();
        return res.send(success(200, newappointment));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}


const FutureappointmentForAppointmentByToken = async (req, res) => {
    const { doctorid } = req.params;
    const today = moment().format("YYYY-MM-DD")
    const date = new Date(today);
    try {
        const newappointment = await AppointmentTokenModel.
            find({ $and: [{ doctorid }, { status: "pending" }, { appointmentDate: { $gte: date } }] }).countDocuments();
        return res.send(success(200, newappointment));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const Appointmentstatusinpercentage = async (req, res) => {
    const { doctorid, date } = req.params;
    const stringdate = new Date(date)
    try {
        const totalappointment = await AppointmentModel.find({ $and: [{ doctorid }, { appointmentDate: stringdate }] }).countDocuments();
        const pendingapointment = await AppointmentModel.find({ $and: [{ doctorid }, { status: "pending" }, { appointmentDate: stringdate }] }).countDocuments();
        const completedappointment = await AppointmentModel.find({ $and: [{ doctorid }, { status: "completed" }, { appointmentDate: stringdate }] }).countDocuments();
        const cancelledapointment = await AppointmentModel.find({ $and: [{ doctorid }, { status: "cancelled" }, { appointmentDate: stringdate }] }).countDocuments();
        const PA = (100 * pendingapointment) / totalappointment;
        const COMPA = (100 * completedappointment) / totalappointment;
        const CA = (100 * cancelledapointment) / totalappointment;
        return res.send(success(200, { pending: PA, completed: COMPA, cancelled: CA }));
    } catch (e) {
        return res.send(error(e.message));
    }
}


const AppointmentstatusinpercentageForAppointmentByToken = async (req, res) => {
    const { doctorid, date } = req.params;
    const stringdate = new Date(date)
    try {
        const totalappointment = await AppointmentTokenModel.find({ $and: [{ doctorid }, { appointmentDate: stringdate }] }).countDocuments();
        const pendingapointment = await AppointmentTokenModel.find({ $and: [{ doctorid }, { status: "pending" }, { appointmentDate: stringdate }] }).countDocuments();
        const completedappointment = await AppointmentTokenModel.find({ $and: [{ doctorid }, { status: "completed" }, { appointmentDate: stringdate }] }).countDocuments();
        const cancelledapointment = await AppointmentTokenModel.find({ $and: [{ doctorid }, { status: "cancelled" }, { appointmentDate: stringdate }] }).countDocuments();
        const PA = (100 * pendingapointment) / totalappointment;
        const COMPA = (100 * completedappointment) / totalappointment;
        const CA = (100 * cancelledapointment) / totalappointment;
        return res.send(success(200, { pending: PA, completed: COMPA, cancelled: CA }));
    } catch (e) {
        return res.send(error(e.message));
    }
}

const AppointmentBydate = async (req, res) => {
    const { Doctorid, Date } = req.body;
    // const today = new Date().toLocaleDateString();
    try {
        const dateappointment = await AppointmentModel.find({ $and: [{ Doctorid }, { AppointmentDate: Date }] });
        return res.status(200).send(dateappointment);
    } catch (error) {
        return res.status(500).send(error);
    }
}
const appointmentstatusfordoctor = async (req, res) => {
    const { Doctorid, status } = req.body;
    try {
        const allapointmentbystatus = await AppointmentModel.find({ $and: [{ Doctorid }, { status }] });
        return res.status(200).send(allapointmentbystatus);
    } catch (error) {
        return res.status(500).send(error);
    }
}


const AppointmentGotoMissed = async (req, res) => {
    const date = new Date();
    const Appointtokengotomissed = await AppointmentTokenModel.find({ $and: [{ appointmentDate: { $lt: date } }, { status: "pending" }] })

    for (let Appointment of Appointtokengotomissed) {
        const updateAppointmentstatus = await AppointmentTokenModel.findByIdAndUpdate({ _id: Appointment._id }, { status: "missed" }, { new: true })
    }
    const AppointSlotgotomissed = await AppointmentModel.find({ appointmentDate: { $lt: date } })

    for (let AppointmentSlot of AppointSlotgotomissed) {
        const updateAppointmentstatus = await AppointmentModel.findByIdAndUpdate({ _id: AppointmentSlot._id }, { status: "missed" }, { new: true })
    }
}







export {
    searchappointmentsbyuser,
    getallappointmentsforparticularhospitalidmissed,
    getallappointmentsByTokenforparticularhospitalidmissed,
    getallappointmentsforparticularhospitalidcompleted,
    getallappointmentsByTokenforparticularhospitalidcompleted,
    getallappointmentsforparticularhospitalidpending,
    getallappointmentsByTokenforparticularhospitalidpending,
    createAppointmnt,
    getAllPendingAppointmentOfDoctor,
    getAllCompletedAppointmentOfDoctor,
    getAllMissedAppointmentOfDoctor,
    getAllPendingAppointmentByTokenOfDoctor,
    getAllCompletedAppointmentByTokenOfDoctor,
    getAllMissedAppointmentByTokenOfDoctor,
    getallappointmentofdoctor,
    appointmentstatus,
    changeappointmentstatus,
    changeappointmentstatusForAppointmentByToken,
    Totalapatient,
    TodayAppointment,
    TodayAppointmentByToken,
    Futureappointment,
    FutureappointmentForAppointmentByToken,
    Appointmentstatusinpercentage,
    AppointmentstatusinpercentageForAppointmentByToken,
    AppointmentBydate,
    appointmentstatusfordoctor,
    getUpcomingAppointmentForAnUser,
    getCompletedAppointmentsForAnUser,
    getMissedAppointmentsForAnUser,
    getsingleappointmentbyid,
    updateAppointmnt,
    updateAppointmntForAppointmentByToken,
    AppointmentGotoMissed
}