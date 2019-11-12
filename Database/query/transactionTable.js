const sql = require("../mssqlConnector")
const mssql = require('mssql');

module.exports.transactionVirman = async (customerID, ekNo, ReceiverekNo, Quantity,type) => {

    const pool = await sql.getConnection();
    try {
        let result1 = await pool.request()
            .input('senderID', mssql.NVarChar, customerID)
            .input('senderEkNo', mssql.NVarChar, ekNo)
            .input('recipientID', mssql.NVarChar, customerID)
            .input('recipientEkNo', mssql.NVarChar, ReceiverekNo)
            .input('Quantity', mssql.Money, Quantity)
            .input('transactionType', mssql.NVarChar, type)
            .input('transactionApp', mssql.NVarChar, 'Web')
            .execute('sp_Transaction')
        return { status: 200, message: "success" };
    } catch (error) {
        return { status: 404, message: error.originalError.info.message };
    }
}

module.exports.transactionHavale = async (customerID, ekNo, ReceiverCustomerID, ReceiverekNo, Quantity,type) => {

    const pool = await sql.getConnection();
    try {
        let result1 = await pool.request()
        .input('senderID', mssql.NVarChar, customerID)
        .input('senderEkNo', mssql.NVarChar, ekNo)
        .input('recipientID', mssql.NVarChar, ReceiverCustomerID)
        .input('recipientEkNo', mssql.NVarChar, ReceiverekNo)
        .input('Quantity', mssql.Money, Quantity)
        .input('transactionType', mssql.NVarChar, type)
        .input('transactionApp', mssql.NVarChar, 'Web')
        .execute('sp_Transaction')
        return { status: 200, message: "success" };
    } catch (error) {
        return { status: 404, message: error.originalError.info.message };
    }
}

module.exports.query = async () => {
    const pool = await sql.getConnection();
    let result = await pool.query('select * from HgsTransaction')
    return result;
}

module.exports.BankTransaction = async () => {
    const pool = await sql.getConnection();
    let result = await pool.query('select * from TransactionTable')
    return result;
}