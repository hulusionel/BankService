const express = require('express');
const router = express.Router();
const accountTransactions = require("../Database/query/accountTransactions");
const customerTransactions = require("../Database/query/customerTransactions");


//tokeni verilen kullanıcının hesapları listelendi
router.get('/', async (req, res) => {
  const user = await customerTransactions.findByTC(req.decode)
  const response = await accountTransactions.accounts(user.CustomerID)
  res.json(response.recordsets);
})

//---------------Hesap açma--------------

//yeni hesap açarken
router.post('/newAccount', async (req, res) => {
  const user = await customerTransactions.findByTC(req.decode) //kişiyi buldu
  const quantity = await accountTransactions.insertAccount(user.CustomerID, req.body.Quantity) //customerID ve eklenecek para gönderildi
  res.json(quantity);
})

//-------------Para Yatırma--------------

//seçilen hesaba para yükleme 3 parametreli
router.post('/selectAccount', async (req, res) => {
  const user = await customerTransactions.findByTC(req.decode) //kişiyi buldu
  const quantity = await accountTransactions.insertMoneySelectAccount(user.CustomerID, req.body.Quantity, req.body.ekNo) //customerID ve eklenecek para gönderildi
  res.json(quantity);
})

//--------------Para Çekme-----------------

//seçilen hesaptan girilen miktar kadar para çekilecek
router.post('/withdraw', async (req, res) => {
  const user = await customerTransactions.findByTC(req.decode)//kişi bulundu
  const accounts = await accountTransactions.accounts(user.CustomerID) //kişinin hesapları geldi
  const account = await accountTransactions.selectAccount(user.CustomerID, req.body.ekNo) //para çekilecek hesap bulundu
  if (account.recordsets[0][0].Quantity >= req.body.Quantity) {
    const quantity = await accountTransactions.withdraw(user.CustomerID, req.body.ekNo, req.body.Quantity)
    res.json(quantity);
  } else {
    res.json({ status: 500, message: "Bakiyeniz yetersiz!!" })
  }
})

//----------Hesap silme----------------

router.post('/deleteAccount', async (req, res) => {
  const user = await customerTransactions.findByTC(req.decode)//kişi bulundu
  const account = await accountTransactions.selectAccount(user.CustomerID,req.body.ekNo)
  console.log(account.recordsets[0][0].Quantity);
  if(account.recordsets[0][0].Quantity<=0){
    const quantity = await accountTransactions.deleteAccount(user.CustomerID, req.body.ekNo)
    res.json(quantity);

  }else{
    res.json({ status: 500, message: "Önce bakiyenizi çekiniz!!" })

  }
})

module.exports = router;