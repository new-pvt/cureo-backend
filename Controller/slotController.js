import { AppointmentModel } from "../Models/Appointments.js";
import { Slots } from "../Models/slots.js";
import { success, error } from "../Utils/responseWrapper.js";
import moment from "moment";
const createslot = async (req, res) => {
    const { // doctorid should be database id of doctor
        slotduration,
        Starttime1,
        Endtime1,
        Starttime2,
        Endtime2,
        Starttime3,
        Endtime3,
        isholiday,
        date,
        doctorid,
    } = req.body;
    const newdate = new Date(date);
    if (!doctorid || !date) {
        return res.send(error(400, "all fields are required"))
    }
    try {
        const isslotalready = await Slots.findOne({ $and: [{ doctor_id: doctorid }, { date: newdate }] });
        if (isslotalready) {
            const updatedslot = await Slots.findOneAndUpdate({ $and: [{ doctor_id: doctorid }, { date: newdate }] }, {
                slotduration,
                Starttime1,
                Endtime1,
                Starttime2,
                Endtime2,
                Starttime3,
                Endtime3,
                isholiday,
                date: newdate,
                doctor_id: doctorid
            }, { new: true })
            return res.send(success(200, { update: updatedslot }));
        }
        const createdslot = await Slots.create({
            slotduration,
            Starttime1,
            Endtime1,
            Starttime2,
            Endtime2,
            Starttime3,
            Endtime3,
            isholiday,
            date: newdate,
            doctor_id: doctorid
        })
        return res.send(success(200, { create: createdslot }));
    } catch (e) {
        return res.send(error(500, e.messege));
    }

}

const getslot = async (req, res) => {
    const { date, doctorid } = req.params
    if (!doctorid || !date) {
        return res.send(error(400, "all fields are required"))
    }
    const newdate = new Date(date);
    try {
        const data = await Slots.findOne({
            $and: [{ doctor_id: doctorid }, { date: newdate }],
        });
        return res.send(success(200, data));
    } catch (e) {
        return res.send(error(e.message));
    }
};


const extractAppointmentTimes = (slots) => {
    return slots.map(slot => slot.AppointmentTime);
};


const userslot = async (req, res) => {
    const { doctorid, date } = req.params;
    const newdate = new Date(date)
    try {
        const isslotavailable = await Slots.findOne({ $and: [{ doctor_id: doctorid }, { date: newdate }] });
        if (isslotavailable !== null) {
            let slots1 = [];
            let slots2 = [];
            let slots3 = [];
            let availableSlots = [];
            let availableSlots2 = [];
            let availableSlots3 = [];
            const SD = isslotavailable.slotduration;
            const slotDuration = SD;

            const startTime1 = isslotavailable.Starttime1;
            const endTime1 = isslotavailable.Endtime1;
            if (startTime1 && startTime1 !== 0 && endTime1 && endTime1 !== 0) {
                const cb = startTime1?.split(" ");
                const newb = cb[0]?.split(":");

                const starthour = newb[0];
                const format = cb[1];


                const cbb = endTime1?.split(" ");
                const newbb = cbb[0]?.split(":");
                const endhour = newbb[0];
                const endformat = cbb && cbb[1];

                slots1 = genrateSlots(starthour, endhour, slotDuration)
                const alreadyslotsbooked = await AppointmentModel.find({ $and: [{ doctorid: doctorid }, { appointmentDate: newdate }, { status: "pending" }] })
                console.log("alreadyslotsbooked", alreadyslotsbooked)
                const appointmentTimes = extractAppointmentTimes(alreadyslotsbooked);
                console.log("appointmentTimes", appointmentTimes)
                availableSlots = slots1.map(slot => { return { slot: slot, isbooked: appointmentTimes.includes(`${slot.startTime} - ${slot.endTime}`) }; })
            }


            const startTime2 = isslotavailable.Starttime2;
            const endTime2 = isslotavailable.Endtime2;
            if (startTime2 && startTime2 !== 0 && endTime2 && endTime2 !== 0) {
                const cb1 = startTime2?.split(" ");
                const newb1 = cb1[0].split(":");

                const starthour1 = newb1 && newb1[0];
                const format1 = cb1 && cb1[1];


                const cbb1 = endTime2?.split(" ");
                const newbb1 = cbb1[0]?.split(":");
                const endhour1 = newbb1 && newbb1[0];
                const endformat1 = cbb1[1];

                slots2 = genrateSlots(starthour1, endhour1, slotDuration)
                const alreadyslotsbooked = await AppointmentModel.find({ $and: [{ doctorid: doctorid }, { appointmentDate: newdate }, { status: "pending" }] })
                const appointmentTimes = extractAppointmentTimes(alreadyslotsbooked);
                availableSlots2 = slots2.map(slot => { return { slot: slot, isbooked: appointmentTimes.includes(`${slot.startTime} - ${slot.endTime}`) }; })

            }


            const startTime3 = isslotavailable.Starttime3;
            const endTime3 = isslotavailable.Endtime3;
            if (startTime3 && startTime3 !== 0 && endTime3 && endTime3 !== 0) {
                const cb2 = startTime3?.split(" ");
                const newb2 = cb2[0]?.split(":");
                const SD2 = newb2[1];
                const starthour2 = newb2 && newb2[0];
                const format2 = cb2[1];


                const cbb2 = endTime3?.split(" ");
                const newbb2 = cbb2[0]?.split(":");
                const endhour2 = newbb2 && newbb2[0];
                const endformat2 = cbb2 && cbb2[1];
                slots3 = genrateSlots(starthour2, endhour2, slotDuration)
                const alreadyslotsbooked = await AppointmentModel.find({ $and: [{ doctorid: doctorid }, { appointmentDate: newdate }, { status: "pending" }] })
                const appointmentTimes = extractAppointmentTimes(alreadyslotsbooked);
                availableSlots3 = slots3.map(slot => { return { slot: slot, isbooked: appointmentTimes.includes(`${slot.startTime} - ${slot.endTime}`) }; })
            }

            const comparray = [...availableSlots, ...availableSlots2, ...availableSlots3];
            console.log(comparray)
            return res.send(success(200, comparray));
        }
        else {
            return res.send(success(200, ["doctor not available for this date"]));
        }
    } catch (e) {
        res.send(error(500, e.message));
    }
};


// const userslot = async (req, res) => {
//     const { doctorid, date } = req.params;
//     const newdate = new Date(date)

//     try {
//         const isslotavailable = await Slots.findOne({ $and: [{ doctor_id: doctorid }, { date: newdate }] });
//         if (isslotavailable !== null) {
//             let slots1 = [];
//             let slots2 = [];
//             let slots3 = [];
//             let availableSlots = [];
//             let availableSlots2 = [];
//             let availableSlots3 = [];
//             const SD = isslotavailable.slotduration;
//             const slotDuration = SD;
//             // isslotavailable)
//             // "object is already available");
//             // Define the starttimes and endtimes
//             const startTime1 = isslotavailable.Starttime1;
//             const endTime1 = isslotavailable.Endtime1;
//             if (startTime1 && startTime1 !== 0 && endTime1 && endTime1 !== 0) {
//                 const cb = startTime1?.split(" ");
//                 const newb = cb[0]?.split(":");
//                 // const SD = isslotavailable.slotduration;
//                 const starthour = newb[0];
//                 const format = cb[1];
//                 // const slotDuration = SD;

//                 const cbb = endTime1?.split(" ");
//                 const newbb = cbb[0]?.split(":");
//                 const endhour = newbb[0];
//                 const endformat = cbb && cbb[1];
//                 // Define the starttimes and endtimes
//                 slots1 = genrateSlots(starthour, endhour, slotDuration)
//                 const alreadyslotsbooked = await AppointmentModel.find({ $and: [{ doctorid: doctorid }, { appointmentDate: newdate }, { status: "pending" }] })

//                 const appointmentTimes = extractAppointmentTimes(alreadyslotsbooked);

//                 availableSlots = slots1.filter(slot => {
//                     const slotString = `${slot.startTime} - ${slot.endTime}`;
//                     return !appointmentTimes.includes(slotString);
//                 });

//             }


//             const startTime2 = isslotavailable.Starttime2;
//             const endTime2 = isslotavailable.Endtime2;
//             if (startTime2 && startTime2 !== 0 && endTime2 && endTime2 !== 0) {
//                 const cb1 = startTime2?.split(" ");
//                 const newb1 = cb1[0].split(":");
//                 // const SD1 = newb1[1];
//                 const starthour1 = newb1 && newb1[0];
//                 const format1 = cb1 && cb1[1];
//                 // const slotDuration1 = SD1;

//                 const cbb1 = endTime2?.split(" ");
//                 const newbb1 = cbb1[0]?.split(":");
//                 const endhour1 = newbb1 && newbb1[0];
//                 const endformat1 = cbb1[1];
//                 // Define the starttimes and endtimes
//                 slots2 = genrateSlots(starthour1, endhour1, slotDuration)
//                 const alreadyslotsbooked = await AppointmentModel.find({ $and: [{ doctorid: doctorid }, { appointmentDate: newdate }, { status: "pending" }] })
//                 const appointmentTimes = extractAppointmentTimes(alreadyslotsbooked);
//                 availableSlots2 = slots2.filter(slot => {
//                     const slotString = `${slot.startTime} - ${slot.endTime}`;
//                     return !appointmentTimes.includes(slotString);
//                 });

//             }


//             const startTime3 = isslotavailable.Starttime3;
//             const endTime3 = isslotavailable.Endtime3;
//             if (startTime3 && startTime3 !== 0 && endTime3 && endTime3 !== 0) {
//                 const cb2 = startTime3?.split(" ");
//                 const newb2 = cb2[0]?.split(":");
//                 const SD2 = newb2[1];
//                 const starthour2 = newb2 && newb2[0];
//                 const format2 = cb2[1];
//                 // const slotDuration2 = SD;

//                 const cbb2 = endTime3?.split(" ");
//                 const newbb2 = cbb2[0]?.split(":");
//                 const endhour2 = newbb2 && newbb2[0];
//                 const endformat2 = cbb2 && cbb2[1];
//                 slots3 = genrateSlots(starthour2, endhour2, slotDuration)
//                 const alreadyslotsbooked = await AppointmentModel.find({ $and: [{ doctorid: doctorid }, { appointmentDate: newdate }, { status: "pending" }] })
//                 const appointmentTimes = extractAppointmentTimes(alreadyslotsbooked);
//                 availableSlots3 = slots3.filter(slot => {
//                     const slotString = `${slot.startTime} - ${slot.endTime}`;
//                     return !appointmentTimes.includes(slotString);
//                 });
//             }

//             // const comparray = [...slots1, ...slots2, ...slots3];
//             const comparray = [...availableSlots, ...availableSlots2, ...availableSlots3];

//             return res.send(success(200, comparray));
//         }
//         else {
//             return res.send(success(200, ["doctor not available for this date"]));
//         }
//         // return res.send(isslotavailable);

//     } catch (e) {
//         res.send(error(500, e.message));
//     }
// };


const genrateSlots = (startTime, endTime, slotDuration) => {
    // Initialize the slots array
    const start = moment().hour(parseInt(endTime))
    const originalDate = moment(start);
    const endlastDate = originalDate.set({ hour: parseInt(endTime), minute: slotDuration, second: 0 });
    const slots = [];
    var numberOfSlots = Math.floor(((endTime - startTime) * 60) / slotDuration);

    let c = 12;
    let d = 12;

    // Calculate the number of slots
    // if (startTime < 12 && endTime < 12 && format === "AM" && endformat === "AM") {
    //     var numberOfSlots = Math.floor(((endTime - startTime) * 60) / slotDuration);

    // }
    // else if (startTime <= 12 && endTime >= 1 && format === "AM" && endformat === "PM") {
    //     if (parseInt(endTime) !== 12) {
    //         c = c + parseInt(endTime);
    //     }

    //     var numberOfSlots = Math.floor(((c - startTime) * 60) / slotDuration);

    // }
    // else if (startTime <= 12 && endTime < 12 && format === "PM" && endformat === "PM") {
    //     d = d + startTime;
    //     c = c + endTime;
    //     var numberOfSlots = Math.floor(((c - d) * 60) / slotDuration);
    //     // numberOfSlots)
    // }
    // else if (startTime < 12 && endTime >= 1 && format === "PM" && endformat === "AM") {
    //     c = c + endTime;
    //     var numberOfSlots = Math.floor(((c - startTime) * 60) / slotDuration);
    //     // numberOfSlots)
    // }
    // else {
    //     return null;
    // }

    //   Iterate over the slots
    for (let i = 0; i <= numberOfSlots + 1; i++) {
        // Calculate the start and end times for each slot
        // const start = moment().add(startTime,'hour').set('hour');
        const start = moment().hour(parseInt(startTime))
        const originalDate = moment(start);
        const modifiedDate = originalDate.set({ hour: parseInt(startTime), minute: 0, second: 0 });
        const a = modifiedDate.format()

        const startTimeOfSlot = moment(a).add(i * slotDuration, 'minutes');
        const endTimeOfSlot = moment(startTimeOfSlot).add(slotDuration, 'minutes');
        slots.push({
            startTime: startTimeOfSlot.format("HH:mm"),
            endTime: endTimeOfSlot.format("HH:mm")
        });
    }

    // Return the slots array
    return slots;
};

const generateSlots = (startTime, endTime, slotDuration) => {
    const slots = [];
    const currentTime = moment();
    const currentHour = parseInt(currentTime.format("HH"));
    const currentMinute = parseInt(currentTime.format("mm"));

    // Check if endTime is less than or equal to currentHour
    if (endTime <= currentHour) {
        return slots; // Return an empty array if endTime is invalid
    }

    // Check if startTime is less than the current time
    if (startTime < currentHour || (startTime === currentHour && 0 < currentMinute)) {
        // Adjust startTime to the current time
        startTime = currentHour;
        const remainingMinutes = slotDuration - (currentMinute % slotDuration);
        const startMinute = currentMinute + remainingMinutes;
        if (startMinute >= 60) {
            startTime += 1;
        }
    }

    let slotStartTime = moment().hour(startTime).minute(0).second(0);
    const slotEndTime = moment().hour(endTime).minute(0).second(0);

    while (slotStartTime.isBefore(slotEndTime)) {
        const endTimeOfSlot = moment(slotStartTime).add(slotDuration, 'minutes');

        // Check if the slot's startTime is greater than or equal to the current time
        if (slotStartTime.isSameOrAfter(currentTime)) {
            slots.push({
                startTime: slotStartTime.format("HH:mm"),
                endTime: endTimeOfSlot.format("HH:mm")
            });
        }

        slotStartTime = endTimeOfSlot;
    }

    return slots;
};

export { createslot, getslot, userslot };