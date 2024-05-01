import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./Uploads/Patient/MedicalRecord")
    },
    filename: (req, file, callback) => {
        callback(null, `Record-${Date.now()}.${file.originalname}`)
    }
})

const filefilter = (req, file, callback) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/svg" || file.mimetype === "image/pdf") {
        callback(null, true)
    }
    else {
        callback(null, false)
        callback(new Error("Only Images Allowed"))
    }
}

const uploadRecord = multer({
    storage:storage,
    fileFilter:filefilter
})

export {uploadRecord}