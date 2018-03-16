module.exports = function (app) {
// application -------------------------------------------------------------
    var multer = require('multer');
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './src/uploads/usersAvatar')
        },
        filename: function (req, file, cb) {
            console.log(req.body.userDID);
            cb(null, req.body.userDID + '.png');
        }
    });
    var upload = multer({storage: storage});
// ----- define routes
    // upload

    app.post(global.apiUrl.post_upload_user_avatatr, upload.single('file'), function (req, res) {
        // req.file is the `avatar` file
        // req.body will hold the text fields, if there were any
    })
}