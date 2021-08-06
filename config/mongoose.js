const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/comet_development');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error xonnecting to mongo db'));

db.once('open', function(){
    console.log('Connected to Database :: MOngoDB');
});

module.exports = db;