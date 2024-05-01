import jwt from 'jsonwebtoken'
import { error } from '../Utils/responseWrapper.js';
import { Master } from '../Models/Master.js';
import { Doctor } from '../Models/AddDoctors.js';
import { userpatient } from '../Models/Userpatition.js';

export const requireUser = async (req, res, next) => {
    if (!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        // return res.status(401).send('Authentication header is required');
        res.send(error(401, 'Authentication header is required'));
    }

    const accessToken = req?.headers?.authorization?.split(" ")[1];


    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY);
        req._id = decoded._id;
        const user = await Master.findById(req._id) || Doctor.findById(req._id) || userpatient.findById(req._id)
        if (!user) {
            return res.send(error(404, 'User not found...'));
        }
        next();
    } catch (e) {
        // return res.status(401).send('Invalid access key');
        res.send(error(401, 'Invalid access key'));
    }
}