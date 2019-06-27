const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const router = express.Router();
const PORT = 4000;

let User = require('./user.model');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/users', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})


router.post('/signup', function(req, res) {
    // let user = new user(req.body);
    var newUser = new User(req.body);
    newUser.save()
        .then(user => {
            res.status(200).json({ result: 'successful', user });
        })
        .catch(err => {
            res.status(400).send({ result: 'failed', error: err });
        });
    // User.find(function(err, users) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         res.json(users);
    //     }
    // });
});

router.post('/signin', function(req, res) {
    User.find({ email: req.body.email, password: req.body.password }, function(err, user) {
        if(err) {
            res.status(400).json({ result: 'failed', error: err });
        } else {
            res.json({ result: 'successful', user });
        }
    })
    // User.save()
    //     .then(user => {
    //         res.status(200).json({'user': 'user added successfully'});
    //     })
    //     .catch(err => {
    //         res.status(400).send('adding new user failed');
    //     });
});

router.post('/signout', function(req, res) {
    User.find({ email: req.body.email }, function(err, user) {
        if(err) {
            res.status(400).json({ result: 'failed', error: err });
        } else {
            res.json({ result: 'successful' });
        }
    })
    // User.save()
    //     .then(user => {
    //         res.status(200).json({'user': 'user added successfully'});
    //     })
    //     .catch(err => {
    //         res.status(400).send('adding new user failed');
    //     });
});


router.get("*", function(req, res){
    res.send("Page not available! please visit home page!");
});

app.use('/users', router);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});