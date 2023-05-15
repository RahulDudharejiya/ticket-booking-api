/*
FileName : bookingModel.js
Date : 15th May 2023
Description : This file consist of Booking's model fields
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    bookingDate: { type: Date },
    bookingType: {
        type: String,
        enum: ['Full Day', 'Half Day', 'Custom']
    },
    bookingSlot: {
        type: String,
        enum: ['First Half', 'Second Half']
    },
    bookingTime: { type: String },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('booking', bookingSchema);