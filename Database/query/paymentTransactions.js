const sql = require("../mssqlConnector")
const mssql = require('mssql');

module.exports.virman = async (customerID, ekNo, ReceiverekNo, Quantity) => {

    const pool = await sql.getConnection();
    try {
        let result1 = await pool.request()
            .input('CustomerID', mssql.NVarChar, customerID)
            .input('ekNo', mssql.NVarChar, ekNo)
            .input('receiverekNo', mssql.NVarChar, ReceiverekNo)
            .input('quantity', mssql.Money, Quantity)
            .execute('sp_Virman')
        return { status: 200, message: "success" };
    } catch (error) {
        return { status: 404, message: error.originalError.info.message };
    }
}


module.exports.havale = async (customerID, ekNo, ReceiverCustomerID, ReceiverekNo, Quantity) => {

    const pool = await sql.getConnection();
    try {
        let result1 = await pool.request()
            .input('customerID', mssql.NVarChar, customerID)
            .input('ekNo', mssql.NVarChar, ekNo)
            .input('receiverCustomerID', mssql.NVarChar, ReceiverCustomerID)
            .input('receiverekNo', mssql.NVarChar, ReceiverekNo)
            .input('quantity', mssql.Money, Quantity)
            .execute('sp_Havale')
        return { status: 200, message: "success" };
    } catch (error) {
        return { status: 404, message: error.originalError.info.message };
    }
}