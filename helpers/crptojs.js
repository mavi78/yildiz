const CryptoJS = require("crypto-js");
const sign = process.env.CRYP_SCREET;

exports.encrypt = async (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), sign).toString();
};

exports.decrypt = async (data) => {
  const bytes = CryptoJS.AES.decrypt(data, sign);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
