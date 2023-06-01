const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const PRIVATE_KEY = "JWTPrivateKey";

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

const generateToken = (user) => {
  const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn: '5m'});
  return token;
};

const authenticateToken = (req, res, next) => {
  const token = req.cookies.jwtCookieToken;
  if (!token) return res.status(401).send({
    error: "Not authenticated"
  });

  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error) return res.status(403).send({error: "Not authorized"});
    console.log("what is this", credentials);
    req.user = credentials.user;
    next();
  });
};



module.exports = { hashPassword, comparePasswords, getAge,
                   generateToken, authenticateToken };