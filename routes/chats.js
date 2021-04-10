const express = require('express');
const router = express.Router();
const Joi = require('joi');

const addressStore = require('../store/address');
const auth = require('../middleware/auth');
const address = require('../store/address');

router.put('/', [auth, validateWith(schema)], async (req, res) => {
  try {
    console.log(req.body);
    const item = req.body;

    let result = await addressStore.addAddress(item);

    res.status(201).send(result);
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

router.post('/', [auth], async (req, res) => {
  try {
    console.log(req.body);
    const item = req.body;

    let result = await addressStore.updateAddress(item);

    res.status(201).send(result);
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

router.delete('/:addressId', [auth], async (req, res) => {
  try {
    console.log(req.body);
    const item = req.body;

    let result = await addressStore.deleteAddress(req.params.addressId);

    res.status(201).send(result);
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    console.log(req.user);
    let result = await addressStore.getAddressList(req.user.userId);
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    let result = await addressStore.getDefaultAddress(req.user.userId);
    console.log('userAddress', result);
    res.send(result[0]);
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

router.put('/default', auth, async (req, res) => {
  try {
    const addressId = req.body.addressId;

    // clear all default addresses first
    await addressStore.clearDefaultAddress(req.user.userId);
    let result = await addressStore.setDefaultAddress(addressId);
    console.log('setDefault', result);
    res.send(result[0]);
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

router.get('/store/:storeId', auth, async (req, res) => {
  try {
    let result = await addressStore.getStoreAddress(req.params.storeId);

    res.send(result[0]);
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

module.exports = router;
