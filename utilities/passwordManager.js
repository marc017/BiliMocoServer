const CryptoJS = require('crypto-js');
const config = require('config');

const check = (userPassword, inputPassword) => {
  const secretKey = CryptoJS.AES.decrypt(
    userPassword.trim(),
    inputPassword.trim()
  ).toString(CryptoJS.enc.Utf8);
  console.log(userPassword, inputPassword);
  console.log(secretKey, 'secret key');
  console.log(config.p_key, 'server key');
  return secretKey === config.p_key;
};

const encrypt = (password) => {
  return CryptoJS.AES.encrypt(config.p_key, password.trim()).toString();
};

module.exports = {
  check,
  encrypt,
};
