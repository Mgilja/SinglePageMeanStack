const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const jwtSecret;

const User = require('../db/models/userModel');


exports.createUser = (req,res,next) => {
    bcrypt.hash(req.body.password, 10)
    .then((hash) => {
        const user = new User({
            email:req.body.email,
            password:hash
        });
        user.save()
        .then((result) => {
            res.status(201).json({
                message:'user created successfully',
                result:result
            })
        })
        .catch((err) => {
          res.status(500).json({
              message:'you cannot use the same email, invalid credentials',
              error: err
           })
        })
    })
};


exports.userLogin = (req,res,next) => {
    let existingUser;
    User.findOne({
        email:req.body.email
    }).then((user) => {
        //console.log(user);
        if(!user) {
            return res.status(404).json({
                message:"Auth failed, noo user with such an e-mail adress"
            })
        }
         existingUser = user;
         return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
        //console.log(result);
         if(!result) {
            return res.status(404).json({
                message:"Wrong  password, try again"
            })
         }
       const token = jwt.sign(
        { email:existingUser.email, userId: existingUser._id }, process.env.JWT_KEY, 
        { expiresIn:"1h" }
       );
       //console.log(token);
       res.status(200).json({
           token:token,
           expiresIn: 3600,
           userId:existingUser._id
       })
    })
    .catch((err) => {
        //console.log(err);
        return res.status(404).json({
            message:'Invalid login credentials'
        })
    })
};
