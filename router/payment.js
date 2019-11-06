const express = require('express');
const router = express.Router();
const customerTransactions = require("../Database/query/customerTransactions");
const accountTransactions = require("../Database/query/accountTransactions");
const paymentTransactions = require("../Database/query/paymentTransactions");
const transactionTable = require("../Database/query/transactionTable");

//------------- virman ---------------

//kişisel başka hesabına para gönderme listelenmesi
router.post('/virman', async (req, res) => {
    //req içinde kendi ekNo ,diğer hesabın ekNo gelecek
    const user = await customerTransactions.findByTC(req.decode) //kişiyi buldu
    const account = await accountTransactions.selectAccount(user.CustomerID, req.body.ekNo)
    const receiverAccount = await accountTransactions.selectAccount(user.CustomerID, req.body.Receiver_ekNo)   
    if (receiverAccount.recordsets[0][0] != null) {
        if (account.recordsets[0][0].Quantity >= req.body.Quantity) {
            const virman = await paymentTransactions.virman(user.CustomerID, req.body.ekNo, req.body.Receiver_ekNo, req.body.Quantity)
            const transaction = await transactionTable.transactionVirman(user.CustomerID, req.body.ekNo, req.body.Receiver_ekNo, req.body.Quantity)
            const account = await accountTransactions.selectAccount(user.CustomerID, req.body.ekNo)
            res.json(account.recordsets[0][0]);
        } else {
            res.json({ status: 500, message: "Bakiyeniz yetersiz!!" })
        }
    } else {
        res.json({ status: 500, message: "Para gönderilecek hesap bulunamadı!!" })
    }

})

//------------- havale ----------------

//başka hesaplar arası para gönderme
router.post('/havale', async (req, res) => {
    const user = await customerTransactions.findByTC(req.decode) //kişiyi buldu
    const account = await accountTransactions.selectAccount(user.CustomerID, req.body.ekNo)//kişinin hesabu bulundu
    if(user.CustomerID!=req.body.Receiver_CustomerID){
        const ReceiveruserCustomerID = await customerTransactions.findByCustomerID(req.body.Receiver_CustomerID) //gönderilecek kişi bilgisi
        if (req.body.Receiver_CustomerID != null && ReceiveruserCustomerID != null && req.body.Receiver_ekNo != null) {
            const Receiveraccount = await accountTransactions.selectAccount(ReceiveruserCustomerID.CustomerID, req.body.Receiver_ekNo)//kişinin hesabu bulundu
            if (Receiveraccount.recordsets[0][0] != null) {
                if (account.recordsets[0][0].Quantity >= req.body.Quantity) {
                     const havale = await paymentTransactions.havale(user.CustomerID, req.body.ekNo, req.body.Receiver_CustomerID, req.body.Receiver_ekNo, req.body.Quantity)
                     const transaction = await transactionTable.transactionHavale(user.CustomerID, req.body.ekNo, req.body.Receiver_CustomerID, req.body.Receiver_ekNo, req.body.Quantity)
                     const account = await accountTransactions.selectAccount(user.CustomerID, req.body.ekNo)
                    res.json({CustomerID:user.CustomerID});
                } else {
                    res.json({ status: 500, message: "Bakiyeniz yetersiz!!" })
                }
            } else {
                res.json({ status: 500, message: "Para gönderilecek hesap bulunamadı!!" })
            }
        } else {
            res.json({ status: 500, message: "Para gönderilecek kullanıcı bulunamadı!!" })
        }
    }else{
        res.json({ status: 500, message: "Kendinize havale yapmayınız!!" })
    }
   
})


module.exports = router;