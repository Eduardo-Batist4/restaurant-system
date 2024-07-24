require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_DEVELOPMENT,
        host: process.env.DB_HOST,
        dialect: 'postgres'
    },
    test: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_TEST,
        host: process.env.DB_HOST,
        dialect: 'postgres'
    },
}
