let mongoose = require('mongoose')
let Schema = mongoose.Schema;

/*
 Creatin schema (model) for a person
 id - OnjectId,
 email - required, String
 name - String,
 age - Number,
 motivations - populate motivations there
*/
let personSchema = new Schema({
    _id: Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        ref: 'Motivation'
    },
    name: String, 
    age: Number,
    motivations: [{ type: Schema.Types.ObjectId, ref: 'Motivation' }]
});

module.exports = mongoose.model('Person', personSchema);
