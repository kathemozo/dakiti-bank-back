const randomString = () => {
  let crypto = require('crypto');
  let id = crypto.randomBytes(20).toString('hex');
  return id;
};

module.exports = randomString;
