const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
const cors = require('cors');

const Person = require('../models/person.model');

router.use(cors());

// GET all persons
router.get('/', (req, res, next) => {
    Person.find().exec().then( docs => {
        console.log(docs);
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).json(docs);
    }).catch(err => {
        console.log(doerrcs);
        res.status(500).json({error: err});
    });
});

/* POST new person
 save it!
*/
router.post('/', (req, res, next) => {
    const person = new Person({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        name: req.body.name,
        age: req.body.age
    });

    person.save().then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    })

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.status(201).json({
        message: 'Person created',
        createdPerson: person
    });
});

// GET person with ID
router.get('/:personId', (req, res, next) => {
    const id = req.params.personId;

    Person.findById(id).exec().then(doc => {
        console.log("from db" + doc);
        res.status(200).json(doc);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err });
    });
});

    var auth = {
    type: 'oauth2',
    user: 'rista90@gmail.com',
    clientId: '1000098009180-ran3i109ahdjcc8qbhq3idrpvm703p63.apps.googleusercontent.com',
    clientSecret: 'dGUWKp1iO6KxB5umRjul23Rb',
    refreshToken: '1/21WNoCFgbJX164N03keeYVzjjIQxL5fg2N3WaNwdVDE',
    grantType: 'authorization_code'
  };
  

  router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  router.post('/send', function(req, res){
    response = {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    }
    
    var mailOptions = {
        from: req.body.name,
        to: req.body.email,
        subject: req.body.name,
        text: req.body.message,
        html: 'Your ID is: ' + req.body.message,
    };
  var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: auth,
    });
  transporter.sendMail(mailOptions, (err, res) => {
        if (err) {
            return console.log(err);
        } else {
            console.log(JSON.stringify(res));
        }
    });
  })

module.exports = router;