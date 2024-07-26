const express = require('express');
const sequelize = require('../config/sequelize');
const router = require('../routes/routes');
require('dotenv').config();

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(router);

sequelize.sync().then(() => {
    app.listen(port);
    console.log('Servidor Rodando.');
}).catch((error) => {
    console.log(error);
});

