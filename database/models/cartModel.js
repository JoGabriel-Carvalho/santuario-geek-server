import { v4 as uuidv4 } from "uuid"; // Importing UUID library for generating unique cart item IDs
import connection from "../connection.js"; // Importing database connection module

const CartModel = {
    // Method to add an item to the user's cart
    addItemToCart: async function (userId, productId, quantity, callback) {
        try {
            // Checking if the product is available and has sufficient quantity
            const [productRows] = await connection.execute('SELECT * FROM products WHERE product_id = ? AND quantity >= ?', [productId, quantity]);

            if (productRows.length === 0) {
                callback("Product not available or insufficient quantity", null);
                return;
            }

            // Checking if the item is already in the cart
            const [cartRows] = await connection.execute('SELECT * FROM user_cart WHERE user_id = ? AND product_id = ?', [userId, productId]);
            if (cartRows.length === 0) {
                // If not, generate a new cart item ID and insert into the cart
                const cartItemId = uuidv4();
                await connection.execute('INSERT INTO user_cart (cart_id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)', [cartItemId, userId, productId, quantity]);
            } else {
                // If yes, update the quantity of the existing cart item
                const newQuantity = cartRows[0].quantity + quantity;
                await connection.execute('UPDATE user_cart SET quantity = ? WHERE user_id = ? AND product_id = ?', [newQuantity, userId, productId]);
            }

            // Callback indicating successful addition of item to cart
            callback(null, "Item added to cart successfully");

        } catch (error) {
            // Callback with error message if any error occurs during the process
            callback("Error adding item to cart: " + error.stack, null);
        }
    },

    // Method to remove an item from the user's cart
    removeItemFromCart: async function (userId, productId, callback) {
        try {
            // Deleting the item from the cart based on user ID and product ID
            await connection.execute('DELETE FROM user_cart WHERE user_id = ? AND product_id = ?', [userId, productId]);

            // Callback indicating successful removal of item from cart
            callback(null, "Item removed from cart successfully");

        } catch (error) {
            // Callback with error message if any error occurs during the process
            callback("Error removing item from cart: " + error.stack, null);
        }
    },
};

export default CartModel; // Exporting the CartModel object as default