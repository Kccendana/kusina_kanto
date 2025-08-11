const { getDatabase } = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

async function getAll() {
    const users = await getDatabase().collection('users').find().toArray();
    return users;
}
async function getById(id) {
    const userId = new ObjectId(id);
    const user = await getDatabase().collection('users').find({ _id: userId }).toArray();
    return user[0];
}
async function createUser(userName, email) {
    const user = {userName: userName , email: email, role: "client"};
    return await getDatabase().collection('users').insertOne(user);
}

async function updateUser(id, userName, email) {
    var userId = new ObjectId(id);
      const user = {
        userName: userName , email: email, role: "client"};
    return await getDatabase().collection('users').replaceOne({ _id: userId }, user);
}

async function updateUserRole(id, role) {
  const userId = new ObjectId(id);
  return await getDatabase().collection('users').updateOne(
    { _id: userId },
    { $set: { role: role } }
  );
}

async function deleteUser(id) {
    const userId = new ObjectId(id);
    return await getDatabase().collection('users').deleteOne({_id: userId })
}

module.exports = {getById, getAll, createUser, updateUser, deleteUser, updateUserRole};
