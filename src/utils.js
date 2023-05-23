const bcrypt = require('bcrypt');

function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  return hashedPassword;
}

function comparePasswords(password, hashedPassword) {
  const isMatch = bcrypt.compareSync(password, hashedPassword);
  return isMatch;
}

const getAge = (dateString) => {
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

module.exports = { hashPassword, comparePasswords, getAge };