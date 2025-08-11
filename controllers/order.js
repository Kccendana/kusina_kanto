const { ObjectId } = require('mongodb');
const orderModel = require('../models/order');

const getAll = async (req, res) => {
  try {
    const result = await orderModel.getAll();
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
    const result = await orderModel.getById(orderId);

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

const createOrder = async (req, res) => {
  try {
    const { orderItems, orderType } = req.body;

    // Convert string IDs to ObjectId
    const items = orderItems.map(item => ({
      menuItemId: new ObjectId(item.menuItemId),
      quantity: item.quantity,
    }));

    const newOrder = {
      orderItems: items,
      orderStatus: "Preparing",
      orderType,
      createdAt: new Date(),
    };

    const result = await orderModel.createOrder(newOrder);

    res.status(201).json({
      message: 'Order created successfully',
      orderId: result.insertedId,
    });
  } catch (err) {
    console.error('❌ Failed to create order:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateOrder = async (req, res) => {
  const orderId = new ObjectId(req.params.id);
  try {
    const { orderItems, orderType } = req.body;

    // Convert string IDs to ObjectId
    const items = orderItems.map(item => ({
      menuItemId: new ObjectId(item.menuItemId),
      quantity: item.quantity,
    }));

    const newOrder = {
      orderItems: items,
      orderStatus: "Preparing",
      orderType,
      createdAt: new Date(),
    };

    const result = await orderModel.updateOrder(orderId, newOrder);

    res.status(201).json({
      message: 'Order updated successfully',
      orderId: result.orderId,
    });
  } catch (err) {
    console.error('❌ Failed to create order:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  const orderId = new ObjectId(req.params.id);
  const {orderStatus} = req.body;
  const response = await orderModel.updateOrderStatus(orderId, orderStatus);
  if (response.matchedCount > 0){
    res.status(201).json({
      message: 'Order updated successfully',
      orderId: response.orderId,
    });
  }else {
    res.status(500).json(response.error || "Some error occured while updating the order status")
  }
};

const deleteOrder = async (req, res) => {
  try {
      // Validate the ID format
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid order ID format.' });
      }

      const orderId = new ObjectId(req.params.id);
      const response = await orderModel.deleteOrder(orderId);

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

module.exports= {getAll, getSingle, createOrder, updateOrder, deleteOrder, updateOrderStatus};