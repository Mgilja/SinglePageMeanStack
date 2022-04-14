
const Post = require('../db/models/postModel');





exports.getFiles = (req,res,next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fecthedPosts;
    if (pageSize && currentPage) {
           postQuery
           .skip(pageSize * (currentPage - 1))
           .limit(pageSize)
    }
    
    postQuery.then(documents => {
            fecthedPosts = documents;
            return Post.count()
     })
  .then((count) => {
      res.status(200).json({
          message:'posts fetched successuflly',
          posts: fecthedPosts,
          maxPosts: count,
      });
  })
  .catch((error) => {
      res.status(500).json({
          message:"Something went wrong, can't get posts"
      })
  })
};

exports.getSingleFile =  (req,res,next) => {
    Post.findById(req.params.id).then((post) => {
      if(post) {
       res.status(200).json(post);
      }
      else {
          res.status(404).json()
      }
    })
   };
   
exports.postFile = (req,res,next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        user: req.userData.userId
    })
    console.log(req.userData)
    post.save().then(result => {
        console.log(result);
        res.status(201).json({
        message:'post added successfully',
        post: {
            id: result._id,
            title:result.title,
            content:result.content,
            imagePath:result.imagePath,
        }
      });
    }).catch((error) => {
        res.send(500).json({
            message:'creating post failed'
        })
    })
}

exports.updateFile = (req,res,next) => {

    //let imagePath = req.body.imagePath;
    const url = req.protocol + '://' + req.get("host");
    //imagePath = url + "/images/" + req.file.filename
    
    console.log(req.file);
    const post = new Post
    ({
        _id:req.body.id,
        title:req.body.title,
        content:req.body.content,
        //imagePath:url + "/images/" + req.file.filename,
        user:req.userData.userId
    });
    Post.updateOne({
        _id:req.params.id,
        user:req.userData.userId
    },{ 
        $set: {
        _id:req.body.id,
        title:req.body.title,
        content:req.body.content,
        imagePath:url + "/images/" + req.file.filename,
        user:req.userData.userId
        
    
        
      }
    })
    .then((result) => {
        console.log(result);
        res.status(200).json({message:'updated sucessfully'});
    })
    .catch((error) => {
        res.status(500).json({
            message:'Failed to update posts'
        })
        
    })
    
};

exports.deleteFile = (req,res, next) => {
    Post.deleteOne({
        _id:req.params.id,
        user:req.userData.userId
    }).then((result) => {
        console.log(result);
        
             res.status(200).json({
        message:'post successfully deleted'
       })

    })
    .catch((error) => {
        res.status(500).json({
            message:"Failed to delete posts, try again"
        })
    })
};