const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const Person = require('../models/person.model');

// GET all persons
router.get('/', (req, res, next) => {
    Person.find().exec().then( docs => {
        console.log(docs);
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

    res.status(201).json({
        message: 'POST OSOBA',
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

module.exports = router;