const express = require('express');
const router = express.Router();
const Joi = require('joi');

const cartStore = require('../store/shoppingCart');
const cartItemsStore = require('../store/shoppingCartItems');
const storeItemsMapper = require('../mappers/storeItems');
const logger = require('../utilities/logger');
const auth = require('../middleware/auth');

router.post('/storeItems', auth, async (req, res) => {
  try {
    const keyword = req.body.keyword;
    
    console.log(req.body);
    
    const cart = await storeItems.searchStoreItemsByKeyword(keyword);

    res.send(cart);
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});


module.exports = router;
