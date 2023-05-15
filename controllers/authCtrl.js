/*
FileName : authCtrl.js
Date : 15th May 2023
Description : This file consist of list of user functions
*/

/* DEPENDENCIES */
const { ApiResponse, SetError } = require('./../helpers/common');
const { handleError, comparePassword, generatePasswordHash, sendMail } = require('./../helpers/utils');
const commonModel = require('./../model/common');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');

/* Signup User*/
module.exports.signup = async (req, res, next) => {
    let rcResponse = new ApiResponse();
    let { body } = req;
    try {
        if (!body.email || !body.password) {
            throw SetError({}, 400, 'InvalidParams');
        }

        let user = await commonModel.findOne('user', { email: body.email });
        if (user) {
            throw SetError({}, 400, 'EmailExists');
        }
        const passHash = await generatePasswordHash(body.password);

        let saveUserPayload = {
            firstName: body.firstName ? body.firstName : "",
            lastName: body.lastName ? body.lastName : "",
            email: body.email,
            password: passHash,
        };
        await commonModel.create('user', saveUserPayload);

        rcResponse.data = true;
    } catch (err) {
        handleError(err, rcResponse);
    }
    return res.status(rcResponse.code).send(rcResponse);
};

/* Login user */
module.exports.login = async (req, res) => {
    let rcResponse = new ApiResponse();
    let { body } = req;
    try {
        if (!body.email || !body.password) {
            throw SetError({}, 400, 'InvalidParams');
        }
        /* Check if email exists */
        const user = await commonModel.findOne('user', { email: req.body.email });
        if (user) {
            /* Compare password */
            const comparePasswordResult = await comparePassword(body.password, user.password);
            if (comparePasswordResult) {
                /* Password matched */
                const encodedData = {
                    id: user._id,
                    email: user.email,
                };

                // generate accessToken using JWT
                const token = jwt.sign(encodedData, process.env['SECRET']);
                rcResponse.data = { ...user, ...{ token: token } };
            } else {
                throw SetError({}, 403, 'InvalidPassword');
            }
        } else {
            throw SetError({}, 404, 'UserNotFound');
        }
    } catch (err) {
        handleError(err, rcResponse);
    }
    return res.status(rcResponse.code).send(rcResponse);
};

/* Get user's profile information */
module.exports.getUserProfile = async (req, res) => {
    /* construct response object */
    let rcResponse = new ApiResponse();
    const { decoded } = req;
    try {
        rcResponse.data = await commonModel.findOne('user', { _id: decoded.id });
    } catch (err) {
        handleError(err, rcResponse);
    }
    return res.status(rcResponse.code).send(rcResponse);
};
