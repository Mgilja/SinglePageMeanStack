const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,  '/images/');
    },
    filename: function(req, file, cb) {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        cb(null,  name );
    }
});

const fileFilter = (req,file,cb) => {
    // rejecting file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}


const upload = multer({storage:storage, limits: {
     fileSize: 1024 * 1024 * 10
   }, 
   fileFilter: fileFilter
});

module.exports = upload.single("image")