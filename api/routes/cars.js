const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg')
        cb(null, true);
    else
        cb(null, false);
}

const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 5
    }
});

const Car = require('../models/car');

router.get('/', (req, res, next) => {
    Car.find()
        .select('brand model price carImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                cars: docs
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', upload.single('carImage'),(req, res, next) => {
    console.log(req.file);
    const car = new Car({
        _id: new mongoose.Types.ObjectId(),
        brand: req.body.brand,
        model: req.body.model,
        price: req.body.price,
        carImage: req.file.path
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

router.get('/:carId', (req, res, next) => {
    const id = req.params.carId;
    Car.findById(id)
        .select('brand model price carImage')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    car: doc
                });
            } else {
                res.status(404).json({
                    message: "Ingen biler med det angivne ID",
                    request: {
                        hint: "Få evt. en oversigt over alle biler med følgende link:",
                        type: "GET",
                        url: "http://localhost:1337/cars"
                    }
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

router.patch('/:carId', (req, res, next) => {
    const id = req.params.carId;
    //Update operationer (de attributter, der skal opdateres)
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Car.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: 'Opdatering successfuld'
                })
            } else {
                res.status(404).json({
                    message: "Der blev ikke foretaget nogen opdatering",
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

router.delete('/:carId', (req, res, next) => {
    const id = req.params.carId;
    Car.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                Car.remove({ _id: id })
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            message: 'Bil slettet',
                            car: doc
                        })
                    })
            } else {
                res.status(404).json({
                    message: 'Ingen bil med id ' + id
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

module.exports = router;