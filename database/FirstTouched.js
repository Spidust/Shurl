module.exports = (connection) => {
    connection.query(`CREATE TABLE url (
        urlID text UNIQUE,
        url text,
        id SERIAL PRIMARY KEY
        )`)
}