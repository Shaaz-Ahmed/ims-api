const mysql = require('mysql2/promise');

const mySqlPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '16Shaaz16',
    database: 'ims'
});

module.exports = mySqlPool;
