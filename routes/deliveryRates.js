const express = require('express');
const router = express.Router();
const deliveryRatesStore = require('../store/deliveryRates');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const deliveryRates = await deliveryRatesStore.getDeliveryRates();
    res.send(deliveryRates);
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

module.exports = router;
