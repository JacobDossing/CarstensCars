const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.status(200).json({
        message: "Welcome to Carsten's Cars"
    });
});

module.exports = app;