import { v4 as uuidv4 } from "uuid";
import connection from "../connection.js";

const CartModel = {
    addItemToCart: async function (userId, productId, quantity, callback) {
        try {
            const [productRows] = await connection.execute('SELECT * FROM products WHERE product_id = ? AND quantity >= ?', [productId, quantity]);

            if (productRows.length === 0) {
                callback("Product not available or insufficient quantity", null);
                return;
            }

            const [cartRows] = await connection.execute('SELECT * FROM user_cart WHERE user_id = ? AND product_id = ?', [userId, productId]);
            if (cartRows.length === 0) {
                const cartItemId = uuidv4();
                await connection.execute('INSERT INTO user_cart (cart_id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)', [cartItemId, userId, productId, quantity]);

            } else {
                const newQuantity = cartRows[0].quantity + quantity;
                await connection.execute('UPDATE user_cart SET quantity = ? WHERE user_id = ? AND product_id = ?', [newQuantity, userId, productId]);
            }

            callback(null, "Item added to cart successfully");

        } catch (error) {
            callback("Error adding item to cart: " + error.stack, null);
        }
    },

    removeItemFromCart: async function (userId, productId, callback) {
        try {
            await connection.execute('DELETE FROM user_cart WHERE user_id = ? AND product_id = ?', [userId, productId]);

            callback(null, "Item removed from cart successfully");

        } catch (error) {
            callback("Error removing item from cart: " + error.stack, null);
        }
    },

    updateCartItemQuantity: async function (userId, productId, newQuantity, callback) {
        try {
            await connection.execute('UPDATE user_cart SET quantity = ? WHERE user_id = ? AND product_id = ?', [newQuantity, userId, productId]);

            callback(null, "Cart item quantity updated successfully");

        } catch (error) {
            callback("Error updating cart item quantity: " + error.stack, null);
        }
    },
};

export default CartModel;