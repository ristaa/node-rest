const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const Motivation = require('../models/motivation.model');
const Person = require('../models/person.model');

/* ****************************************
* GET all motivations ---------------------
* Populate it with person who posted it ---
* -----------------------------------------
* Motivation - model (schema) of Motivation
******************************************/
router.get('/', (req, res, next) => {
    Motivation.find().select('person content _id')
    .populate('person')
    .exec().then( docs => {
        console.log(docs);
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).json({
            count: docs.length,
            motivations: docs.map(doc => {
                return {
                    _id: doc._id,
                    person: doc.person,
                    content: doc.content,
                    request: {
                        type: 'GET',
                        url: 'https://serene-ravine-31000.herokuapp.com/motivation/' + doc._id
                    }
                }
            }),
           
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

/*****************************************
* POST new motivation according to personId
* ------------------------------------------
* Person - model (schema) of Person
* personId - key in Person model
*****************************************/
router.post('/', (req, res, next) => {

    Person.findById(req.body.personId)
    .then(person => {
        if(!person){
            return res.status(404).json({
                message: 'Person doesnt exist'
            });
        }

        const motivation = new Motivation({
            _id: new mongoose.Types.ObjectId(),
            person: req.body.personId,
            content: req.body.content
        });
    
        return motivation.save()
    }).then(result => { 
        console.log(result);
        res.status(201).json({
            message: 'Motivation stored',
            createdMotivation: {
                _id: result._id,
                person: result.person,
                content: result.content
            },
            request: {
                type: 'GET',
                url: 'https://serene-ravine-31000.herokuapp.com/motivation/' + result._id 
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

// GET motivation by Id
router.get('/:motivationId', (req, res, next) => {
    Motivation.findById(req.params.motivationId).populate('person').exec().then(motivation =>{
        res.status(200).json({
            motivation: motivation,
            request: {
                type: 'GET',
                url: 'https://serene-ravine-31000.herokuapp.com/motivation/'
            }
        });
    }).catch(err => {
        res.status(500).json({
          error: err  
        });
    });
});

var auth = {
    type: 'oauth2',
    user: 'YOUR_GMAIL_ADDRESS',
    clientId: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    refreshToken: 'YOUR_REFRESH_TOKEN',
};

router.post('/send', function(req, res){
    response = {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    }
    
    
    var mailOptions = {
        from: req.body.name,
        to: 'rista90@gmail.com',
        subject: 'My site contact from: ' + req.body.name,
        text: req.body.message,
        html: 'Message from: ' + req.body.name + '<br></br> Email: ' +  req.body.email + '<br></br> Message: ' + req.body.message,
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