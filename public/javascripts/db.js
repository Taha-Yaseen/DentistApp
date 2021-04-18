var $ = require('jQuery')
var mongo = require('mongodb')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var express = require('express');
var app = express;
const port = 3000;

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");


    var person = {

        name: "taha",
        num: 81641660,
        age: 20,
        rating: 4,
        teeth: [{
            tooth: 1,
            status: 'normal',
            date: date,
            cost: 0,
            paymentVal: 0,
            debt: 0
        }],
        att: "url",
        notes: ""
    }



});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))