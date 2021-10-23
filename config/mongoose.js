const mongoose = require('mongoose');
const env = require('./environment');

mongoose.connect(`mongodb://localhost/${env.db}`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error xonnecting to mongo db'));

db.once('open', function(){
    console.log('Connected to Database :: MOngoDB');
});

module.exports = db;