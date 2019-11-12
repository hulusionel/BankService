const express = require('express');
const router = express.Router();
const transactionTable = require("../Database/query/transactionTable");

router.get('/', async (req, res) => {
    const user = await transactionTable.query()
    res.json(user.recordsets[0]);
})


router.get('/bank', async (req, res) => {
    const user = await transactionTable.BankTransaction()
    res.json(user);
})

module.exports = router;