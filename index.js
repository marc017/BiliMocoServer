const express = require('express');
const address = require('./routes/address');
const categories = require('./routes/categories');
const listings = require('./routes/listings');
const deliveryRates = require('./routes/deliveryRates');
const listing = require('./routes/listing');
const users = require('./routes/users');
const rider = require('./routes/rider');
const user = require('./routes/user');
const auth = require('./routes/auth');
const my = require('./routes/my');
const messages = require('./routes/messages');
const search = require('./routes/search');
const stores = require('./routes/stores');
const storeCategory = require('./routes/storeCategory');
const storeItems = require('./routes/storeItems');
const shoppingCart = require('./routes/shoppingCart');
const shoppingCartItems = require('./routes/shoppingCartItems');
const expoPushTokens = require('./routes/expoPushTokens');
const orders = require('./routes/orders');
const helmet = require('helmet');
const compression = require('compression');
const config = require('config');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(helmet());
app.use(compression());

app.use('/api/address', address);
app.use('/api/categories', categories);
app.use('/api/listing', listing);
app.use('/api/listings', listings);
app.use('/api/user', user);
app.use('/api/users', users);
app.use('/api/rider', rider);
app.use('/api/auth', auth);
app.use('/api/my', my);
app.use('/api/expoPushTokens', expoPushTokens);
app.use('/api/messages', messages);
app.use('/api/search', search);
app.use('/api/storeCategory', storeCategory);
app.use('/api/stores', stores);
app.use('/api/storeItems', storeItems);
app.use('/api/shoppingCart', shoppingCart);
app.use('/api/shoppingCartItems', shoppingCartItems);
app.use('/api/orders', orders);
app.use('/api/deliveryRates', deliveryRates);

app.get('/', (req, res) => {
  res.send('Welcome to api');
});

const port = process.env.PORT || config.get('port');
app.listen(port, function () {
  console.log(`Server started on port ${port}...`);
});
