var express = require('express')
var path = require('path')


var port = 8000

var app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

var mongodb = require('mongodb')

var MongoClient = require('mongodb').MongoClient


MongoClient.connect("mongodb+srv://dentist:nopassword@dentistdb-rvaq8.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function(err, db) {
    if (err) throw err
    var dbo = db.db("DentistDB")
        // view all records
    app.get('/view-info', function(req, res) {

        dbo.collection('patients').find({}).toArray().then(function(feedbacks) {
            res.status(200).json(feedbacks)
        })

    })

    /*PATIENTS*/
    //add patient
    app.post('/post-info', function(req, res) {

            let patient = {
                name: req.body.name,
                phone: req.body.phone,
                age: req.body.age,
                rating: req.body.rating,
                dr: req.body.dr,
                note: req.body.note,
                totP: 0
            }

            delete req.body._id // for safety reasons
            dbo.collection('patients').insertOne(patient)
            res.status(200).json(req.body)
        })
        //edit patients values
    app.post('/post-edit', (req, res) => {
            console.log(req.body)
            let patient = {
                name: req.body.name,
                phone: req.body.phone,
                age: req.body.age,
                rating: req.body.rating,
                dr: req.body.dr,
                note: req.body.note,
            }
            dbo.collection('patients').findOneAndUpdate({ "_id": new mongodb.ObjectID(req.body.ids) }, { "$set": patient }).then(
                () => {

                    console.log("1 document updated")

                }
            ).catch(
                (error) => {
                    res.status(400).json({
                        error: error
                    })
                }
            )
        })
        //view a patient
    app.get('/view-profile', function(req, res) {

            let query = { _id: new mongodb.ObjectID(req.body.id) }
            dbo.collection('patients').find(query).toArray((err, result) => {
                console.log(result)
            })

        })
        //delete record
    app.delete('/', function(req, res) {

        let query = { _id: new mongodb.ObjectID(req.body.id) }
        dbo.collection('patients').findOneAndDelete(query, (err, result) => {
            if (err) {
                console.log(err)
                return res.status(400).end("some error")
            }
            if (!result)
                return res.status(404).end(query._id + "not found")
            console.log('deleted')
            res.json(result)
        })

    })


    /*TEETH*/
    //add teeth
    app.post('/post-tooth', function(req, res) {

            let tooth = {
                _id: mongodb.ObjectID(),
                number: req.body.num,
                status: req.body.status,
                cost: parseInt(req.body.cost),
                tot: 0
            }

            console.log(req.body.id)
            dbo.collection('patients').findOneAndUpdate({ "_id": new mongodb.ObjectID(req.body.id) }, { "$addToSet": { "teeth": tooth } })
            res.status(200).json(req.body)

        })
        //delete teeth
    app.post('/deleteTeeth', function(req, res) {


        let query = {
            "teeth._id": new mongodb.ObjectID(req.body.id)
        }
        dbo.collection('patients').updateOne(query, {
            "$pull": {
                "teeth": {
                    "_id": new mongodb.ObjectID(req.body.id)
                }
            },
            "$inc": {
                "totP": -parseInt(req.body.val)
            }
        }, (result, error) => {
            if (error)
                console.error(error)
            console.log(result)
            res.status(200).json(req.body)
        })


    })
    app.post('/teeth-edit', (req, res) => {

            let tooth = {
                number: req.body.number,
                status: req.body.status,
                cost: parseInt(req.body.cost),
            }
            dbo.collection('patients').findOneAndUpdate({
                    "teeth._id": new mongodb.ObjectID(req.body.ids)
                },

                {
                    "$set": {
                        "teeth.$.number": req.body.number,
                        "teeth.$.status": req.body.status,
                        "teeth.$.cost": parseInt(req.body.cost),
                    }
                }, { upsert: true },
                (err, result) => {
                    if (err)
                        console.error(err)
                    console.log(result)
                    res.status(200).json(req.body)

                }
            )
        })
        /*PAYMENTS*/
        //add payment
    app.post('/post-payment', function(req, res) {


        let id = mongodb.ObjectID()
        let today = new Date()
        let time = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
        let payment = {
            _id: id,
            tid: req.body.tid,
            value: parseInt(req.body.value),
            date: time
        }
        dbo.collection('patients').findOneAndUpdate({
            "teeth._id": new mongodb.ObjectID(req.body.tid),

        }, {
            "$inc": {
                "teeth.$.tot": parseInt(req.body.value),
                "totP": parseInt(req.body.value)
            },
            "$push": {
                "teeth.$.payments": payment
            }

        }, (err, result) => {
            if (err)
                console.log(err)
            console.log(result)
            res.status(200).json(req.body)

        })

    })

    app.post('/deletePayment', function(req, res) {


        let query = {
            "teeth.payments._id": new mongodb.ObjectID(req.body.id),
        }
        dbo.collection('patients').findOneAndUpdate(query, {
            "$inc": {
                "teeth.$.tot": -parseInt(req.body.val),
                "totP": -parseInt(req.body.val)
            },
            "$pull": {
                "teeth.$.payments": {
                    "_id": new mongodb.ObjectID(req.body.id)
                }
            },

        }, (result, error) => {
            if (error)
                console.error(error)
            console.log(result)
            res.status(200).json(req.body)
        })


    })



    //add a case
    app.post('/post-stat', function(req, res) {

            delete req.body._id // for safety reasons
            dbo.collection('Cases').insertOne(req.body)
            res.status(200).json(req.body)
        })
        //view cases
    app.get('/view-stat', function(req, res) {

            dbo.collection('Cases').find({}).toArray().then(function(feedbacks) {
                res.status(200).json(feedbacks)
            })

        })
        //delete a case
    app.delete('/s', function(req, res) {

        let query = { _id: new mongodb.ObjectID(req.body.id) }
        dbo.collection('Cases').findOneAndDelete(query, (err, result) => {
            if (err) {
                console.log(err)
                return res.status(400).end("some error")
            }
            if (!result)
                return res.status(404).end(query._id + "not found")
            console.log('deleted')
            res.json(result)
        })

    })
    app.post('/post-dr', function(req, res) {

            delete req.body._id // for safety reasons
            dbo.collection('Doctors').insertOne(req.body).catch((err) => console.log(err))
            res.status(200).json(req.body)
        })
        //view cases
    app.get('/view-dr', function(req, res) {

            dbo.collection('Doctors').find({}).toArray().then(function(feedbacks) {
                res.status(200).json(feedbacks)
            })

        })
        //delete a case
    app.delete('/d', function(req, res) {

        let query = { _id: new mongodb.ObjectID(req.body.id) }
        dbo.collection('Doctors').findOneAndDelete(query, (err, result) => {
            if (err) {
                console.log(err)
                return res.status(400).end("some error")
            }
            if (!result)
                return res.status(404).end(query._id + "not found")
            console.log('deleted')
            res.json(result)
        })

    })

})

app.listen((process.env.PORT || port), () => console.log(` App listening on port ${port}!`))

module.exports = app