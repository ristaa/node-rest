let mongoose = require('mongoose')
let Schema = mongoose.Schema;

let motivationSchema = Schema({
    _id: Schema.Types.ObjectId,
    person: { type: Schema.Types.ObjectId, ref: 'Person' },
    content: String,
    fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
  });

var Motivation = mongoose.model('Motivation', motivationSchema);

module.exports = Motivation