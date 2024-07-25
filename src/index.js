const express = require('express');
const sequelize = require('../config/sequelize');
require('dotenv').config();

const port = process.env.PORT;
const app = express();

sequelize.sync().then(() => {
    app.listen(port);
    console.log('Servidor Rodando.');
}).catch((error) => {
    console.log(error);
});

