const jwt = require('jsonwebtoken');
const { ApiResponse, SetError } = require('./../helpers/common');
const { handleError } = require('./../helpers/utils');

// validates access token for user
exports.validateToken = function (req, res, next) {
  let rcResponse = new ApiResponse();
  try {
    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];
    if (token) {
      // verifies secret
      jwt.verify(token, process.env['SECRET'], function (err, decoded) {
        if (err) {
          throw SetError({}, 403, 'InvalidToken');
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      throw SetError({}, 403, 'InvalidToken');
    }
  } catch (err) {
    handleError(err, rcResponse);
    return res.status(rcResponse.code).send(rcResponse);
  }
};