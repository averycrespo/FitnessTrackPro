const mariadb = require('mariadb');
let connection;

module.exports.getDatabaseConnection = () => {
    if (!connection) {
        connection = mariadb.createPool({
            host: 'database',
            port: process.env.DB_PORT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_ROOT_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            charset: 'utf8mb4',
        });
    }
    return connection;
};

module.exports.query = (query, params = []) => {
    if (!connection) {
        connection = exports.getDatabaseConnection();
    }
    return connection.query(query, params);
};

module.exports.close = () => {
    if (connection) {
        connection.end();
        connection = null;
    }
};