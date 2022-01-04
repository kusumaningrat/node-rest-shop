const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/orders");
const Product = require("../models/product");

// Get All Orders List
router.get("/", async (req, res) => {
  const getOrder = await Order.find()
    .select("_id product quantity")
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
// Create a New Order Base On Product ID
router.post("/", async (req, res) => {
  // Find Product By Id
  const getProduct = await Product.findById({_id: req.body.productId});
  if (!getProduct) {
    return res.status(500).json({
      message: "Product not found",
    });
  } else {
    const order = new Order({
      _id: new mongoose.Types.ObjectId(),
      product: req.body.productId,
      quantity: req.body.quantity,
    });
    return order
      .save()
      .then((result) => {
        console.log(result);
        res.status(201).json({
          message: "Order Stored",
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity,
          },
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/" + result._id,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: err,
        });
      });
  }
});

router.put("/:id", async (req, res) => {
  const updateOrders = await Order.findById({ _id: req.params.id })
    .exec()
    .then((docs) => {
      console.log(result);
      res.status(200).json({
        message: "Your order updated",
        updatedOrder: {
          _id: docs._id,
          product: docs.product,
          quantity: docs.quantity,
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + docs._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// Update orders

module.exports = router;
