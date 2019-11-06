const sql = require('mssql')
var pool = null;
var config =
{
    user: 'SA', // update me
    password: 'YazilimBakimi.13', // update me
    server: '185.185.232.57', // update me
    database: 'Bank', //update me
    options:
    {
        encrypt: true
    }
};/*
const config =
{
    "user": 'YazilimBakimi', //değiştir
    "password": 'yazilim123', //değiştir
    "server": '10.138.134.183', //localhost
    "database": 'Bank', 
    "port": 1499,    //1433
    "dialect": "mssql",
    "dialectOptions": {
        "instanceName": "DESKTOP-MMT25U3\CEVHERDB" //serverName
    }
};*/

module.exports.getConnection = async () => { //singleton
    try {
        if (pool) {
            return pool
        }
        sql.Int
        pool = await sql.connect(config);
        return pool
    } catch (err) {
        pool = null
    }
}

module.exports.stopConnection = async () => {
    try {
        pool.close()
        pool = null;
    } catch (err) {
        console.log(err)
        pool = null;
    }
}


sql.on('error', err => {
    // ... error handler
    console.log(err)
})
