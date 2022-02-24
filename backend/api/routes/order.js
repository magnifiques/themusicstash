const express = require('express');
const router = express.Router();

const mongoose = require('mongoose')
const Order = require('../models/orders')
const Book = require('../models/book')


router.get('/', (req, res) => {
    Order.find({}, (error, result) => {
        if(error) {
            res.status(500).json({
                error: error.message
            })
        }
        else{
            res.status(200).json({
                message: "This is GET way to access Orders!",
                content: result
            })
        }
    })
});

router.post('/', (req, res) => {

    const { quantity, productid } = req.body

    try {
        Product.findById(productid, (error, result) => {
            if(error) {
                res.status(400).json({
                    message: error.message
                })
            }
            else{
                if(result === null) {
                    return res.status(404).json({
                        message: 'Product not found'
                    })
                }
                const order = new Order({
                    _id: new mongoose.Types.ObjectId(),
                    productid: productid,
                    quantity: quantity
                })

                order.save();

                res.status(201).json({
                    message: 'order has been added!',
                    order: order
                })
            }
        })
    }

    catch(error) {
        res.status(400).json({
            message: error.message
        })
    }
    
    
});

router.get('/:orderid', (req, res) => {
    orderid = req.params.orderid;

        Order.findById(orderid, (error, result) => {
            if(error) {
                res.status(500).json({
                    error: error.message
                })
            }
            else{
                if(result) {
                    res.status(200).json({
                        result: result
                    })
                }
                else{
                    res.status(404).json({
                        message: 'Not A Valid orderId'
                    })
                }
            
            }
        });
});

router.delete('/:orderid', (req, res) => {
    const orderid = req.params.orderid
    
    Order.deleteOne({_id: orderid}, (error, result) => {

        if(error) {
            res.status(500).json({
                error: error.message
            })
        }
        else{
            res.status(200).json({
                message: "Order has been Deleted",
            });
        }
    })    
});

module.exports = router;