const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    content : {
        type: String,
        required: true
    },
    imagePath : {
        type:String, 
        reuqired:true
    },
    user : {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }
});
const Post = mongoose.model('Post', postSchema);

module.exports = Post
