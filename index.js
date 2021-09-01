import express from "express";
import fetch from "node-fetch";
import bodyParser from 'body-parser';
import mongodb from 'mongodb';
import assert from 'assert';
import TelegramBot from 'node-telegram-bot-api';
// import logger from 'morgan';
// import Btcroute from './server/router/Btcrouter';

// import mongoose from "mongoose";
const app = express();
const port = 9683;
const token = '1652059945:AAE2g-9j-wPEv3YdP1n1L9YfJ8Ig180uN94';
const bot = new TelegramBot(token, { polling: true });
var currency = 0;
var product;
let db
var MongoClient = mongodb.MongoClient;
// var url = 'mongodb://localhost:27017/Quanlythongtin';
MongoClient.connect("mongodb://localhost:27017", (err, client) => {
    if (err) {
        return console.log(err)
    }
    db = client.db("Quanlythongtin")
    // console.log("Đã kết nối tới Database")
})
// MongoClient.connect('mongodb://127.0.0.1:27017/Quanlythongtin', function(err, db) {
//     if (err) throw err;
//     var Products = db.collection('Products');
//     Products.findOne({}, function (err,res) {
//         //nếu có lỗi
//         if (err) throw err;
//         //nếu thành công
//         console.log(res);
//     });
//     db.close();
// });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use('/api/',  Btcroute)
// app.use(logger('dev'));
//         console.log('Unable to connect to the mongoDB server. Error:', err);
//     } else {
//         console.log('Connection established to', url);
//         var collection = db.collection('Product');
//         var user1 = { name: 'modulus admin', age: 43, roles: ['admin', 'moderator', 'Product'] };
//         var user2 = { name: 'modulus user', age: 30, roles: ['Product'] };
//         var user3 = { name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'Product'] };
//         collection.insert([user1, user2, user3], function (err, result) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log('Inserted %d documents into the "Quanlythongtin" collection. The documents inserted with "_id" are:', result.length, result);
//             }
//         });
//     }
// });
//         collection.update({ name: 'modulus user' }, { $set: { enabled: false } }, function (err, numUpdated) {
//             if (err) {
//                 console.log(err);
//             } else if (numUpdated) {
//                 console.log('Updated Successfully %d document(s).', numUpdated);
//             } else {
//                 console.log('No document found with defined "find" criteria!');
//             }
//             //Close connection
//             db.close();
//         });
// const con= mongoose.connection;
// app.use(express.json());
// try{
//     con.on('open',() => {
//         console.log('connected');
//     })
// }catch(error)
// {
//     console.log("Error: "+error);
// }
app.get("/btc-price", async (req, res,) => {
    const response = await fetch('https://api.coinbase.com/v2/prices/spot?currency=USD');
    const rs = await response.json();
    // console.log(rs);
    // console.log(typeof (rs));
    res.render('app');
    // console.log('DEMO', db);
})

app.get("/btc-currentprice", async (req, res) => {
    // res.send("Hello World I am Kien");

    const response = await fetch('https://api.coinbase.com/v2/prices/spot?currency=USD');
    const rs = await response.json();
    // console.log(rs);
    // console.log(typeof (rs));
    // res.json(rs);
    res.render('indexx');
});
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.get('/get-btc-price', function (req, res) {
    console.log('GET')
    db.collection("Product").find().toArray().then(results => {
        res.json(results)
    }).catch(error => {
        // console.error(error)
    })
});

app.post('/btc-price', (req, res) => {
    //    console.log("Đã nhận request", req.body)
    console.log('POST')
    db.collection("Product").insertOne(req.body).then(results => {
        res.json(results)
    }).catch(error => {
        console.error(error)
    })
})
app.post('/update-data', (req, res) => {
    var item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };

    var id = req.body.id;
    mongodb.connect("mongodb://localhost:27017", function (err, db) {
        assert.equal(null, err);
        db.collection('Quanlythongtin').updateOne({ "_id": objectId(id) }, { $set: item }, function (err, result) {
            assert.equal(null, err);
            console.log('item inserted');
            db.close();
        });
    });
    console.log(req.body)
    // console.log('POST')
    // db.collection("Product").insertOne(req.body).then(results => {

    // res.json(results)
    // }).catch(error => {
    //     console.error(error)
    // })nut́

})
// app.get('/Product/:610c00747e3fa80434a40db6',function(req,res){
//     db.collection("Product",function(err,collection){
//         console.log(req.params.id);
//         collection.findOne({_id: req.params._610c00747e3fa80434a40db6},function(err, doc) {
//             if (doc){
//                 console.log(doc._610c00747e3fa80434a40db6);
//             } else {
//                 console.log('no data');
//             }
//         });
//     });
//     res.render(indexx)
//     });

async function getData() {
    let coinBase = await fetch('https://api.coinbase.com/v2/prices/spot?currency=USD');
    // let products = await fetch('http://localhost:9683/get-btc-price');
    coinBase = await coinBase.json();
    // products = await products.json();
    return { coinBase };
}

async function getApi() {
    var abc = Date.now();
    var currencyOld = await fetch('https://blockchain.info/frombtc?value=100000000&currency=USD&time=' + (abc - 15 * 60 * 1000));
    return currencyOld.text();
}
app.get('/getApi', function (req, res) {
    res.json(currencyOld);
})
var curOldText = await getApi();
var currencyOld = parseFloat(curOldText.replace(",", ""))

const { coinBase } = await getData();
var curText = coinBase.data.amount;
currency = parseFloat(curText.replace(",", ""));
// console.log(currency);
var products = await db.collection("Product").find().toArray();
console.log("PRODUCTS", products)
product = products.find(x => x._id == '612e0384c014505d345ce82a');
var checkNotify = product.checkNotify;
if (product !== undefined) {
    // lấy giá trị check thông báo,
    if (checkNotify == undefined) {     // Nếu ko có trường check thì set giá trị là false => không thông báo.
        checkNotify = true;
    }
    if (checkNotify == "on") {       // Nếu có giá trị là on thì set giá trị là true => thông báo.
        checkNotify == true;
    }
}

if (product !== undefined) { // kiểm tra xem biến product có giá trị chưa, có rồi mới khai báo cái khác
    var deltaHour = product.hour; // Lấy số giờ thông báo.

    var stringDeltaHour = '';
    if (deltaHour >= 60) {                       // Nếu lớn hơn 60 phút thì hiển thị là h, ví dụ 60p là 1h.
        let newHour = deltaHour / 60;
        stringDeltaHour = newHour + 'h';
    } else {
        stringDeltaHour = deltaHour + 'phút';      // Nếu nhỏ hơn 60p thì hiển thị là m, ví dụ 15m.
    }
}
// Hiển thị giờ thông báo
const listTelegram = [1574318924, 445473283, 422888564];
const messageHistory = [];

app.get('/get-mesage-history', function (req, res) {
    res.json(messageHistory);
});
async function intervalFunc() {
    if (checkNotify)            // Check xem có được thông báo hay không? do cái này đang là false nên nó không chạy vào chỗ send này
    {
        var status = product["increase/decrease"] === "increase" ? true : false;    // true là tăng, false là giảm.
        var statusString;           // Chuổi hiển thị
        // Số chênh lệch giữa 2 giá trị cũ, mới.
        var currentMoney = 0;       // Số tiền mới.

        // console.log(currencyOld);
        // var newResult = currency - currencyOld;
        var detal = 0;
        var curOldText = await getApi();
        var currencyOld = parseFloat(curOldText.replace(",", ""))

        const { coinBase } = await getData();
        var curText = coinBase.data.amount;
        currency = parseFloat(curText.replace(",", ""));

        if (currency > currencyOld) {
            detal = currency - currencyOld;
            statusString = "Tăng";
            currentMoney = currency + (currency * product.number / 100);
        } else {
            detal = currencyOld - currency;
            statusString = "Giảm";
            currentMoney = currency - (currency * product.number / 100);
        }
        listTelegram.forEach((teleID) => {
            bot.sendMessage(1574318924,  "BTC giá " + Number(currency).toLocaleString('en-US', { minimumFractionDigits: 2 }) 
            + "$ (" + statusString + " " + Number(detal).toLocaleString('en-US', { minimumFractionDigits: 2 }) + "$ so với " + stringDeltaHour + " trước)");
            messageHistory.push({
                sentTime: Date.now(),
                coinType: product.coinType,
                currentMoney: Number(currency).toLocaleString('en-US', { minimumFractionDigits: 2 }),
                change: statusString,
                price: Number(detal).toLocaleString('en-US', { minimumFractionDigits: 2 }),
                timeago: stringDeltaHour,
                target: teleID
            })
        })
    }
    // console.log(messageHistory)
    console.log(detal);
    //   console.log(currencyOld);
}
setInterval(intervalFunc, 30000);
app.listen(port, () => console.log("Linstening on port" + port));
