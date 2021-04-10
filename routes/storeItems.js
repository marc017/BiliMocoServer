const express = require('express');
const router = express.Router();
const Joi = require('joi');
const multer = require('multer');

const storeItemsStore = require('../store/storeItems');
const storeItemsMapper = require('../mappers/storeItems');
const auth = require('../middleware/auth');
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

router.get('/:storeId', async (req, res) => {
  try {
    const storeItems = await storeItemsStore.getStoreItemList(
      req.params.storeId
    );

    const resources = storeItems.map(storeItemsMapper);
    console.log('storeItems', JSON.stringify(resources[0].images));
    res.send(resources);
    // res.send(result);
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

router.post(
  '/',
  [auth, upload.array('images', config.get('maxImageCount')), imageResize],
  async (req, res) => {
    try {
      const store = req.body;
      console.log(store);
      store.images = req.images.map((fileName) => ({ fileName: fileName }));
      console.log(store.images);
      let result = await storeItemsStore.addStoreItem(store);
      console.log(result);
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
      console.log(store);
      store.images = req.images.map((fileName) => ({ fileName: fileName }));
      console.log(store.images);
      let result = await storeItemsStore.updateStoreItem(store);
      console.log(result);
      res.status(201).send(result);
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: error.message, statusCode: 500 });
    }
  }
);

// router.post('/', [auth], async (req, res) => {
//   try {
//     console.log('storeItems', req);
//     const item = req.body;

//     let result = await addressStore.addStoreItem(item);

//     res.status(201).send(result);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ status: 'error', message: error.message, statusCode: 500 });
//   }
// });

module.exports = router;
