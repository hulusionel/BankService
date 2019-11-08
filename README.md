# BankService


# Index

| Route        | HTTP       | POST body     |    Description     |
| :---         |     ---    |     :---      |        :---        |
|/register    | `POST`      | { username: 'foo', password:'1234' }|Create a new user.|
|/login    | `POST`      | { username: 'foo', password:'1234' }|Generate a token.
|


# Account

| Route          | HTTP       | POST body     |    Description     |
| :---           |     ---    |     :---      |        :---        |
|/api/account    | `GET`      | Empty         |List own accounts. |
|/api/account/newAccount      | `POST`      | { "Quantity" : 5}         |	Create a new account. |
|/api/account/selectAccount   | `POST`      | { "Quantity" : 5, "ekNo":1001}         |Upload money to the selected account. |
|/api/account/withdraw        | `POST`      | { "Quantity" : 5, "ekNo":1001}         |Withdrawal from selected account. |
|/api/account/deleteAccount   | `POST`      | {"ekNo":1001}          |The status of the selected account is updated. |


# Payment

| Route          | HTTP       | POST body     |    Description     |
| :---           |     ---    |     :---      |        :---        |
|/api/payment/virman   | `POST`      | { "Quantity" : 5, "ekNo":1001, "Receiver_ekNo":1001}  |Sends money between accounts. |
|/api/payment/havale   | `POST`      | { "Quantity" : 5, "ekNo":1001, "Receiver_CustomerID":100006 ,"Receiver_ekNo":1001}       |Send money to other users' account. |

