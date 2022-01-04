const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv/config');


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders')

// Connect to Database
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let db = mongoose.connection;
db.on('error', console.log.bind(console, 'Error Connection to Database'));
db.once('open', () => {
    console.log('Successfully Connected to Database');
});

// Set middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// Create a Routes to handling request
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})