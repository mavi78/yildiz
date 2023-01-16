const jwt = require("jsonwebtoken");

exports.generateToken = async (payload, expired) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: expired,
  });
};
