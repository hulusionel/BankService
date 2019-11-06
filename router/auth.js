const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const customerTransactions = require("../Database/query/customerTransactions");

//Tüm kullanıcıları listeler
router.get('/', async (req, res, next) => {
    const data = await customerTransactions.query()
    res.json(data.recordsets[0]);
});

//kayıt olma sırasında çalışır
router.post('/register', async (req, res, next) => {
    const response = await customerTransactions.insertUser(req.body)
    res.json(response);
});


router.post('/login', async (req, res) => {
    const response = await customerTransactions.login(req.body)
    if (response) {
        const payload = { TC: response.TC };
        const token = jwt.sign(payload, req.app.get('api_key'), { expiresIn: 720 });//12 saat aktif token
        res.json({
            status: true,
            token
        });
        console.log(token);
    }
    else {
        res.json({
            status: false,
            message: 'Authenticated failed, user not found'
        })
    }
});

module.exports = router;