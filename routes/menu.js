// module.exports = router;
const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menu");
const validate = require("../middleware/validate")

router.get("/", 
  // #swagger.tags = ['Menu']
  // #swagger.description = 'Get all Menu'
  menuController.getAll
);

router.get("/:id", 
  // #swagger.tags = ['Menu']
  // #swagger.description = 'Get Menu by ID'
  menuController.getSingle);

router.post("/", 
  // #swagger.tags = ['Menu']
  // #swagger.description = 'Create a new Menu'
  validate.validateMenuItem,
  menuController.createMenu
);

router.put("/:id", 
  // #swagger.tags = ['Menu']
  // #swagger.description = 'Update a Menu by ID'
  validate.validateMenuItem,
  menuController.updateMenu
);

router.delete("/:id", 
  // #swagger.tags = ['Menu']
  // #swagger.description = 'Delete a Menu by ID'
  menuController.deleteMenu
);

module.exports = router;
