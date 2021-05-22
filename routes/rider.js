const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateWith = require('../middleware/validation');
const riderStore = require('../store/rider');
const usersStore = require('../store/users');
const listingsStore = require('../store/listings');
const auth = require('../middleware/auth');
const logger = require('../utilities/logger');



const schema = {
  userName: Joi.string().required().min(2),
  firstName: Joi.string().required().min(2),
  lastName: Joi.string().required().min(2),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5),
  contactNo: Joi.string().required().min(10),
};

router.post('/', validateWith(schema), async (req, res) => {
  try {
    console.log(req.body);
    const {
      userName,
      firstName,
      lastName,
      email,
      contactNo,
      password,
    } = req.body;
    const temp = await usersStore.getUserByEmail(email);
    if (temp.length > 0)
      return res
        .status(400)
        .send({ error: 'A user with the given email already exists.' });

    const user = { userName, firstName, lastName, email, contactNo, password };
    let result = await usersStore.createUser(user);

    res.status(201).send(user);
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const riderId = parseInt(req.params.id);
    const user = await riderStore.getRiderById(riderId);
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
    const user = riderStore.getRiderById(userId);
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
