const CryptoJS = require('crypto-js');
const server = require('../config');

exports.encrypt = password => {
    return  CryptoJS.AES.encrypt(password, server.SECRET_KEY).toString();
};

exports.decrypt = password =>{
    var bytes  = CryptoJS.AES.decrypt(password, server.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};
