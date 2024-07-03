const crypto = require('crypto');

const hashPassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
};

const comparePassword = (inputPassword, storedPassword, salt) => {
  
  const hashedInputPassword = hashPassword(inputPassword, salt);
  console.log(hashedInputPassword);
  return hashedInputPassword === storedPassword;
};

module.exports = { hashPassword, comparePassword };