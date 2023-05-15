/* DEPENDENCIES */
const { ApiResponse, SetError } = require('./../helpers/common');
const { handleError } = require('./../helpers/utils');
const commonModel = require('./../model/common');

/* Get Booking's list */
module.exports.getBookings = async (req, res) => {
    let rcResponse = new ApiResponse();
    let { query, decoded } = req;
    try {
        let limit = query.limit ? parseInt(query.limit) : 10;
        let skip = query.page ? ((parseInt(query.page) - 1) * (limit)) : 0;
        let sort = { created: - 1 };
        rcResponse.data = (await commonModel.findWithCount('bookings', [{ userId: decoded.id }], skip, limit, sort))[0];
    } catch (err) {
        handleError(req, err, rcResponse);
    }
    return res.status(rcResponse.code).send(rcResponse);
};

/* Create Bookings */
module.exports.createBookings = async (req, res) => {
    let rcResponse = new ApiResponse();
    let { body, decoded } = req;
    try {
        if (!body.bookingDate || !body.bookingType) {
            throw SetError({}, 400, 'InvalidParams');
        }

        //check same day booking available for full day
        // let checkCurrentBooking = commonModel.findOne('booking', { bookingType: "Full Day", bookingDate: Date.now() })
        // if (checkCurrentBooking) {
        //     throw SetError({}, 400, 'NotAvailable');
        // }

        body["userId"] = decoded.id;
        rcResponse.data = await commonModel.create('booking', body);
    } catch (err) {
        handleError(req, err, rcResponse);
    }
    return res.status(rcResponse.code).send(rcResponse);
};

/* Cancel Bookings */
module.exports.cancelBookings = async (req, res) => {
    let rcResponse = new ApiResponse();
    let { body, decoded } = req;
    try {
        rcResponse.data = await commonModel.findOneAndUpdate('booking', { _id: body._id }, { $set: body });
    } catch (err) {
        handleError(req, err, rcResponse);
    }
    return res.status(rcResponse.code).send(rcResponse);
};