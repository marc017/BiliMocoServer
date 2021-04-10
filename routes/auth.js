const express = require('express');
const router = express.Router();
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const usersStore = require('../store/users');
const validateWith = require('../middleware/validation');
const passwordCheck = require('../utilities/passwordManager');

const schema = {
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5),
};

router.post('/', validateWith(schema), async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await usersStore.getUserByEmail(email);
    user = user[0];
    // console.log(password, user);
    if (!user.password)
      return res.status(400).send({ error: 'Invalid email or password.' });
    if (!passwordCheck.check(user.password, password))
      return res.status(400).send({ error: 'Invalid email or password.' });

    const token = jwt.sign(
      {
        userId: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        contact_no: user.contact_no,
        email,
        expoPushToken: user.notification_token,
      },
      'jwtPrivateKey'
    );
    res.status(200).send(token);
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
    // res.status(500).send({ error: 'Failed to login' });
  }
});

module.exports = router;
