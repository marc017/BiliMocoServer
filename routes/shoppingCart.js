const express = require('express');
const router = express.Router();
const Joi = require('joi');

const cartStore = require('../store/shoppingCart');
const cartItemsStore = require('../store/shoppingCartItems');
const storeItemsMapper = require('../mappers/storeItems');
const logger = require('../utilities/logger');
const auth = require('../middleware/auth');

const getItems = async (carts) => {
  console.log('carts', carts);
  const resultCarts = [];
  for (let i = 0; i < carts.length; i++) {
    const cartItems = await cartItemsStore.getCartItems(carts[i].id);
    console.log('cart items', JSON.stringify(cartItems));
    const resources = cartItems.map(storeItemsMapper);
    console.log('cart items  1', JSON.stringify(resources));
    carts[i].items = resources;
    resultCarts.push(carts[i]);
  }
  return resultCarts;
};

router.get('/', auth, async (req, res) => {
  try {
    const cart = await cartStore.getCart(req.user.userId);

    const cartsWithItems = await getItems(cart);

    res.send(cartsWithItems);
    // res.send(result);
  } catch (error) {
    logger.error('cart -> ' + error);
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    const cartInfo = req.body;
    const userInfo = req.user;
    console.log(req.body);
    // create a shopping cart entry
    const cart = await cartStore.createCart(cartInfo, userInfo);

    res.send(cart);
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const cartInfo = req.body;
    const userInfo = req.user;
    console.log(req.body);
    // create a shopping cart entry
    const cart = await cartStore.updateCart(cartInfo, userInfo);

    res.send(cart);
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

router.delete('/', auth, async (req, res) => {
  try {
    const cartInfo = req.body;
    const userInfo = req.user;
    console.log(req.body);

    const cart = await cartStore.deleteCart(cartInfo, userInfo);

    res.send(cart);
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

module.exports = router;
