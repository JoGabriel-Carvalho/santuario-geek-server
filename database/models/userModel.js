import { v4 as uuidv4 } from "uuid";
import connection from "../connection.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const UserModel = {
    signin: function (user, callback) {
        connection.query('SELECT * FROM users WHERE user_email = ?', [user.user_email], (error, rows) => {
            if (error) {
                callback("Error executing query: " + error.stack);
                return;
            }

            if (rows.length === 0) {
                callback({ statusCode: 404, message: "User not found" }, null);
                return;
            }

            const userDetails = rows[0];
            bcrypt.compare(user.user_password, userDetails.user_password, (error, result) => {
                if (error) {
                    callback("Error comparing passwords: " + error.message);
                    return;
                }

                if (!result) {
                    callback({ statusCode: 401, message: "Invalid password" }, null);
                    return;
                }

                const token = jwt.sign({ id: userDetails.user_id, email: userDetails.user_email }, process.env.JWT_SECRET);

                callback({ user: userDetails, token }, null);
            });
        });
    },

    signup: function (user, callback) {
        bcrypt.hash(user.user_password, 10, (error, hash) => {
            if (error) {
                callback("Error hashing password: " + error.message);
                return;
            }

            const userId = this.generateUUID();

            connection.query('SELECT * FROM users WHERE user_email = ?', [user.user_email], (error, rows) => {
                if (error) {
                    callback("Error executing query: " + error.stack);
                    return;
                }

                if (rows.length > 0) {
                    callback({ statusCode: 400, message: "Email already exists" }, null);
                    return;
                }

                connection.query('INSERT INTO users (user_id, user_name, user_email, user_password) VALUES (?, ?, ?, ?)',
                    [userId, user.user_name, user.user_email, hash], (error, result) => {
                        if (error) {
                            callback("Error creating user: " + error.stack);
                            return;
                        }

                        const token = jwt.sign({ id: userId, email: user.user_email }, process.env.JWT_SECRET);

                        callback({ user: { id: userId, email: user.user_email }, token }, null);
                    });
            });
        });
    },

    addAddress: async function (userId, addressInfo, callback) {
        const addressId = uuidv4();

        try {
            await connection.execute('INSERT INTO addresses (address_id, user_id, street, city, postal_code) VALUES (?, ?, ?, ?, ?)',
                [addressId, userId, addressInfo.street, addressInfo.city, addressInfo.postal_code]);

            callback({ address_id: addressId, ...addressInfo }, null);

        } catch (error) {
            callback(null, "Error adding address: " + error.stack);
        }
    },

    updateAddress: async function (addressId, addressInfo, callback) {
        try {
            const [result] = await connection.execute('UPDATE addresses SET street = ?, city = ?, postal_code = ? WHERE address_id = ?',
                [addressInfo.street, addressInfo.city, addressInfo.postal_code, addressId]);

            if (result.affectedRows === 0) {
                callback("Address not found", null);
                return;
            }

            callback("Address updated successfully", null);

        } catch (error) {
            callback(null, "Error updating address: " + error.stack);
        }
    },

    deleteAddress: async function (addressId, callback) {
        try {
            const [result] = await connection.execute('DELETE FROM addresses WHERE address_id = ?', [addressId]);

            if (result.affectedRows === 0) {
                callback("Address not found", null);
                return;
            }

            callback("Address deleted successfully", null);

        } catch (error) {
            callback(null, "Error deleting address: " + error.stack);
        }
    },

    generateUUID: function() {
        return uuidv4();
    }
};

export default UserModel;