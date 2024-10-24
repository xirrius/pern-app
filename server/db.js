const Pool = require('pg').Pool

const pool = new Pool({
    user: "postgres",
    password: "iwantaninternship",
    port: 5432,
    database: 'jwttable'
})

module.exports = pool