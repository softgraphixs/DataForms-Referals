const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

// Schema's in the model directory
const Referals = require('../modules/formSchema');


router.get('/', (req, res, next) => {
    Referals.find()
        .select('name phone age lga _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                data: docs.map(doc => {
                    return {
                    name: doc.name,
                    phone: doc.phone,
                    age: doc.age,
                    lga: doc.lga,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:2020/referals' + doc._id
                    }
                    }
                })
            }
            
            res.status(200).json(response);

            })
            .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        error: err
                    })
                })
        })

    router.post('/', (req, res, next) => {
        const referal = new Referals({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            phone: req.body.phone,
            age: req.body.age,
            lga: req.body.lga
        });
        referal.save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Added Successfully',
                    creatEvent: {
                        ...result,
                        request: {
                            type: "Post",
                            url: 'http://localhost:2020/referals' + result._id
                        }
                    }
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            })
        res.status(200).json({
            message: 'Successful',
            data: referal
        });
    });


    router.get('/:id', (req, res, next) => {

        const id = req.params.id;
        Referals.findById(id)
            .select('name phone age lga _id')
            .exec()
            .then(doc => {
                console.log(doc);
                if (doc) {
                    res.status(200).json({
                        event: doc,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:2020/referals'
                        }
                    })
                }
                else {
                    res.status(404).json({
                        message: 'Not Valid entry Found'
                    })
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    });

    router.patch('/:eventId', (req, res, next) => {
        const id = req.params.eventId;
        const updateOps = {};
        for (const ops of req.body) {
            updateOps[ops.propName] = ops.value;
        }
        Referals.update({ _id: id }, { $set: updateOps })
            .exec()
            .then(result => {

                res.status(200).json({
                    message: 'referals updated',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:2020/referals' + id
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            })
    });

    router.delete('/:id', (req, res, next) => {
        const id = req.params.id;
        Referals.remove({ _id: id })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Deleted Successfully',
                    request: {
                        type: 'POST'
                    }
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            })
    });

    module.exports = router;