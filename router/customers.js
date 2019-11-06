const express = require('express');
const router = express.Router();
const customerTransactions = require("../Database/query/customerTransactions");


router.get('/', async (req, res) => {
    const user = await customerTransactions.query()
    res.json(user.recordsets[0]);
})

//kişisel bilgilerin listelenmesi
router.post('/personal', async (req, res) => {
    const user = await customerTransactions.findByTC(req.decode) //kişiyi buldu
    res.json(user.recordsets[0]);
})

//Güncellenecek kişi bilgileri güncelle
router.post('/updateUser', async (req, res) => {
    const user = await customerTransactions.findByTC(req.decode) //kişiyi buldu
    const quantity = await customerTransactions.updateUser(
        user.CustomerID, req.body.FirstName, req.body.LastName, req.body.Password, req.body.Phone, req.body.Mail)
    res.json(quantity);
})


module.exports = router;