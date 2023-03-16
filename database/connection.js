// const mysql = require("mysql2");

// const connection = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'test'
// })

// module.exports = connection;

const { Client } = require('pg');
const connectionString = process.env.CONNECT_STRING;
console.log(connectionString);
const client = new Client({
    connectionString
});

client.connect()
module.exports = client