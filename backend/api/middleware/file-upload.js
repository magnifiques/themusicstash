const multer = require('multer')
const { v4: uuidv4 } = require('uuid');


const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg'
}

const storage = multer.diskStorage({
    
    destination: function(req, file, cb) {
        console.log(file)
        cb(null, 'uploads/images');
    },

    filename: function(req, file, cb) {
        const ext = MIME_TYPE_MAP[file.mimetype]
        cb(null, uuidv4() + '.' + ext);
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
                cb(null, true)
            }
            else{
                cb(new Error('Upload a valid image'), false)
            }
}


const fileUpload = multer({ storage: storage, 
    limits: {fileSize: 1024 * 1024 * 1},
    fileFilter: fileFilter
 })
 

module.exports = fileUpload






// We Dont need this right now
// const multer = require('multer')

// const storage = multer.diskStorage({
    
//     destination: function(req, file, cb) {
//         cb(null, './uploads/');
//     },

//     filename: function(req, file, cb) {
//         cb(null, `${file.originalname}`);
//     }
// })

// const fileFilter = (req, file, cb) => {
//     if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//         cb(null, true)
//     }
//     else{
//         cb(new Error('Upload a valid image'), false)
//     }
// }

// const upload = multer({ storage: storage, 
//     limits: { fileSize: 1024 * 1024 * 5},
//     fileFilter: fileFilter
//  })