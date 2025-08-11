const menuModel = require('../models/menu');
const { ObjectId }  = require('mongodb');

const getAll = async (req, res) => {
  try {
    const result = await menuModel.getAll();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Error fetching data:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getSingle = async (req, res) => {
  try {
    const menuId = new ObjectId(req.params.id); 
    const result = await menuModel.getById(menuId);

    res.setHeader('Content-Type', 'application/json');
    if (result) {
      res.status(200).json(result); // Use the actual result
    } else {
      res.status(404).json({ message: 'Menu not found' });
    }
  } catch (err) {
    console.error('❌ Error fetching data:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const createMenu = async (req, res) => {
  const {name, description, imageUrl, price, category, servingSize} = req.body;
  const menuItem = {
      name, 
      description, 
      imageUrl, 
      price, 
      category, 
      servingSize,
      createdAt: new Date()
    };
  const response = await menuModel.createMenu(menuItem);
  if (response.acknowledged){
    res.status(201).json({ message: "User created", id: response.insertedId });
  }else {
    res.status(500).json(response.error || "Some error occured while creating a new contact")
  }
};

const updateMenu = async (req, res) => {
  const menuId = new ObjectId(req.params.id);
  const {name, description, imageUrl, price, category, servingSize} = req.body;
  const menuItem = {
      name, 
      description, 
      imageUrl, 
      price, 
      category, 
      servingSize
    };
  const response = await menuModel.updateMenu(menuId, menuItem);
  if (response.matchedCount > 0){
    res.status(204).send();
  }else {
    res.status(500).json(response.error || "Some error occured while updating the menu")
  }
};

const deleteMenu = async (req, res) => {
  try {
      // Validate the ID format
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid contact ID format.' });
      }

      const menuId = new ObjectId(req.params.id);
      const response = await menuModel.deleteMenu(menuId);

      if (response.deletedCount > 0) {
        res.status(200).json({
          success: true,
          message: 'Menu deleted successfully'
        });
      } else {
        res.status(404).json({ message: 'Menu not found.' });
      }
    } catch (err) {
      console.error('❌ Error deleting contact:', err);
      res.status(500).json({ message: err.message || 'Some error occurred while deleting the menu' });
    }
  }

module.exports= {getAll, getSingle, createMenu, updateMenu, deleteMenu};