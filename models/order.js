const { getDatabase } = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

async function getAll() {
    const order = await getDatabase().collection('orders').find().toArray();
    return order;
}
async function getById(id) {
    const orderId = new ObjectId(id);
    const order = await getDatabase().collection('orders').find({ _id: orderId }).toArray();
    return order[0];
}

async function createOrder(order) {
    return await getDatabase().collection('orders').insertOne(order);
}

async function updateOrder(id, order) {
    var orderId = new ObjectId(id);
    return await getDatabase().collection('orders').replaceOne({ _id: orderId }, order);
}

async function updateOrderStatus(id,orderStatus) {
  const orderId = new ObjectId(id);
  return await getDatabase().collection('orders').updateOne(
    { _id: orderId },
    { $set: { orderStatus: orderStatus } }
  );
}

async function deleteOrder(id) {
    const orderId = new ObjectId(id);
    return await getDatabase().collection('orders').deleteOne({_id: orderId })
}

module.exports = {getById, getAll, createOrder, updateOrder, deleteOrder, updateOrderStatus};
