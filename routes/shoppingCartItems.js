const express = require('express');
const router = express.Router();
const Joi = require('joi');

const cartStore = require('../store/shoppingCart');
const cartItemsStore = require('../store/shoppingCartItems');
const storeItemsMapper = require('../mappers/storeItems');
const logger = require('../utilities/logger');
const auth = require('../middleware/auth');

const getItems = async (carts) => {
  const resultCarts = [];
  for (let i = 0; i < carts.length; i++) {
    const cartItems = await cartItemsStore.getCartItems(carts[i].id);
    const resources = cartItems.map(storeItemsMapper);
    carts[i].items = resources;
    resultCarts.push(carts[i]);
  }
  return resultCarts;
};

router.get('/', auth, async (req, res) => {
  try {
    const cart = await cartStore.getCart(req.user.userId);

    const cartsWithItems = await getItems(cart);

    console.log('cart', cartsWithItems);
    res.send(cartsWithItems);
    // res.send(result);
  } catch (error) {
    logger.error('carts ->  ' + error);
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const cartItem = req.body;
    const userInfo = req.user;
    const updatedCartItem = await cartItemsStore.updateCartItem(cartItem);

    console.log('updatedCartItem', updatedCartItem);
    res.send(updatedCartItem);
    // res.send(result);
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

const getCart = async (storeItem, userInfo) => {
  console.log('storeItem', storeItem);
  let cart = await cartStore.getCartByStoreId(
    userInfo.userId,
    storeItem.store_id
  );
  if (cart) return cart;
  if (!cart) {
    const cartInfo = {
      store_id: storeItem.store_id,
      total_price: storeItem.total_price,
    };
    // cart is not yet created, create a new one
    cart = await cartStore.createCart(cartInfo, userInfo);
    return cart;
  }
};

router.put('/', auth, async (req, res) => {
  try {
    const storeItem = req.body;
    const userInfo = req.user;

    // check if a cart is already created under the same vendor for the user
    let cart = await getCart(storeItem, userInfo);
    if (!cart) {
      const cartInfo = {
        store_id: storeItem.store_id,
        total_price: storeItem.total_price,
      };
      // cart is not yet created, create a new one
      cart = await cartStore.createCart(cartInfo, userInfo);
    }
    console.log(cart);
    // check if the item is already in cart
    let cartItem = await cartItemsStore.getItemById(storeItem.store_item_id);
    if (cartItem) {
      // there is already an existing cart item, just update it
      const newQty = cartItem.quantity + storeItem.quantity;
      const newTotalPrice = newQty * cartItem.price;
      const updatedCartItem = {
        id: cartItem.id,
        store_item_id: cartItem.store_item_id,
        quantity: newQty,
        total_price: newTotalPrice,
      };
      cartItem = await cartItemsStore.updateCartItem(updatedCartItem);
    } else {
      cartItem = await cartItemsStore.addToCart(cart, storeItem);
    }

    // add items to this cart

    res.send(cartItem);
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

router.delete('/:cartId/:cartItemId', auth, async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const cartItemId = req.params.cartItemId;
    const user = req.user;

    console.log('delete cart item id', cartItemId);

    const cart = await cartItemsStore.deleteCartItem(cartItemId);

    // check cart items, delete if no items
    const cartConent = await cartItemsStore.getCartItems([cartId]);
    console.log(cartConent);
    if (cartConent.length <= 0 || cartConent === undefined) {
      // no more items, delete cart details.
      await cartStore.deleteCart(
        { id: cartId },
        user
      );
    }

    res.send(cart);
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

module.exports = router;
