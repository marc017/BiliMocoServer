const express = require('express');
const router = express.Router();

const usersStore = require('../store/users');
const listingsStore = require('../store/listings');
``;
const auth = require('../middleware/auth');
const logger = require('../utilities/logger');

router.get('/:id', auth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await usersStore.getUserById(userId);
    if (!user) return res.status(404).send();

    // const listings = listingsStore.filterListings(
    //   (listing) => listing.userId === userId
    // );
    console.log(user);
    res.send({ data: user[0] });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: 'Failed to retrieve User' });
  }
});

router.post('/update', auth, (req, res) => {
  try {
    const userId = parseInt(req.body.userId);
    const user = usersStore.getUserById(userId);
    if (!user) return res.status(404).send();

    const listings = listingsStore.filterListings(
      (listing) => listing.userId === userId
    );

    res.send({
      id: user.id,
      name: user.name,
      email: user.email,
      listings: listings.length,
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve User' });
  }
});

module.exports = router;
