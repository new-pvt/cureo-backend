import { error, success } from "../Utils/responseWrapper.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Admin } from "../Models/Admin.js"

const adminLogin = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) return res.send(error(401, "All feilds required"));

    try {
        const adminUser = await Admin.findOne({ email })

        if (!adminUser) return res.send(error(404, "User not found"));

        const matched = await bcrypt.compare(password, adminUser.password);

        if (!matched) return res.send(error(403, "Incorrect password"));

        const accessToken = genrateAccessToken({
            _id: adminUser._id
        })
        const refreshToken = genrateRefreshToken({
            _id: adminUser._id
        });
        return res.send(success(200, { accessToken, adminUser, refreshToken }));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const createAdminUser = async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) return res.send(error(401, "All Fields Required"));
    try {
        const alreadyExist = await Admin.findOne({ email })

        if (alreadyExist) return res.send(error(409, "Admin user already exists"))

        const hashedPassword = await bcrypt.hash(password, 10)

        const createNewAdminUser = await Admin.create({ email, password: hashedPassword })

        const accessToken = genrateAccessToken({
            _id: createNewAdminUser._id
        })
        const refreshToken = genrateRefreshToken({
            _id: createNewAdminUser._id
        });

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true
        })

        // return res.status(200).json({ accessToken })
        return res.send(success(200, { accessToken, createNewAdminUser }));
    } catch (e) {
        return res.send(error(500, e.message));
    }

}

const logoutController = (req, res) => {
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

const refreshAccessTokenController = async (req, res) => {
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

        //    return res.status(201).json({accessToken})
        return res.send(success(201, { accessToken }));

    } catch (e) {
        // return res.status(401).send('Invalid refresh token');
        return res.send(error(401, 'Invalid refresh token'));
    }

}


export const genrateAccessToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: "1d" });
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

export {
    adminLogin,
    createAdminUser,
    logoutController,
    refreshAccessTokenController
}