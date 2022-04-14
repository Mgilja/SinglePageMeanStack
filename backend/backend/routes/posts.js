const express = require('express');

const router = express.Router();

const fileUpload = require("../middleware/files")
const auth = require('../middleware/authmiddleware');
const PostsController = require("../controllers/posts")



router.get("", PostsController.getFiles)
router.get('/:id', PostsController.getSingleFile)
router.post("", auth, fileUpload , PostsController.postFile);
router.put('/:id',auth, fileUpload, PostsController.updateFile)
router.delete('/:id',auth, PostsController.deleteFile)



module.exports = router;