// module.exports = router;
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const validate = require("../middleware/validate")

router.get("/", 
  // #swagger.tags = ['Order']
  // #swagger.description = 'Get all Order'
  orderController.getAll
);

router.get("/:id", 
  // #swagger.tags = ['Order']
  // #swagger.description = 'Get Order by ID'
  orderController.getSingle);

router.post("/", 
  // #swagger.tags = ['Order']
  // #swagger.description = 'Create a new Order'
  validate.validatecreateOrders,
  orderController.createOrder
);

router.put("/:id", 
  // #swagger.tags = ['Order']
  // #swagger.description = 'Update a Order by ID'
  validate.validateUpdateOrders,
  orderController.updateOrder
);

router.put("/:id/status", 
  // #swagger.tags = ['Order']
  // #swagger.description = 'Update a Order status by kitchen'
  orderController.updateOrderStatus
);

router.delete("/:id", 
  // #swagger.tags = ['Order']
  // #swagger.description = 'Delete a Order by ID'
  validate.validateDeleteOrder,
  orderController.deleteOrder
);

module.exports = router;
