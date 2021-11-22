const mongoose = require('mongoose');
const env = require('./environment');

const url = `mongodb+srv://hgaur1089:hgaur1089@cluster0.pfeht.mongodb.net/${env.db}?retryWrites=true&w=majority`
const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
};

// mongoose.connect(`mongodb://localhost/${env.db}`);
mongoose.connect(url,connectionParams);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error xonnecting to mongo db'));

db.once('open', function(){
    console.log('Connected to Database :: MOngoDB');
});

module.exports = db;