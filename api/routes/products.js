const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');
const Product  = require('../models/product');
const { body, validationResult,check } = require('express-validator');

// Get All Products
router.get('/', async(req, res) => {
    const getProduct = await Product.find()
    .select('name price _id')
    .exec()
    .then((docs) => {
        const response = {
            count: docs.length,
            product: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
})

// Get a Product by ID
router.get('/:id', async(req, res) => {
    const getProductId = await Product.findById({_id: req.params.id}).
    select('name price _id')
    .exec()
    .then((doc) => {
        console.log(doc);
        if(doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: "GET",
                    url: 'http://localhost/products'
                } 
            });
        }else{
            res.status(404).json({
                message: 'No valid entry found'
            })  
        }
    }).catch((err) => {
        
    });


})
// Create a new Product
router.post('/', async(req, res) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price
    });

    const getName = await Product.findOne({name: req.body.name});

    if(getName){
        res.status(500).json({
            message: 'Product has already exsist',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products/'
            }
        })
    }else{
        const saveProduct = await product.save().then((result) => {
            console.log(result);
            res.status(200).json({
                message: 'Product created successfully',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            })
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        }); 
    }

})
// router.post('/', async(req, res) => {

//     const product = new Product({
//         _id: new mongoose.Types.ObjectId,
//         name: req.body.name,
//         price: req.body.price
//         })

//     const errors = validationResult(req);
        
//     if(!errors.isEmpty()){
//         return res.status(404).json({errors: errors.array() })
//     }else{
//         const saveProduct = await product.save().then((result) => {
//             console.log(result);
//             res.status(200).json({
//                 message: 'Product created successfully',
//                 createdProduct: {
//                     name: result.name,
//                     price: result.price,
//                     _id: result._id,
//                     request: {
//                         type: 'GET',
//                         url: 'http://localhost:3000/products/' + result._id
//                     }
//                 }
//             })
//         }).catch((err) => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             })
//         });
//     }
// })

// Delete product
router.delete('/:id', async(req, res) => {
    const deleteProduct = await Product.remove({_id: req.params.id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products/',
                body: {
                    name: "String",
                    price: "Number"
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})

module.exports = router