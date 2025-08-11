// module.exports = router;
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment");
const validate = require("../middleware/validate")

router.get("/", 
  // #swagger.tags = ['Payment']
  // #swagger.description = 'Get all Payment'
  paymentController.getAll
);

router.get("/:id", 
  // #swagger.tags = ['Payment']
  // #swagger.description = 'Get Payment by ID'
  paymentController.getSingle);

router.post("/", 
  // #swagger.tags = ['Payment']
  // #swagger.description = 'Create a new Payment'
  validate.validatecreatePayments,
  paymentController.createPayment
);

router.put("/:id", 
  // #swagger.tags = ['Payment']
  // #swagger.description = 'Update a Payment by ID'
  validate.validateUpdatePayments,
  paymentController.updatePayment
);

router.delete("/:id", 
  // #swagger.tags = ['Payment']
  // #swagger.description = 'Delete a Payment by ID'
  validate.validateDeletePayments,
  paymentController.deletePayment
);

module.exports = router;
