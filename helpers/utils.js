const hmacValidator = require('hmac-validator');
const bcrypt = require('bcryptjs');
const { SetResponse, ErrMessages } = require('./common');
const request = require('request-promise');
var moment = require('moment');
const commonModel = require("./../model/common");

/* Generate hash for password */
module.exports.generatePasswordHash = async (password) => {
  try {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          reject(err);
        } else {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
              reject(err);
            } else {
              resolve(hash);
            }
          });
        }
      });
    });
  } catch (err) {
    throw err;
  }
};

/* Compare password hash */
module.exports.comparePassword = async (originalPass, passToMatch) => {
  try {
    return new Promise((resolve, reject) => {
      bcrypt.compare(originalPass, passToMatch, (err, isMatch) => {
        if (err) {
          reject(err);
        } else {
          resolve(isMatch);
        }
      });
    });
  } catch (err) {
    throw err;
  }
};

module.exports.handleError = async (err, rcResponse) => {
  try {
    if (err.type && err.type == 'custom') {
      SetResponse(rcResponse, err.code, ErrMessages[err.message], false);
    } else if (err.response && err.response.headers && err.response.headers['x-shopify-stage']) {
      SetResponse(rcResponse, err.statusCode, err.message, false);
    } else {
      if (process.env.NODE_ENV === 'prod') {
        if (req.decoded) {
          Sentry.setUser({ id: req.decoded.id, username: req.decoded.shopUrl });
        }
        if (req.body) {
          Sentry.setContext("body", req.body);
        }
        Sentry.captureException(err);
      } else {
        console.log(err);
      }
      SetResponse(rcResponse, 500, ErrMessages['ISE'], false);
    }
  } catch (err) {
    SetResponse(rcResponse, 500, err.message, false);
  }
}

module.exports.verify = function (query) {
  try {
    var validate = hmacValidator({
      replacements: {
        both: {
          '&': '%26',
          '%': '%25'
        },
        keys: {
          '=': '%3D'
        }
      },
      excludedKeys: ['signature', 'hmac'],
      algorithm: 'sha256',
      format: 'hex',
      digestKey: 'hmac'
    });

    // 3. Verify signature
    return validate(process.env.appSecret, null, query);
  } catch (err) {
    throw err;
  }
};

module.exports.handlePromiseRequest = async (options) => {
  try {
    return request(options);
  } catch (err) {
    throw err;
  }
}