const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cors = require('cors');

const Motivation = require('../models/motivation.model');
const Person = require('../models/person.model');

router.use(cors());

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

module.exports = router;