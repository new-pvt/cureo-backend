import { User } from '../Models/User.js';
import { Master } from '../Models/Master.js';
import { Otp } from '../Models/otpSchema.js';
import AWS from 'aws-sdk'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { error, success } from '../Utils/responseWrapper.js';






// email config
AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRETE_ACCESS_KEY_ID,
    region: "ap-south-1"
    // region: "us-east-1"
});
//const sns = new AWS.SNS();
const ses = new AWS.SES()





export const sendOtpController = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            // return res.status(400).send("All fields are required");
            return res.send(error(400, "All fields are required"));
        }

        const oldUser = await Master.findOne({ email })

        if (oldUser) {
            // return res.status(400).send("User is already registered");
            return res.send(error(409, "User is already registered"))
        }

        const mailIdExists = await Otp.findOne({ email: email })
        const OTP = Math.floor(100000 + Math.random() * 900000);

        if (mailIdExists) {
            const updateOtp = await Otp.findByIdAndUpdate({ _id: mailIdExists._id }, { otp: OTP }, { new: true })
            updateOtp.save();

            await sendOTPToEmail(email, OTP)
            res.send(success(200, `OTP sent successfully to ${email}`));

        } else {
            const saveOtpData = new Otp({ email, otp: OTP });
            await saveOtpData.save();

            await sendOTPToEmail(email, OTP)
            res.send(success(200, `OTP sent successfully to ${email}`));

        }
    } catch (e) {
        return res.send(error(400, "Something went wrong"));

    }

};
export const varifyOtpAndSignUpController = async (req, res) => {
    const { email, password, otp } = req.body
    if (!email || !otp || !password) {
        res.send(error(400, "all fields are required"))
    }

    try {
        const otpverification = await Otp.findOne({ email: email });

        if (otpverification.otp !== otp) {
            return res.send(error(403, "Invalid OTP"))

        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await Master.create({ email, password: hashedPassword })

        // return res.status(201).json({ user })
        return res.send(success(201, { user }))

    } catch (e) {
        return res.send(error(401, e.message))
    }
};
export const sendOTPToEmail = async (email, otp) => {
    const params = {
        Destination: {
            ToAddresses: [email],
        },
        Message: {
            Body: {
                Text: {
                    Data: `Your OTP: ${otp}`,
                },
            },
            Subject: {
                Data: 'Your OTP for Medidek',
            },
        },
        Source: 'support@medidek.in',
    };

    try {
        const result = await ses.sendEmail(params).promise();
        return result
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }
};


export const signinController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            // return res.status(400).send("All fields are required");
            return res.send(error(400, "All fields are required"))
        }

        const user = await Master.findOne({ email })

        if (!user) {
            // return res.status(404).send("User is not registered");
            return res.send(error(404, "User is not registered"))
        }

        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
            // return res.status(403).send("Invalid password");

            return res.send(error(403, "Incorrect password"))
        }

        const accessToken = genrateAccessToken({
            _id: user._id
        })
        const refreshToken = genrateRefreshToken({
            _id: user._id
        });

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true
        })

        // return res.status(200).json({ accessToken })
        return res.send(success(200, { accessToken, user }));




    } catch (e) {
        return res.send(error(500, e.message));
    }
};

export const logoutController = (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
        })
        return res.send(success(200, 'User logged out'))
    } catch (e) {
        return res.send(error(500, e.message))
    }
}

// This api will check the refresh token validity and generate a new access token
export const refreshAccessTokenController = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies.jwt) {
        // return res.status(401).send("Refresh token in cookie is required");
        return res.send(error(401, "Refresh token in cookie is required"))
    }

    const refreshToken = cookies.jwt

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);
        const _id = decoded._id;
        const accessToken = genrateAccessToken({ _id });

        return res.send(success(201, { accessToken }));

    } catch (e) {
        return res.send(error(401, 'Invalid refresh token'));
    }

}

//Internal functions
export const genrateAccessToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: "1y" });
        return token
    } catch (e) {
        return res.send(error(401, e.message))
    }
}

export const genrateRefreshToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, { expiresIn: "1y" });
        return token
    } catch (e) {
        return res.send(error(401, e.message))
    }
}



