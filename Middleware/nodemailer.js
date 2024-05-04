import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
})