var express    = require("express"),
    multer  = require('multer'),
    // upload = multer({ dest: 'uploads/' }),
    router     = express.Router(),
    User       = require("../models/user"),
    Media      = require("../models/media"),
    GridFsStorage = require('multer-gridfs-storage'),
    configs    = require('../configs');

var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// // mongoose.connect('mongodb://127.0.0.1/test');
// var conn = mongoose.connection;
    
// var fs = require('fs');
    
// var Grid = require('gridfs-stream');
// Grid.mongo = mongoose.mongo;
// var gfs = Grid(conn.db);

const storage = new GridFsStorage({
    url: configs.mongoDB.baseURL,
    file: (req, file) => {
        // console.log('gridFS', req.body, file);
        const { firstName, lastName, _id, email } = req.body;
        // console.log(req.file);
        console.log('1')

        User.findOneAndUpdate({ _id },
            { "$push": { "media": { ...file, filename: `${_id}-${file.originalname}` } } },
            { "new": true, "upsert": true },
            function(error, data) {
                if(error) {
                    return error;
                }
                console.log('2')
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


})

module.exports = router;
