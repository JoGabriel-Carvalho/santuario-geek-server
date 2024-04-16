import { v4 as uuidv4 } from "uuid";
import connection from "../connection.js";

const CartModel = {
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
    },

    // Method to add an item to the user's cart
    addItemToCart: function (userId, productId, quantity, callback) {
        // Generate a unique cart item ID
        const cartItemId = uuidv4();

        // Check product availability
        checkProductAvailability(productId, quantity, (error, availableQuantity) => {
            if (error) {
                // If there's an error checking product availability, invoke the callback with the error
                callback(error, null);
                return;
            }

            // Insert the item into the user's cart
            connection.query(
                'INSERT INTO user_cart (cart_item_id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)',
                [cartItemId, userId, productId, quantity],
                (insertError, insertResult) => {
                    if (insertError) {
                        // If there's an error executing the query, invoke the callback with an error message
                        callback("Error adding item to cart: " + insertError.stack, null);
                        return;
                    }

                    // Invoke the callback indicating successful addition of the item to the cart
                    callback(null, "Item added to cart successfully");
                }
            );
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
        // Check product availability
        checkProductAvailability(productId, newQuantity, (error, availableQuantity) => {
            if (error) {
                // If there's an error checking product availability, invoke the callback with the error
                callback(error, null);
                return;
            }

            // Update the quantity of the item in the user's cart
            connection.query(
                'UPDATE user_cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
                [newQuantity, userId, productId],
                (updateError, result) => {
                    if (updateError) {
                        // If there's an error executing the query, invoke the callback with an error message
                        callback("Error updating item quantity in cart: " + updateError.stack, null);
                        return;
                    }

                    // If no rows were affected, the item was not found in the cart
                    if (result.affectedRows === 0) {
                        callback("Item not found in cart", null);
                        return;
                    }

                    // Invoke the callback indicating successful update of the item quantity in the cart
                    callback(null, "Item quantity updated in cart successfully");
                }
            );
        });
    }
};

// Method to check product availability
function checkProductAvailability(productId, quantity, callback) {
    // Query the database to get the available quantity of the product
    connection.query(
        'SELECT quantity FROM products WHERE product_id = ?',
        [productId],
        (error, results) => {
            if (error) {
                // If there's an error executing the query, invoke the callback with an error message
                callback("Error checking product availability: " + error.stack, null);
                return;
            }

            // If no results are returned, the product does not exist
            if (results.length === 0) {
                callback("Product not found", null);
                return;
            }

            // Retrieve the available quantity of the product
            const availableQuantity = results[0].quantity;

            // If the requested quantity exceeds the available quantity, return an error
            if (quantity > availableQuantity) {
                callback("Requested quantity exceeds available quantity", null);
                return;
            }

            // Invoke the callback with no error and the available quantity
            callback(null, availableQuantity);
        }
    );
}

export default CartModel;