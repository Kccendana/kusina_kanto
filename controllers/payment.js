const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const paymentModel = require('../models/payment');
const menuModel = require('../models/menu');
const orderModel = require('../models/order');

const getAll = async (req, res) => {
  try {
    const result = await paymentModel.getAll();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Error fetching data:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getSingle = async (req, res) => {
  try {
    const orderId = new ObjectId(req.params.id); 
    const result = await paymentModel.getById(orderId);

    res.setHeader('Content-Type', 'application/json');
    if (result) {
      res.status(200).json(result); // Use the actual result
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    console.error('❌ Error fetching data:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const createPayment = async (req, res) => {
  try {
    const orderId = new ObjectId(req.body.orderId);
    const paymentMethod = req.body.paymentMethod;

    // Fetch the order
    const order = await orderModel.getById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Extract menu item IDs from the order
    const menuIds = order.orderItems.map(item => new ObjectId(item.menuItemId));

    // Fetch corresponding menu items
    const menuItems = await menuModel.getManyByIds(menuIds);

    // Calculate subtotal
    let subtotal = 0;

    for (const item of order.orderItems) {
      const matchingMenu = menuItems.find(menu =>
        menu._id.toString() === item.menuItemId.toString()
      );

      if (matchingMenu && matchingMenu.price && item.quantity) {
        subtotal += matchingMenu.price * item.quantity;
      }
    }

    // Calculate tax and total
    const taxRate = 0.1;
    const tax = parseFloat((subtotal * taxRate).toFixed(2));
    const total = parseFloat((subtotal + tax).toFixed(2));

    // Create payment object
    const payment = {
      orderId,
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax,
      total,
      isPaid: false,
      paymentMethod,
      createdAt: new Date()
    };

    // Insert payment record
    const result = await paymentModel.createPayment(payment);

    res.status(201).json({
      message: 'Payment created for order',
      paymentId: result.insertedId,
      payment
    });

  } catch (err) {
    console.error('❌ Error creating payment:', err);
    res.status(500).json({ message: 'Server error creating payment' });
  }
};

const updatePayment = async (req, res) => {
  try {
    const paymentId = new ObjectId(req.params.id);
    const { isPaid, paymentMethod } = req.body;

    const payment = {
        isPaid, paymentMethod
    };

    const response = await paymentModel.updatePayment(paymentId, { $set: payment });

    if (response.matchedCount > 0) {
      res.status(200).json({ message: "Payment updated successfully" });
    } else {
      res.status(404).json({ message: "Payment not found" });
    }
  } catch (err) {
    console.error("❌ Error updating payment:", err);
    res.status(500).json({ message: "Server error while updating payment" });
  }
};

const deletePayment = async (req, res) => {
  try {
      // Validate the ID format
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid order ID format.' });
      }

      const paymentId = new ObjectId(req.params.id);
      const response = await paymentModel.deletePayment(paymentId);

      if (response.deletedCount > 0) {
        res.status(200).json({
          success: true,
          message: 'Order deleted successfully'
        });
      } else {
        res.status(404).json({ message: 'Order not found.' });
      }
    } catch (err) {
      console.error('❌ Error deleting contact:', err);
      res.status(500).json({ message: err.message || 'Some error occurred while deleting the contact' });
    }
  }

module.exports= {getAll, getSingle, createPayment, updatePayment, deletePayment};