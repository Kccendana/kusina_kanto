const { getDatabase } = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

async function getAll() {
    const payment = await getDatabase().collection('payments').find().toArray();
    return payment;
}
async function getById(id) {
    const paymentId = new ObjectId(id);
    const payment = await getDatabase().collection('payments').find({ _id: paymentId }).toArray();
    return payment[0];
}

async function createPayment(payment) {
    return await getDatabase().collection('payments').insertOne(payment);
}

async function updatePayment(id, updateObject) {
    const paymentId = new ObjectId(id);
    return await getDatabase()
        .collection('payments')
        .updateOne({ _id: paymentId }, updateObject);
}

async function deletePayment(id) {
    const paymentId = new ObjectId(id);
    return await getDatabase().collection('payments').deleteOne({_id: paymentId })
}

module.exports = {getById, getAll, createPayment, updatePayment, deletePayment};
