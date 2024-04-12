import { v4 as uuidv4 } from "uuid";
import connection from "../connection.js";

const CartModel = {
    // Method to add an item to the user's cart
    addItemToCart: function (userId, productId, quantity, callback) {
        // Generate a unique cart item ID
        const cartItemId = uuidv4();
        // Insert the item into the user's cart
        connection.query(
            'INSERT INTO user_cart (cart_item_id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)',
            [cartItemId, userId, productId, quantity], (error, result) => {
                if (error) {
                    // If there's an error executing the query, invoke the callback with an error message
                    callback("Error adding item to cart: " + error.stack, null);
                    return;
                }
                // Invoke the callback indicating successful addition of the item to the cart
                callback(null, "Item added to cart successfully");
            });
    },

    // Method to remove an item from the user's cart
    removeItemFromCart: function (userId, productId, callback) {
        // Delete the item from the user's cart based on user ID and product ID
        connection.query(
            'DELETE FROM user_cart WHERE user_id = ? AND product_id = ?',
            [userId, productId], (error, result) => {
                if (error) {
                    // If there's an error executing the query, invoke the callback with an error message
                    callback("Error removing item from cart: " + error.stack, null);
                    return;
                }

                if (result.affectedRows === 0) {
                    // If no rows were affected, the item was not found in the cart, so invoke the callback with a message
                    callback("Item not found in cart", null);
                    return;
                }

                // Invoke the callback indicating successful removal of the item from the cart
                callback(null, "Item removed from cart successfully");
            });
    },

    // Method to update the quantity of an item in the user's cart
    updateCartItemQuantity: function (userId, productId, newQuantity, callback) {
        // Update the quantity of the item in the user's cart based on user ID and product ID
        connection.query(
            'UPDATE user_cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
            [newQuantity, userId, productId], (error, result) => {
                if (error) {
                    // If there's an error executing the query, invoke the callback with an error message
                    callback("Error updating item quantity in cart: " + error.stack, null);
                    return;
                }

                if (result.affectedRows === 0) {
                    // If no rows were affected, the item was not found in the cart, so invoke the callback with a message
                    callback("Item not found in cart", null);
                    return;
                }

                // Invoke the callback indicating successful update of the item quantity in the cart
                callback(null, "Item quantity updated in cart successfully");
            });
    },

    // Method to retrieve the user's cart items
    getUserCart: function (userId, callback) {
        // Retrieve all items from the user's cart based on user ID
        connection.query(
            'SELECT * FROM user_cart WHERE user_id = ?',
            [userId], (error, results) => {
                if (error) {
                    // If there's an error executing the query, invoke the callback with an error message
                    callback("Error retrieving user cart: " + error.stack, null);
                    return;
                }
                // Invoke the callback with the retrieved cart items
                callback(null, results);
            });
    }
};

export default CartModel;