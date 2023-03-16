const { Client } = require('pg');
const connectionString = process.env.CONNECT_STRING;
const client = new Client({
    connectionString
});

client.connect()
module.exports = client