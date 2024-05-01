const slots = [
    { startTime: '02:00', endTime: '02:15' },
    { startTime: '02:15', endTime: '02:30' },
]

const alreadyslotsbooked = [
    {
        "_id": { "$oid": "65dc6ce6c493ec74449e2c1c" },
        "doctorid": { "$oid": "65d6f17bc493ec74449e25ec" },
        "userid": { "$oid": "658abcc4c493ec74449b8505" },
        "name": "Sagar Gupta", "age": { "$numberInt": "55" },
        "gender": "male", "phone": { "$numberDouble": "8999525221.0" },
        "AppointmentNotes": "jhvhjbjbj", "appointmentDate": { "$date": { "$numberLong": "1708905600000" } },
        "AppointmentTime": "02:00 - 02:15", "status": "missed", "createddate": { "$date": { "$numberLong": "1703250576289" } },
        "createdAt": { "$date": { "$numberLong": "1708944614891" } },
        "updatedAt": { "$date": { "$numberLong": "1710095409536" } }, "__v": { "$numberInt": "0" }
    },
    {
        "_id": { "$oid": "65dc6ce6c493ec74449e2c1c" },
        "doctorid": { "$oid": "65d6f17bc493ec74449e25ec" },
        "userid": { "$oid": "658abcc4c493ec74449b8505" },
        "name": "Sagar Gupta", "age": { "$numberInt": "55" },
        "gender": "male", "phone": { "$numberDouble": "8999525221.0" },
        "AppointmentNotes": "jhvhjbjbj", "appointmentDate": { "$date": { "$numberLong": "1708905600000" } },
        "AppointmentTime": "22:00 - 22:15", "status": "missed", "createddate": { "$date": { "$numberLong": "1703250576289" } },
        "createdAt": { "$date": { "$numberLong": "1708944614891" } },
        "updatedAt": { "$date": { "$numberLong": "1710095409536" } }, "__v": { "$numberInt": "0" }
    },
    {
        "_id": { "$oid": "65dc6ce6c493ec74449e2c1c" },
        "doctorid": { "$oid": "65d6f17bc493ec74449e25ec" },
        "userid": { "$oid": "658abcc4c493ec74449b8505" },
        "name": "Sagar Gupta", "age": { "$numberInt": "55" },
        "gender": "male", "phone": { "$numberDouble": "8999525221.0" },
        "AppointmentNotes": "jhvhjbjbj", "appointmentDate": { "$date": { "$numberLong": "1708905600000" } },
        "AppointmentTime": "03:00 - 03:15", "status": "missed", "createddate": { "$date": { "$numberLong": "1703250576289" } },
        "createdAt": { "$date": { "$numberLong": "1708944614891" } },
        "updatedAt": { "$date": { "$numberLong": "1710095409536" } }, "__v": { "$numberInt": "0" }
    },

]


const extractAppointmentTimes = (slots) => {
    return slots.map(slot => slot.AppointmentTime);
};

const appointmentTimes = extractAppointmentTimes(alreadyslotsbooked);
// console.log(appointmentTimes);




// const availableSlots = slots.filter(slot => !alreadyslotsbooked.includes(slot));
const availableSlots = slots.filter(slot => {
    const slotString = `${slot.startTime} - ${slot.endTime}`;
    return !appointmentTimes.includes(slotString);
});

