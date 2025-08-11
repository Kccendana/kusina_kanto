// module.exports = router;
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const validate = require("../middleware/validate")

router.get("/", 
  // #swagger.tags = ['Users']
  // #swagger.description = 'Get all Users'
  userController.getAll
);

router.get("/:id", 
  // #swagger.tags = ['Users']
  // #swagger.description = 'Get Users by ID'
  userController.getSingle);

router.post("/", 
  // #swagger.tags = ['Users']
  // #swagger.description = 'Create a new Users'
  validate.saveUser,
  userController.createUser
);

router.put("/:id", 
  // #swagger.tags = ['Users']
  // #swagger.description = 'Update a Users by ID'
  validate.saveUser,
  userController.updateUser
);

router.put("/:id/role", 
  // #swagger.tags = ['Users']
  // #swagger.description = 'Update a Users role by admin'
  validate.saveUserRole,
  userController.updateUserRole
);

router.delete("/:id", 
  // #swagger.tags = ['Users']
  // #swagger.description = 'Delete a Users by ID'
  userController.deleteUser
);

module.exports = router;
