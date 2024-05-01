import { getObjectSignedUrl, uploadFile } from "../Middleware/s3.js";
import { MedicalHistory } from "../Models/Records.js"
import { error, success } from "../Utils/responseWrapper.js"
import crypto from "crypto";

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

// {
//   fieldname: 'image',
//   originalname: 'pexels-muffin-creatives-1595437.jpg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 48 00 48 00 00 ff e2 0c 58 49 43 43 5f 50 52 4f 46 49 4c 45 00 01 01 00 00 0c 48 4c 69 6e 6f 02 10 00 00 ... 1841504 more bytes>,
//   size: 1841554
// }

const RecordCreation = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    const imgname = file?.originalname
    const imgtype = file?.mimetype
    const imgsize = file?.size

    const imageName = file ? generateFileName() : "6d27d5a62d61ead2a0084c78fb31307afd5fed6e9e42c49feb9efdbf03423061";
    const fileBuffer = file?.buffer;
    if (fileBuffer) {
      await uploadFile(fileBuffer, imageName, file.mimetype)
    }
    let data = await MedicalHistory.create({ userid: id, img: imageName, imgname, imgsize, imgtype })
    if (data.img) {
      data.imgurl = "https://d2m9x1v3tvj3q8.cloudfront.net/" + data.img
      await data.save();
    }
    res.send(
      success(201, data))
  } catch (e) {
    res.send(
      error(500, e.masseage))
  }
}


const getRecordforPatient = async (req, res) => {
  const { id } = req.params
  try {
    let result = await MedicalHistory.find({ userid: id }).sort({ createddate: -1 })
    res.send(
      success(201, result))
  } catch (e) {
    res.send(
      error(500, e))
  }
}









export { RecordCreation, getRecordforPatient }

