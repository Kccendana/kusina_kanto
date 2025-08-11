const validator = require('../helpers/validate');
const Validator = require('validatorjs');
const saveUser = (req, res, next) => {
  const validationRule = {
    userName: ['required', 'string', 'regex:/^\\S+$/'],
    email: 'required|email'
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      return res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    }
    next();
  });
};


const saveUserRole = (req, res, next) => {
  const validationRule = {
    role: 'required|string|in:client,kitchen,cashier,admin'
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      return res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    }
    next();
  });
};

const validateMenuItem = (req, res, next) => {
  const validationRule = {
    name: 'required|string',
    description: 'required|string',
    imageUrl: ['required', 'regex:/^\\/images\\/.+\\.(jpg|jpeg|png|gif)$/i'],
    price: 'required|numeric',
    category: 'required|string',
    servingSize: 'required|string'
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};
const validatecreateOrders = (req, res, next) => {
  const validationRule = {
    orderItems: 'required|array',
    'orderItems.*.menuItemId': 'required|string',
    'orderItems.*.quantity': 'required|integer|min:1',
    orderStatus: 'required|string|in:Preparing,Completed,Cancelled',
    orderType: 'required|string|in:Take-out,Dine-in,Delivery'

  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

function validateUpdateOrders(req, res, next) {
    const rules = {
       orderItems: 'required|array',
    'orderItems.*.menuItemId': 'required|string',
    'orderItems.*.quantity': 'required|integer|min:1',
      orderStatus: 'required|string|in:Preparing,Completed,Cancelled',
      orderType: 'required|string|in:Take-out,Dine-in,Delivery'
    };

    // Only include keys that exist in request body (so all are optional)
    const data = {};
    Object.keys(rules).forEach(key => {
        if (req.body[key] !== undefined) {
            data[key] = req.body[key];
        }
    });

    const validation = new Validator(data, rules);

    if (validation.fails()) {
        return res.status(422).json(validation.errors.all());
    }

    next();
};

function validateDeleteOrder(req, res, next) {
    const data = {
        id: req.params.id || req.body.id
    };

    const rules = {
        id: 'required|string|size:24' // size:24 for MongoDB ObjectId
    };

    const validation = new Validator(data, rules);

    if (validation.fails()) {
        return res.status(422).json(validation.errors.all());
    }

    next();
};


const validatecreatePayments = (req, res, next) => {
  const validationRule = {
  subtotal: 'required|integer',
  tax: 'required|integer',
  total: 'required|integer',
  isPaid: 'required|boolean',
  paymentMethod: 'required|string|in:Credit Card,Debit Card,Cash,Online'


  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

function validateUpdatePayments(req, res, next) {
    const rules = {
    subtotal: 'required|integer',
    tax: 'required|integer',
    total: 'required|integer',
    isPaid: 'required|boolean',
    paymentMethod: 'required|string|in:Credit Card,Debit Card,Cash,Online'

    };

    // Only include keys that exist in request body (so all are optional)
    const data = {};
    Object.keys(rules).forEach(key => {
        if (req.body[key] !== undefined) {
            data[key] = req.body[key];
        }
    });

    const validation = new Validator(data, rules);

    if (validation.fails()) {
        return res.status(422).json(validation.errors.all());
    }

    next();
};

function validateDeletePayments(req, res, next) {
    const data = {
        id: req.params.id || req.body.id
    };

    const rules = {
        id: 'required|string|size:24' // size:24 for MongoDB ObjectId
    };

    const validation = new Validator(data, rules);

    if (validation.fails()) {
        return res.status(422).json(validation.errors.all());
    }

    next();
};





module.exports = {
  saveUser, saveUserRole, validateMenuItem, validatecreateOrders, validateUpdateOrders, validateDeleteOrder, validatecreatePayments, validateUpdatePayments, 
  validateDeletePayments, 
};