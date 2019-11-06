const sql = require("../mssqlConnector")
const mssql = require('mssql');

module.exports.query = async () => {
    const pool = await sql.getConnection();
    let result = await pool.query('select * from Customers')
    return result;
}

module.exports.insertUser = async (data) => {

    const pool = await sql.getConnection();
    try {
        let result1 = await pool.request()
            .input('TC', mssql.NVarChar, data.TC)
            .input('Password', mssql.NVarChar, data.Password)
            .input('FirstName', mssql.NVarChar, data.FirstName)
            .input('LastName', mssql.NVarChar, data.LastName)
            .input('Phone', mssql.NVarChar, data.Phone)
            .input('Mail', mssql.NVarChar, data.Mail)
            .execute('Insert_User')
        return { status: 200, message: "success" };
    } catch (error) {
        return { status: 404, message: error.originalError.info.message };
    }
}



//data içinde sadece tc var (token'in kime ait olduğunu bulmak için)
module.exports.findByTC = async (data) => {
    const pool = await sql.getConnection();
    let result = await pool.request()
        .query(`SELECT * FROM Customers WHERE TC=${data.TC}`)
    if (result.recordsets[0][0] != null) {
        return result.recordsets[0][0];
    }
    return null;
}

module.exports.findByCustomerID = async (data) => {
    const pool = await sql.getConnection();
    let result = await pool.request()
        .query(`SELECT * FROM Customers WHERE CustomerID=${data}`)
    if (result.recordsets[0][0] != null) {
        return result.recordsets[0][0];
    }
    return null;
}


//data içine tc ve şifre geliyor
module.exports.login = async (data) => {

    const pool = await sql.getConnection();
    let result = await pool.request()
        .query(`SELECT * FROM Customers WHERE TC=${data.TC}`)
    if (result.recordsets[0][0] != null) {      
        if (result.recordsets[0][0].Password == data.Password) {
            return result.recordsets[0][0];
        }
    }
    return null;
}

// Kişi Bilgilerinin Güncelleme
module.exports.updateUser = async (customerID,Password,FirstName,LastName,Phone,Mail) => {

    const pool = await sql.getConnection();
    try {
        let result1 = await pool.request()
            .input('CustomerID', mssql.int, customerID) // sorgu customerId ye göre yapılacak.
            .input('Password', mssql.NVarChar, Password)
            .input('FirstName', mssql.NVarChar, FirstName)
            .input('LastName', mssql.NVarChar, LastName)     // geri kalan bilgiler güncellenecek
            .input('Phone', mssql.NVarChar, Phone)
            .input('Mail', mssql.NVarChar, Mail)
            .execute('') // Buraya Bilgilerin Güncellenme Prosedürü gelecek.
        return { status: 200, message: "success" };
    } catch (error) {
        return { status: 404, message: error.originalError.info.message };
    }
}
