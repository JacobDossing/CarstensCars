const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    brand: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, default: 150000 },
    carImage: { type: String, required: true }
});

module.exports = mongoose.model('Car', carSchema);