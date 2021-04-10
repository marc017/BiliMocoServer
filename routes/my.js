const express = require('express');
const router = express.Router();

// const addressStore = require('../store/address');
const auth = require('../middleware/auth');
const listingMapper = require('../mappers/listings');

router.get('/listings', auth, (req, res) => {
  const listings = listingsStore.filterListings(
    (listing) => listing.userId === req.user.userId
  );
  const resources = listings.map(listingMapper);
  res.send(resources);
});

router.get('/addresses/:userId', auth, async (req, res) => {
  try {
    const addresses = await addressStore.getByUserId(req.params.userId);
    res.status(200).json({
      status: 'success',
      message: 'Address List retrieved',
      data: addresses,
    });
  } catch (error) {
    res.status(200).json({
      status: 'error',
      message: 'Failed to retrieve Address List',
      data: addresses,
    });
  }
});

module.exports = router;
