const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    brand: { type: String, require: true },
    model: { type: String, require: true },
    price: { type: Number, default: 150000 }
});

module.exports = mongoose.model('Car', carSchema);