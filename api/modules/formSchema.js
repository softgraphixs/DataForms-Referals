const mongoose = require('mongoose')

const formSchema = mongoose.Schema({

    _id : mongoose.Schema.Types.ObjectId,
    name: { type: String, required : true },
    phone :   { type: Number, required : true, unique : true }, 
    age:     { type: Number, required : true },
    lga:     { type: String, required : true },
});

module.exports = mongoose.model('Referals', formSchema)
