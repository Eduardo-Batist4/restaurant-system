const { Sequelize } = require('sequelize');
const config = require('./config');

const environment = process.env.NODE_ENV || 'development';
const dbConfig = {...config[environment], dialect: 'postgres'};

const sequelize = new Sequelize(dbConfig);

module.exports = sequelize;