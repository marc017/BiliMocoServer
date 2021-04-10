const express = require('express');
const router = express.Router();
const Joi = require('joi');
const usersStore = require('../store/users');
const validateWith = require('../middleware/validation');

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

router.get('/', (req, res) => {
  try {
    res.send(usersStore.getUsers());
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

module.exports = router;
