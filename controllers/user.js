const userModel = require('../models/user');
const { ObjectId }  = require('mongodb');

const getAll = async (req, res) => {
  try {
    const result = await userModel.getAll();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Error fetching data:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getSingle = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id); 
    const result = await userModel.getById(userId);

    res.setHeader('Content-Type', 'application/json');
    if (result) {
      res.status(200).json(result); // Use the actual result
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('❌ Error fetching data:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const createUser = async (req, res) => {
  const {userName, email} = req.body;
  const response = await userModel.createUser(userName, email);
  if (response.acknowledged){
    res.status(201).json({ message: "User created", id: response.insertedId });
  }else {
    res.status(500).json(response.error || "Some error occured while creating a new contact")
  }
};

const updateUser = async (req, res) => {
  const contactId = new ObjectId(req.params.id);
  const {userName, email} = req.body;
  const response = await userModel.updateUser(contactId, userName, email);
  if (response.matchedCount > 0){
    res.status(201).json({ message: "User updated", id: response.contactId });
  }else {
    res.status(500).json(response.error || "Some error occured while updating a contact")
  }
};

const updateUserRole = async (req, res) => {
  const contactId = new ObjectId(req.params.id);
  const {role} = req.body;
  const response = await userModel.updateUserRole(contactId, role);
  if (response.matchedCount > 0){
    res.status(204).send();
  }else {
    res.status(500).json(response.error || "Some error occured while updating the user role")
  }
};

const deleteUser = async (req, res) => {
  try {
      // Validate the ID format
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid contact ID format.' });
      }

      const contactId = new ObjectId(req.params.id);
      const response = await userModel.deleteUser(contactId);

      if (response.deletedCount > 0) {
        res.status(200).json({
          success: true,
          message: 'Contact deleted successfully'
        });
      } else {
        res.status(404).json({ message: 'Contact not found.' });
      }
    } catch (err) {
      console.error('❌ Error deleting contact:', err);
      res.status(500).json({ message: err.message || 'Some error occurred while deleting the contact' });
    }
  }

module.exports= {getAll, getSingle, createUser, updateUser, deleteUser, updateUserRole};