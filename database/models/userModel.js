import { v4 as uuidv4 } from "uuid"; // Importing UUID library for generating unique user and address IDs
import connection from "../connection.js"; // Importing database connection module
import jwt from "jsonwebtoken"; // Importing JWT library for token generation
import bcrypt from "bcrypt"; // Importing bcrypt for password hashing
import dotenv from "dotenv"; // Importing dotenv for environment variables

dotenv.config(); // Loading environment variables from .env file if present

const UserModel = {
    // Method to authenticate user sign-in
    signin: function (user, callback) {
        // Querying user from database based on email
        connection.query('SELECT * FROM users WHERE user_email = ?', [user.user_email], (error, rows) => {
            if (error) {
                // Callback with error message if there's an error executing the query
                callback("Error executing query: " + error.stack);
                return;
            }

            if (rows.length === 0) {
                // Callback with user not found message if no user exists with the provided email
                callback({ statusCode: 404, message: "User not found" }, null);
                return;
            }

            const userDetails = rows[0];
            // Comparing provided password with hashed password retrieved from database
            bcrypt.compare(user.user_password, userDetails.user_password, (error, result) => {
                if (error) {
                    // Callback with error message if there's an error comparing passwords
                    callback("Error comparing passwords: " + error.message);
                    return;
                }

                if (!result) {
                    // Callback with invalid password message if passwords don't match
                    callback({ statusCode: 401, message: "Invalid password" }, null);
                    return;
                }

                // Generating JWT token for user authentication
                const token = jwt.sign({ id: userDetails.user_id, email: userDetails.user_email }, process.env.JWT_SECRET);

                // Callback with user details and token
                callback({ user: userDetails, token }, null);
            });
        });
    },

    // Method to register a new user
    signup: function (user, callback) {
        // Hashing password before storing it in the database
        bcrypt.hash(user.user_password, 10, (error, hash) => {
            if (error) {
                // Callback with error message if there's an error hashing the password
                callback("Error hashing password: " + error.message);
                return;
            }

            const userId = this.generateUUID();

            // Checking if the provided email already exists in the database
            connection.query('SELECT * FROM users WHERE user_email = ?', [user.user_email], (error, rows) => {
                if (error) {
                    // Callback with error message if there's an error executing the query
                    callback("Error executing query: " + error.stack);
                    return;
                }

                if (rows.length > 0) {
                    // Callback with email already exists message if the email is already registered
                    callback({ statusCode: 400, message: "Email already exists" }, null);
                    return;
                }

                // Inserting new user details into the database
                connection.query('INSERT INTO users (user_id, user_name, user_email, user_password) VALUES (?, ?, ?, ?)',
                    [userId, user.user_name, user.user_email, hash], (error, result) => {
                        if (error) {
                            // Callback with error message if there's an error creating the user
                            callback("Error creating user: " + error.stack);
                            return;
                        }

                        // Generating JWT token for user authentication
                        const token = jwt.sign({ id: userId, email: user.user_email }, process.env.JWT_SECRET);

                        // Callback with user details and token
                        callback({ user: { id: userId, email: user.user_email }, token }, null);
                    });
            });
        });
    },

    // Method to add a new address for a user
    addAddress: async function (userId, addressInfo, callback) {
        const addressId = uuidv4(); // Generating a new UUID for the address

        try {
            // Inserting address details into the database
            await connection.execute('INSERT INTO addresses (address_id, user_id, address_line1, address_line2, city, postal_code) VALUES (?, ?, ?, ?, ?, ?)',
                [addressId, userId, addressInfo.address_line1, addressInfo.address_line2, addressInfo.city, addressInfo.postal_code]);

            // Callback with the created address details
            callback({ address_id: addressId, ...addressInfo }, null);

        } catch (error) {
            // Callback with error message if there's an error adding the address
            callback(null, "Error adding address: " + error.stack);
        }
    },

    // Method to update an existing address
    updateAddress: async function (addressId, addressInfo, callback) {
        try {
            // Updating address details in the database
            const result = await connection.execute('UPDATE addresses SET address_line1 = ?, address_line2 = ?, city = ?, postal_code = ? WHERE address_id = ?',
                [addressInfo.address_line1, addressInfo.address_line2, addressInfo.city, addressInfo.postal_code, addressId]);

            if (result.affectedRows === 0) {
                // Callback with address not found message if the address does not exist
                callback("Address not found", null);
                return;
            }

            // Callback indicating successful address update
            callback("Address updated successfully", null);

        } catch (error) {
            // Callback with error message if there's an error updating the address
            callback(null, "Error updating address: " + error.stack);
        }
    },

    // Method to delete an existing address
    deleteAddress: async function (addressId, callback) {
        try {
            // Deleting address from the database
            const result = await connection.execute('DELETE FROM addresses WHERE address_id = ?', [addressId]);

            if (result.affectedRows === 0) {
                // Callback with address not found message if the address does not exist
                callback("Address not found", null);
                return;
            }

            // Callback indicating successful address deletion
            callback("Address deleted successfully", null);

        } catch (error) {
            // Callback with error message if there's an error deleting the address
            callback(null, "Error deleting address: " + error.stack);
        }
    },

    // Method to generate UUID
    generateUUID: function () {
        return uuidv4();
    }
};

export default UserModel; // Exporting the UserModel object as default