import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads/Hospital/HospitalImage")
    },
    filename: (req, file, callback) => {
        callback(null, `image-${Date.now()}.${file.originalname}`)
    }
})

const filefilter = (req, file, callback) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/svg") {
        callback(null, true)
    }
    else {
        callback(null, false)
        callback(new Error("Only Images Allowed"))
    }
}

const upload = multer({
    storage:storage,
    fileFilter:filefilter
})

export {upload}