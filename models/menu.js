const { getDatabase } = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

async function getAll() {
    const menu = await getDatabase().collection('menu').find().toArray();
    return menu;
}
async function getById(id) {
    const menuId = new ObjectId(id);
    const menu = await getDatabase().collection('menu').find({ _id: menuId }).toArray();
    return menu[0];
}
async function createMenu(menu) {
    return await getDatabase().collection('menu').insertOne(menu);
}

async function updateMenu(id, menu) {
    var menuId = new ObjectId(id);
    return await getDatabase().collection('menu').updateOne({ _id: menuId }, {$set: menu});
}

async function deleteMenu(id) {
    const menuId = new ObjectId(id);
    return await getDatabase().collection('menu').deleteOne({_id: menuId })
}

async function getManyByIds(ids) {
  const objectIds = ids.map(id => new ObjectId(id));
  const menu = await getDatabase().collection('menu').find({ _id: { $in: objectIds } }).toArray();
  return menu;
}

module.exports = {getById, getAll, createMenu, updateMenu, deleteMenu, getManyByIds};
