/*
FileName : dbConnection.js
Date : 15th May 2023
Description : This file consist of code for MongoDB connection
*/

var mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// database connection
mongoose.connect(process.env['MONGO_URL'], { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 10, auto_reconnect: true });

// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + process.env['MONGO_URL']);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err);
  mongoose.disconnect();
});

