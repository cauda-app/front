require('dotenv').config();
const jwt = require('jsonwebtoken');

// jwtid is used to identify the token in case it needs to be blacklisted in the future
const signMobileToken = (jwtid) => {
  const token = jwt.sign(
    {
      isMobile: true,
    },
    process.env.JWT_SECRET,
    { jwtid }
  );

  return token;
};

const jwtid = process.argv[2];

if (!jwtid) throw 'No jwtid supplied';

console.log(signMobileToken(jwtid));
