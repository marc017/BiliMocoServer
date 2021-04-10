const express = require('express');
const router = express.Router();
const categoriesStore = require('../store/categories');

router.get('/', async (req, res) => {
  const categories = await categoriesStore.getCategories();
  res.send(categories);
});

module.exports = router;
