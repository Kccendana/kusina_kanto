const express = require("express");
const router = new express.Router();
const userRoutes = require('./users')

// router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/", (req, res) => {
  // #swagger.tags = ['Hello World']
  res.send("Hello World")
});

router.use('/contacts', userRoutes);
router.use('/api-docs', require('./swagger'));



module.exports = router;