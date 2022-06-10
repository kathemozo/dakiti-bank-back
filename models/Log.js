const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    email: String,
    name: String,
    action:  String,
    createdAt: {type: Date, default: Date.now},
})

module.exports = mongoose.model('Log', schema);
