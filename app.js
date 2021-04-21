const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

const carRoutes = require('./api/routes/cars');

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/cars', carRoutes);

mongoose.connect('mongodb://localhost/carstens-cars', { useNewUrlParser: true });

app.use((req, res, next) => {
    res.status(200).json({
        message: "Welcome to Carsten's Cars"
    });
});

module.exports = app;