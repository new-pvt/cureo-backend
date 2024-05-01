import { Doctor } from "../Models/AddDoctors.js";
import { Test } from "../Models/Test.js";
import { error, success } from "../Utils/responseWrapper.js";
import bcrypt from 'bcrypt'
import crypto from 'crypto'


//Rename key in test collection

const renameKeyApi = async (req, res) => {
    try {
        const oldKey = await Test.find();
        // const updateKey = oldKey.updateMany({},
        //     { $rename: { "NameOfTheDoctor": "nameOfTheDoctor" } })

        return res.send(success(201, oldKey));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const dynamicAddingDoctors = async (req, res) => {

    try {
        const testDoctors = await Test.find();

        return res.send(success(200, testDoctors))
    } catch (e) {
        return res.send(error(e.message))
    }

}


// const addRequireData = async (req, res) => {

//     const email = 'medidek00001'

//     try {
//         const password = 'Medidek@123'
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const addPassword = await Test.updateMany(
//             { },
//             { $set: { "password": hashedPassword } }
//           )



//         return res.send(success(201, addPassword))
//     } catch (e) {
//         return res.send(error(e.message))
//     }

// }

const addUsername = async (req, res) => {

    try {

        const doctors = await Test.find();
        let username = 'medidek';
        
        var a = [];
        for (let i = 1; i <= doctors.length; i++) {
            const newusername = `${username}` + `000${i}`;
            a.push(newusername);
        }
        for (let i = 0; i < a.length; i++) {
            const newusername = a[i];
            const singledoctor = doctors[i]
             var addNewUsername = await Test.findByIdAndUpdate(
            {_id:singledoctor._id},
            { $set: { "username": newusername } }
        )
        }
       
        return res.send(success(201, addNewUsername))
    } catch (e) {
        return res.send(error(e.message))
    }

}
const addDUID= async (req, res) => {

    try {

        const doctors = await Test.find();
        var a = [];
        for (let i = 1; i <= doctors.length; i++) {
            const doctorid = crypto.randomInt(0, 1000000);
            a.push(doctorid);
        }
        for (let i = 0; i < a.length; i++) {
            const newdoctorid = a[i];
            const singledoctor = doctors[i]
             var addNewUsername = await Test.findByIdAndUpdate(
            {_id:singledoctor._id},
            { $set: { "doctorid": newdoctorid } }
        )
        }
       
        return res.send(success(201, addNewUsername))
    } catch (e) {
        return res.send(error(e.message))
    }

}

const addCompleteDoctor =async(req,res)=>{
    const alltestdata = await Test.find();
    const insertmanydata = await Doctor.insertMany(alltestdata);
        return res.send(success(201, insertmanydata))
}





export { dynamicAddingDoctors, renameKeyApi, addUsername ,addDUID,addCompleteDoctor};