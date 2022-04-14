const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('./db/mongoose');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user')


// cors
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers','x-refresh-token,Origin, X-Requested-With, Content-Type, Accept, Authorization, _id');
    
    res.header('Access-Control-Expose-Headers',
    'authorization, x-refresh-token,');
    
    next();
});

// body parse request middleware 
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//static
app.use( "/images",express.static(path.join("/images")));

//routes
app.use('/posts', postRoutes);
app.use('/user', userRoutes);

// server
app.listen(5500, (req,res)=> {
   console.log('app is listening on port 5500');
})