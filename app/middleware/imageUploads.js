const multer = require('multer')
const path = require('path')

//set the storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname.toLowerCase()))
    }
})

//init upload
const upload = multer({
    storage: storage
})

module.exports = {
    upload
}