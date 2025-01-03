const db = require("../config/db");

// Get all users
const getUsers = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM users");
        if (!data || data.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No Records found'
            });
        }
        res.status(200).send({
            success: true,
            message: "All students Records",
            totalStudents: data.length,
            data: data,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get all user API',
            error
        });
    }
};

// Get user by ID
const userById = async (req, res) => {
    try {
        const userId = req.params.id;
        const [data] = await db.query("SELECT * FROM users WHERE user_id=?", [userId]);
        if (!data || data.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No records found'
            });
        }
        res.status(200).send({
            success: true,
            userDetails: data[0],
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in get user by id API',
            error
        });
    }
};

// Create User
const createUser = async (req, res) => {
    try {
        const { email, password_hash, full_name, phone_number, address, profile_picture_url, is_active, is_verified, created_at, updated_at } = req.body;

        if (!email || !password_hash || !full_name || !phone_number || !address ||
            !profile_picture_url || is_active === undefined || is_verified === undefined || !created_at || !updated_at) {
            return res.status(400).send({
                success: false,
                message: "Please provide all fields"
            });
        }

        const query = `INSERT INTO users (email, password_hash, full_name, phone_number, address, profile_picture_url, is_active, is_verified, created_at, updated_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await db.query(query, [email, password_hash, full_name, phone_number, address, profile_picture_url, is_active, is_verified, created_at, updated_at]);

        if (result.affectedRows === 0) {
            return res.status(500).send({
                success: false,
                message: "Error in inserting new user"
            });
        }

        res.status(201).send({
            success: true,
            message: "New user record created successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in create user API",
            error
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const email = req.params.email;  // Get email from URL params
        const { 
            password_hash, 
            full_name, 
            phone_number, 
            address, 
            profile_picture_url, 
            is_active, 
            is_verified, 
            updated_at 
        } = req.body;

        if (!email) {
            return res.status(400).send({
                success: false,
                message: "Invalid or missing email"
            });
        }

        // If no fields are provided for update, return an error
        if (!password_hash && !full_name && !phone_number && !address &&
            !profile_picture_url && is_active === undefined && is_verified === undefined && !updated_at) {
            return res.status(400).send({
                success: false,
                message: "Please provide at least one field to update"
            });
        }

        // Build the set part of the query dynamically based on provided fields
        let setFields = [];
        let queryValues = [];

        if (password_hash) {
            setFields.push("password_hash = ?");
            queryValues.push(password_hash);
        }

        if (full_name) {
            setFields.push("full_name = ?");
            queryValues.push(full_name);
        }

        if (phone_number) {
            setFields.push("phone_number = ?");
            queryValues.push(phone_number);
        }

        if (address) {
            setFields.push("address = ?");
            queryValues.push(address);
        }

        if (profile_picture_url) {
            setFields.push("profile_picture_url = ?");
            queryValues.push(profile_picture_url);
        }

        if (is_active !== undefined) {
            setFields.push("is_active = ?");
            queryValues.push(is_active);
        }

        if (is_verified !== undefined) {
            setFields.push("is_verified = ?");
            queryValues.push(is_verified);
        }

        if (updated_at) {
            setFields.push("updated_at = ?");
            queryValues.push(updated_at);
        }

        // Ensure we have at least one field to update
        if (setFields.length === 0) {
            return res.status(400).send({
                success: false,
                message: "Please provide at least one field to update"
            });
        }

        // Add email to the query values
        queryValues.push(email);

        // SQL query to update user details based on email
        const query = `UPDATE users 
                       SET ${setFields.join(", ")}
                       WHERE email = ?`;

        // Execute the query
        const [result] = await db.query(query, queryValues);

        // Check if no rows were affected (user not found or no changes made)
        if (result.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: "User not found or no changes made"
            });
        }

        res.status(200).send({
            success: true,
            message: "User details updated successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in update user API",
            error
        });
    }
};


// Delete a user
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).send({
                success: false,
                message: "Invalid or missing user ID"
            });
        }

        const [result] = await db.query("DELETE FROM users WHERE user_id = ?", [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).send({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in delete user API",
            error
        });
    }
};

module.exports = { getUsers, userById, createUser, updateUser, deleteUser };
