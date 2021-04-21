const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Car = require('../models/car');

router.get('/', (req, res, next) => {
    Car.find()
    .exec()
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    const car = new Car({
        _id: new mongoose.Types.ObjectId(),
        brand: req.body.brand,
        model: req.body.model,
        price: req.body.price
    });
    car.save()
    .then(result => {
        res.status(201).json({
            message: 'Handling POST requests to /cars',
            createdCar: car
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;