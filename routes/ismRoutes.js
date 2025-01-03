const express = require("express");
const { getUsers, userById, createUser, updateUser, deleteUser } = require("../controllers/userController");

const router = express.Router();

// Routes
router.get('/getall', getUsers);  // Get all users list (GET method)
router.get('/get/:id', userById);  // Get user by ID
router.post('/create', createUser);  // Create a user
router.put('/update/:email', updateUser);  // Update user details (using PUT method) - EMAIL PARAMETER
router.delete('/delete/:id', deleteUser);  // Delete a user (using DELETE method)

module.exports = router;
