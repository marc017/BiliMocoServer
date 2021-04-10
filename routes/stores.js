const express = require('express');
const router = express.Router();
const Joi = require('joi');
const multer = require('multer');

const storesStore = require('../store/stores');
const auth = require('../middleware/auth');
const validateWith = require('../middleware/validation');
const storesMapper = require('../mappers/stores');
const logger = require('../utilities/logger');
const imageResize = require('../middleware/imageResize');
const config = require('config');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'stores/');
  },

  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  dest: 'uploads/',
  // limits: { fieldSize: 25 * 1024 * 1024 },
});

const schema = {
  label: Joi.string().required(),
  userId: Joi.required(),
  address: Joi.string().required(),
  province: Joi.string().required(),
  city: Joi.string().required(),
  brgy: Joi.string().required(),
  latitude: Joi.string().required(),
  longitude: Joi.string().required(),
};

router.post(
  '/',
  [auth, upload.array('images', config.get('maxImageCount')), imageResize],
  async (req, res) => {
    try {
      const store = req.body;
      // console.log(req);
      store.images = req.images.map((fileName) => ({ fileName: fileName }));
      console.log(store.images);
      let result = await storesStore.addStore(store, req.user.userId);

      res.status(201).send(result);
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: error.message, statusCode: 500 });
    }
  }
);

router.put(
  '/',
  [auth, upload.array('images', config.get('maxImageCount')), imageResize],
  async (req, res) => {
    try {
      const store = req.body;
      // console.log(req);
      store.images = req.images.map((fileName) => ({ fileName: fileName }));
      console.log(store.images);
      let result = await storesStore.updateStore(store, req.user.userId);

      res.status(201).send(result);
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: error.message, statusCode: 500 });
    }
  }
);

router.get('/search/:keyword?', async (req, res) => {
  try {
    const keyword = req.params.keyword ? req.params.keyword : '';
    const stores = await storesStore.getStoreList(keyword);
    const resources = stores.map(storesMapper);
    res.send(resources);
    // res.send(result);
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

router.get('/user', auth, async (req, res) => {
  try {
    const stores = await storesStore.getUserStore(req.user.userId);

    const resources = stores.map(storesMapper);
    console.log(JSON.stringify(resources));
    res.send(resources[0]);
    // res.send(result);
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

module.exports = router;
