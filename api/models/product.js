const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: {
        type: String,
        default: function (){
            return new ObjectId.toString()
        }
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);