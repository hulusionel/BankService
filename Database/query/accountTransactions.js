const sql = require("../mssqlConnector")
const mssql = require('mssql');

//Kişinin Hesapları
module.exports.accounts = async (customerID) => {
    const pool = await sql.getConnection();
    let result = await pool.query(`select * from Accounts WHERE CustomerID=${customerID} AND Status=1`)
    return result;
}

module.exports.updateAccount = async (customerID, ekNo,Quantity) => {
    const pool = await sql.getConnection();
    let result = await pool.query(`Update Accounts SET Quantity=${Quantity} WHERE customerID=${customerID} AND ekNo=${ekNo}`)
    return result;
}

module.exports.selectAccount = async (customerID, ekNo) => {
    const pool = await sql.getConnection();
    let result = await pool.query(`select * from Accounts WHERE customerID=${customerID} AND ekNo=${ekNo}`)
    return result;
}


//Yeni hesap açılırken
module.exports.insertAccount = async (customerID, Quantity) => {

    const pool = await sql.getConnection();
    try {
        let result1 = await pool.request()
            .input('CustomerID', mssql.NVarChar, customerID)
            .input('Quantity', mssql.Money, Quantity)
            .execute('SP_two_parameter')
        return { status: 200, message: "success" };
    } catch (error) {
        return { status: 404, message: error.originalError.info.message };
    }
}

//yeni kayıt yapılınca düşücek
module.exports.insertAccountNewUser = async (customerID) => {

    const pool = await sql.getConnection();
    try {
        let result1 = await pool.request()
            .input('CustomerID', mssql.NVarChar, customerID)
            .input('Quantity', mssql.Money, 0)
            .execute('SP_one_parameter')
        return { status: 200, message: "success" };
    } catch (error) {
        return { status: 404, message: error.originalError.info.message };
    }
}

//Seçilen hesaba para yatırma
module.exports.insertMoneySelectAccount = async (customerID, Quantity, ekNo) => {
    const pool = await sql.getConnection();
    try {
        let result1 = await pool.request()
            .input('CustomerID', mssql.NVarChar, customerID)
            .input('Quantity', mssql.Money, Quantity)
            .input('ekNo', mssql.Money, ekNo)//cevhere ekNo sor
            .execute('SP_three_parameter')
        return { status: 200, message: "success" };
    } catch (error) {
        return { status: 404, message: error.originalError.info.message };
    }
}

//Mevcut hesaplardan herhangi birine tıklanınca gelecek ve miktar eksilecek
module.exports.withdraw = async (customerID, ekNo, Quantity) => {
    const pool = await sql.getConnection();
    try {
        let result1 = await pool.request()
            .input('CustomerID', mssql.NVarChar, customerID)
            .input('ekNo', mssql.Money, ekNo)
            .input('Quantity', mssql.Money, Quantity)
            .execute('sp_withdraw')
        return { status: 200, message: "success" };
    } catch (error) {
        return { status: 500, message: error.originalError.info.message };
    }
}


//Seçilen Hesabın Aktiflik Durumu Düzenlenecek
module.exports.deleteAccount = async (customerID, ekNo) => {
    const pool = await sql.getConnection();
    try {
        let result1 = await pool.request()
            .input('CustomerID', mssql.NVarChar, customerID)
            .input('ekNo', mssql.Money, ekNo)
            .execute('sp_deleteAccount') // buraya müşterinin seçilen hesabının pasif yapılma prosedürü yazılmalı
        return { status: 200, message: "success" };
    } catch (error) {
        return { status: 500, message: error.originalError.info.message };
    }
}

