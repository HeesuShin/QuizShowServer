const express = require('express');
const User = require('../models').User;

const router = express.Router();

router.post('/', async function(req, res, next) {
  try {
    const result = await User.create({
      email: req.body.email,
      uid: req.body.uid,
    });
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.patch('/pubKey', async function(req, res, next) {
  try {
    const result = await User.update({
      pubKey: req.body.pubKey,
    }, {
      where: {
        email: req.body.email,
      }
    });
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.patch('/deviceToken', async function(req, res, next) {
  try {
    const result = await User.update({
      deviceToken: req.body.deviceToken,
    }, {
      where: {
        email: req.body.email,
      }
    });
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get('/', async function(req, res, next) {
  try {
    const result = await User.findAll();
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
})

router.get('/email/:email', async function(req, res, next) {
  try {
    const result = await User.findOne({
      where: { email: req.params.email }
    });
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
})

module.exports = router;
