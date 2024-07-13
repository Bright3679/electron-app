const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authroutes = require('./index');
const config = require('../config/dbConfig');
const sql = require('mssql')
const app = express();

sql.connect(config).then(connectionPool => {
    pool = connectionPool;
    if (pool.connected) {
        console.log('Connected to SQL Server');
    }
}).catch(err => {
    console.error('Database connection failed', err);
});

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    const startTime = new Date();
    res.on('finish', () => {
        const endTime = new Date();
        const duration = endTime - startTime;
        console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    });
    next();
});

app.use('/api', authroutes);

app.get('/', (req, res) => {
    res.send("I am alive");
});

module.exports = () => {
    return app
}

