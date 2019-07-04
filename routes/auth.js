var express    = require("express"),
    router     = express.Router(),
    User       = require("../models/user");




router.post('/signup', function(req, res) {
    // let user = new user(req.body);
    var newUser = new User({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });
    newUser.save()
        .then(user => {
            res.status(200).json({ result: 'successful', user });
        })
        .catch(err => {
            res.status(400).json({ result: 'failed', error: err });
        });
});

router.post('/login', function(req, res) {
    User.find({ email: req.body.email, password: req.body.password }, function(err, user) {
        if(err) {
            res.status(400).json({ result: 'failed', error: err });
        } else {
            if(typeof user[0] !== 'undefined') {
                res.json({ result: 'successful', user: user[0] });
            } else {
                res.json({ result: 'failed', error: 'User not exists' });
            }
        }
    });
});

router.post('/logout', function(req, res) {
    User.find({ email: req.body.email }, function(err, user) {
        if(err) {
            res.status(400).json({ result: 'failed', error: err });
        } else {
            if(typeof user[0] !== 'undefined') {
                res.json({ result: 'successful', user: user[0] });
            } else {
                res.json({ result: 'failed', error: 'User not exists' });
            }
        }
    })
});

module.exports = router;
