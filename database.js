const mongoose = require('mongoose')
const server = require('./config');

mongoose.connect(server.DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
})
    .then(db => console.log("DB connected"))
    .catch(err => console.error(err));
