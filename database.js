const mysql = require('mysql');

const db = mysql.createConnection({// Crea conexión a base de datos con los campos necesarios.
    host: "localhost",
    user: "root",
    password: "",
    database: "product"
});

module.exports = db // Exporta el objeto db.