const crypto = require('crypto')
const path = require('path')
const multer = require('multer')


const userImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/userimages')
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(14, function (err, buff) {
            let fn = buff.toString('hex') + path.extname(file.originalname)
            cb(null, fn)
        })
    }
})

module.exports = { userImageStorage };