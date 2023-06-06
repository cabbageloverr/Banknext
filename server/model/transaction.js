const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    acc_num: {type : String, default: null, require:true},
    money: {type : Number, default: null, require:true},
    current: { type: Number, default: null, require:true },
    transferor: { type: String , default: null, require:true },
    receiver : { type: String , default: null, require:true },
    date: { type: String },
    type: { type: String }

})

module.exports = mongoose.model('transaction', transactionSchema);