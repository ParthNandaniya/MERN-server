var express    = require("express"),
    multer  = require('multer'),
    // upload = multer({ dest: 'uploads/' }),
    router     = express.Router(),
    User       = require("../models/user"),
    Media      = require("../models/media"),
    GridFsStorage = require('multer-gridfs-storage'),
    configs    = require('../configs');

var app = express();
var mongoose = require('mongoose');

var Grid = require("gridfs-stream");
eval(`Grid.prototype.findOne = ${Grid.prototype.findOne.toString().replace('nextObject', 'next')}`);

var fs = require("fs");
Grid.mongo = mongoose.mongo;
const connection = mongoose.connection;
// var Schema = mongoose.Schema;
// // mongoose.connect('mongodb://127.0.0.1/test');
// var conn = mongoose.connection;
    
// var fs = require('fs');
    
// var Grid = require('gridfs-stream');
// Grid.mongo = mongoose.mongo;
// var gfs = Grid(conn.db);

var writestream;
var readstream;
var gfs;
var buffer;

// var readstreamFunction = (gfs, fileName, mimetype) => {
//     writestream = gfs.createWriteStream({
//         filename: `${fileName}`,
//         content_type: mimetype, // image/jpeg or image/png
//     });
//     fs.createReadStream('/media').pipe(writestream);

//     readstream = gfs.createReadStream({
//         filename: `${fileName}`,
//         content_type: mimetype,
//     });

//     readstream.on('error', function (err) {
//         throw err;
//     });
//     readStream.on("data", function (chunk) {
//         buffer += chunk;
//     });

//     // dump contents to console when complete
//     readStream.on("end", function () {
//         console.log("contents of file:\n\n", buffer);
//     });
// };

connection.once('open', function() {

    gfs = Grid(connection.db);
        
    
        // streaming from gridfs
    // readstreamFunction(gfs, fileName);

    // console.log({readstream});
    // //error handling, e.g. file does not exist
    // readstream.on('error', function (err) {
    //     console.log('An error occurred!', err);
    //     throw err;
    // });

    // readstream.pipe(response);
})

const storage = new GridFsStorage({
    url: configs.mongoDB.baseURL,
    file: (req, file) => {
        // console.log('gridFS', req.body, file);
        const { firstName, lastName, _id, email } = req.body;
        console.log(file);

        User.findOneAndUpdate({ _id },
            { "$push": { "media": { ...file, filename: `${_id}-${file.originalname}` } } },
            { "new": true, "upsert": true },
            function(error, data) {
                if(error) {
                    return error;
                }
                // console.log(data.media[data.media.length-1]);
                // console.log(email);
                let newMedia = new Media({ 
                    ...file, 
                    uploader: { id: _id, email, firstName, lastName }, 
                    // fileURL,
                    filename: `${_id}-${file.originalname}` 
                });

                newMedia.save()
                    .then(savedMedia => {
                        if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
                            return {
                                bucketName: 'images',       //Setting collection name, default name is fs
                                filename: `${_id}-${file.originalname}`     //Setting file name to original name of file
                            }    
                        } else if(file.mimetype === 'video/mp4' || file.mimetype === 'video/mkv' || file.mimetype === 'video/avi') {
                            return {
                                bucketName: 'videos',
                                filename: `${_id}-${file.originalname}`
                            }    
                        } else if(file.mimetype === 'audio/mp3' || file.mimetype === 'audio/wav' || file.mimetype === 'audio/mpeg') {
                            return {
                                bucketName: 'audios',
                                filename: `${_id}-${file.originalname}`
                            }    
                        } else {
                            return {
                                bucketName: 'media',       //Setting collection name, default name is fs
                                filename: `${_id}-${file.originalname}`     //Setting file name to original name of file
                            }
                        }
                        // res.status(200).json({ result: 'successful', user });
                    })
                    .catch(err => {
                        console.log('err', err);
                        return err;
                        // res.status(400).json({ result: 'failed', error: err });
                    });
            }
        )
    }
});

let upload = null;

storage.on('connection', (db) => {
  //Setting up upload for a single file
  upload = multer({
    storage: storage
  }).single('file');
  
});

router.post('/upload/:id', function(req, res) {
    const { id } = req.params;

    User.findById(id, function(error, user) {
        if(error) {
            res.status(400).json({ result: 'failed', error });
        } else {
            // console.log(user);
            if(typeof user !== 'null') {

                upload(req, res, (error, data) => {
                    if(error){
                        res.status(400).json({ result: 'failed', error });
                    } else {
                        res.json({ result: 'successful', user });
                    }
                  });
            } else {
                res.json({ result: 'failed', error: 'User not exists' });
            }
        }
    });
});

router.post('/getAllMedia', function(req, res) {

    Media.find({}, null, function(error, media) {
        if(error){
            res.status(400).json({ result: 'failed', error });
        }
        if(media.length === 0) {
            res.status(400).json({ result: 'failed', error: 'No Media Uploaded' });
        }
        res.json({ result: 'successful', media });
    })
});

router.post('/streamMedia', function(req, res) {

    const { fileName, originalname, id } = req.body;
    // console.log({ fileName, originalname, id });

    Media.findOne({ _id: id }, null, function(error, media) {
        if(error) {
            res.status(400).json({ result: 'failed', error });
        }
        const mimetype = media.mimetype;

        // readstreamFunction(gfs, originalname, mimetype );

        // gfs.createWriteStream({
        //         filename: `${originalname}`,
        //         // content_type: mimetype, // image/jpeg or image/png
        // });
        // var gridfs = app.get('gridfs');
        // gfs.createReadStream({
        //     // _id: req.params.fileId // or provide filename: 'file_name_here'
        //     filename: `${originalname}`
        // }).pipe(res);

        // writestream = gfs.createWriteStream({
        //     filename: `${originalname}`,
        //     content_type: mimetype, // image/jpeg or image/png
        // });
        // console.log(__dirname)
        // var readStream = fs.createReadStream('/media').pipe(writestream);
    
        // readstream = gfs.createReadStream({
        //     filename: `${originalname}`,
        //     content_type: mimetype,
        // });
        // console.log({readStream});
        // readstream.on('error', function (err) {
        //     console.log({ err})
        //     throw err;
        // });
        // readstream.on('open', function () {
        //     readstream.pipe(res);
        // });
        // readStream.on("data", function (chunk) {
        //     buffer += chunk;
        // });
    
        // // // dump contents to console when complete
        // readStream.on("end", function () {
        //     console.log("contents of file:\n\n", buffer);
        // });
    
        // gfs.findOne({ _id: id }, function (err, file) {
        //     console.log(file);
        // });

        // console.log({readstream});
        res.json({ result: 'successful', media });
    })

});

module.exports = router;
