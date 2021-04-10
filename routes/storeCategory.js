const express = require('express');
const router = express.Router();
const storeCategoriesStore = require('../store/storeCategory');

router.get('/', async (req, res) => {
  const categories = await storeCategoriesStore.getStoreCategories();
  res.send(categories);
});

module.exports = router;
