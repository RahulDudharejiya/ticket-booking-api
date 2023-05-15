/*
FileName : Index.js
Date : 15th May 2023
Description : This file consist of list of routes for the APIs
*/

/* DEPENDENCIES */
const express = require('express');
const router = express.Router();
const authCtrl = require('./../controllers/authCtrl');
const bookingCtrl = require('./../controllers/bookingCtrl');
const dbConnection = require('./../config/dbConnection');
const checkToken = require('./../middlewares/checkToken');

/*****************************
 USERS
 *****************************/

router.post('/auth/signup', authCtrl.signup);

router.post('/auth/login', authCtrl.login);

router.get('/auth/profile', checkToken.validateToken, authCtrl.getUserProfile);

/*****************************
 Booking
 *****************************/

router.get('/booking', checkToken.validateToken, bookingCtrl.getBookings);

router.post('/booking', checkToken.validateToken, bookingCtrl.createBookings);

router.put('/booking', checkToken.validateToken, bookingCtrl.cancelBookings);


module.exports = router;