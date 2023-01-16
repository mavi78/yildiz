const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { logEvents } = require("./logger");

const protect = asyncHandler(async (req, res, next) => {
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = await User.findById(decoded.id).select("-password").exec();
      next();
    } catch (err) {
      let errMsg = "";
      if (err.message === "jwt malformed") {
        errMsg = "Yanlış biçimlendirilmiş token";
      }
      if (err.message === "jwt expired") {
        errMsg = "Süresi dolmuş token";
      }
      if (err.message === "invalid signature") {
        errMsg = "Geçersiz token";
      }
      logEvents(
        `${err.name}:${errMsg}\t${req.method}\t${req.url}\t${req.headers.origin}`,
        "userAuthorization.log"
      );
      console.log(err.stack);
      res.status(401);
      res.json({ message: errMsg });
    }
  }
  if (!token) {
    res.status(401);
    res.json({ message: "No authorization, No Token" });
  }
});

module.exports = { protect };
