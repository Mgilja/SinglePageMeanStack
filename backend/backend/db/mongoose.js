const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://mgilja93:' + process.env.MONGO_PASS +'@cluster0.nldsu.mongodb.net/MyMessages',
{useNewUrlParser:true})
.then(()=> {
    console.log('You are connected to MongoDB successfully');
}).catch((err)=> {
  console.log('error while trying to connect', err);
});

module.exports = 
    mongoose
