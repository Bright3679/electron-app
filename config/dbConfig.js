const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

module.exports = config;

// function connectToDatabase() {
//     try {
//         const pool = sql.connect(config);
//         console.log('Connected to SQL Server');
//         return pool;
//     } catch (err) {
//         console.error('Server connection failed', err);
//         throw err;
//     }
// }

// module.exports = connectToDatabase;