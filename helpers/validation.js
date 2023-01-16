exports.validateEmail = (email) => {
  const regex = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/;
  return String(email).toLowerCase().match(regex);
};

exports.validateLength = (text, min, max) => {
  const txt = String(text).trim();
  if (txt.length > max || txt.length < min) {
    return false;
  }
  return true;
};

exports.validatePasswordLength = (text, min, max) => {
  if (text.length > max || text.length < min) {
    return false;
  }
  return true;
};
