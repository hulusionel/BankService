const express = require('express');
const router = express.Router();
const app = express()
const http = require('http');
const customerTransactions = require("../Database/query/customerTransactions");
const accountTransactions = require("../Database/query/accountTransactions");
const transactionTable = require("../Database/query/transactionTable");

let post_req = null,
    post_data = '';
let data = '';

//--------------- Yeni Hgs Hesabı Açma -------------------

router.post('/insert', async (req, res) => {
    const user = await customerTransactions.findByTC(req.decode) //kişiyi buldu
    const account = await accountTransactions.selectAccount(user.CustomerID, req.body.ekNo) //hesabı bulundu
    if (account.recordsets[0][0].Quantity < req.body.Quantity) {
        res.json({ status: 500, message: "Hesabınızda bu kadar bakiye bulunmamaktadır!!! " })
    } else {
        if (account.recordsets[0][0].Quantity < 20) {
            res.json({ status: 500, message: "Bakiyeniz Yetersiz!!! " })
        } else {
            if (req.body.Quantity < 20) {
                res.json({ status: 500, message: "Kart Ücreti 20 Lira!!! " })
            }
            else {
                post_data = `{"CustomerID":"${user.CustomerID}","Quantity":${req.body.Quantity}}`
                var optionspost = {
                    hostname: 'hgsservice.herokuapp.com',
                    path: '/insert',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache',
                        'Content-Length': post_data.length
                    }
                };

                optionspost.agent = new http.Agent(optionspost);
                post_req = await http.request(optionspost, (resp) => {
                    resp.on('data', (chunk) => {
                        data += chunk;
                    })
                    resp.on('end', () => {
                        res.send(data)
                    });
                });
                post_req.write(post_data);
                data = '';
                post_req.end();

                const currentQuantity = account.recordsets[0][0].Quantity - req.body.Quantity
                console.log(account.recordsets[0][0].Quantity)
                const HgsPayload = req.body.Quantity - 20;
                const updateAccount = await accountTransactions.updateAccount(user.CustomerID, req.body.ekNo, currentQuantity)
                const transaction = await transactionTable.transactionVirman(user.CustomerID, req.body.ekNo, req.body.ekNo, HgsPayload, 'Hgs_Insert')
            }
        }
    }
})

//------------Hgs Hesabına Para Yükleme------------------

router.post('/load', async (req, res) => {
    const user = await customerTransactions.findByTC(req.decode) //kişiyi buldu
    const account = await accountTransactions.selectAccount(user.CustomerID, req.body.ekNo) //hesabı bulundu

    post_data = `{"CustomerID":"${user.CustomerID}","HgsEkNo":${req.body.HgsEkNo},"Quantity":${req.body.Quantity}}`
    var optionspost = {
        hostname: 'hgsservice.herokuapp.com',
        path: '/payment/load',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Content-Length': post_data.length
        }
    };

    optionspost.agent = new http.Agent(optionspost);
    post_req = await http.request(optionspost, (resp) => {
        resp.on('data', (chunk) => {
            data += chunk;
        })
        resp.on('end', () => {
            res.send(data)
        });
    });
    post_req.write(post_data);
    data = '';
    post_req.end();
    const currentQuantity = account.recordsets[0][0].Quantity - req.body.Quantity
    console.log(account.recordsets[0][0].Quantity)
    const updateAccount = await accountTransactions.updateAccount(user.CustomerID, req.body.ekNo, currentQuantity)
    const transaction = await transactionTable.transactionVirman(user.CustomerID, req.body.ekNo, req.body.ekNo, currentQuantity, 'Hgs_Load')
})

//------------ Hgs Hesabından Para Çekme ------------------

router.post('/withdraw', async (req, res) => {
    const user = await customerTransactions.findByTC(req.decode) //kişiyi buldu
    post_data = `{"CustomerID":"${user.CustomerID}","HgsEkNo":${req.body.HgsEkNo}}`
    var optionspost = {
        hostname: 'hgsservice.herokuapp.com',
        path: '/payment/withdraw',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Content-Length': post_data.length
        }
    };

    optionspost.agent = new http.Agent(optionspost);
    post_req = await http.request(optionspost, (resp) => {
        resp.on('data', (chunk) => {
            data += chunk;
        })
        resp.on('end', () => {
            res.send(data)
        });
    });
    post_req.write(post_data);
    data = '';
    post_req.end();
})

router.post('/query', async (req, res) => {
    console.log(req.body)
    const user = await customerTransactions.findByTC(req.decode) //kişiyi buldu
    post_data = `{"CustomerID":${user.CustomerID},"HgsEkNo":${req.body.HgsEkNo}}`
    var optionspost = {
        hostname: 'hgsservice.herokuapp.com',
        path: '/payment/query',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Content-Length': post_data.length
        }
    };

    optionspost.agent = new http.Agent(optionspost);
    post_req = await http.request(optionspost, (resp) => {
        resp.on('data', (chunk) => {
            data += chunk;
        })
        resp.on('end', () => {
            res.send(data)
        });
    });
    post_req.write(post_data);
    data = '';
    post_req.end();
})

//tüm hesaplar listelenecek
router.get('/queryAll', async (req, res) => {
    console.log(req.body)
    const user = await customerTransactions.findByTC(req.decode) //kişiyi buldu
    post_data = `{"CustomerID":${user.CustomerID}}`
    var optionspost = {
        hostname: 'hgsservice.herokuapp.com',
        path: '/payment/queryAll',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Content-Length': post_data.length
        }
    };

    optionspost.agent = new http.Agent(optionspost);
    post_req = await http.request(optionspost, (resp) => {
        resp.on('data', (chunk) => {
            data += chunk;
        })
        resp.on('end', () => {
            res.send(data)
        });
    });
    post_req.write(post_data);
    data = '';
    post_req.end();
})

//kişinin tüm hgs transactionu döndürülecek
router.get('/HgsTransaction', async (req, res) => {
    console.log(req.body)
    const user = await customerTransactions.findByTC(req.decode) //kişiyi buldu
    post_data = `{"CustomerID":${user.CustomerID}}`
    var optionspost = {
        hostname: 'hgsservice.herokuapp.com',
        path: '/transaction',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Content-Length': post_data.length
        }
    };

    optionspost.agent = new http.Agent(optionspost);
    post_req = await http.request(optionspost, (resp) => {
        resp.on('data', (chunk) => {
            data += chunk;
        })
        resp.on('end', () => {
            res.send(data)
        });
    });
    post_req.write(post_data);
    data = '';
    post_req.end();
})

module.exports = router;
