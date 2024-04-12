import { v4 as uuidv4 } from "uuid";
import connection from "../connection.js";

const OrderModel = {
    // Method to create an order from a user's cart
    createOrderFromCart: function (userId, callback) {
        // Generate a unique order ID
        const orderId = uuidv4();
        // Get the user's cart items
        connection.query(
            'SELECT * FROM user_cart WHERE user_id = ?',
            [userId], (error, cartItems) => {
                if (error) {
                    // If there's an error getting cart items, invoke the callback with an error message
                    callback("Error getting cart items: " + error.stack, null);
                    return;
                }

                if (cartItems.length === 0) {
                    // If the cart is empty, invoke the callback with an error message
                    callback("The cart is empty, cannot create order", null);
                    return;
                }
                // Calculate the total amount of the order based on cart items
                let totalAmount = 0;

                cartItems.forEach(item => {
                    totalAmount += item.quantity * item.product_price;
                });
                // Insert the order into the orders table
                connection.query(
                    'INSERT INTO orders (order_id, user_id, total_amount, delivery_address_id) VALUES (?, ?, ?, (SELECT address_id FROM addresses WHERE user_id = ? ORDER BY created_at DESC LIMIT 1))',
                    [orderId, userId, totalAmount, userId], (error, result) => {
                        if (error) {
                            // If there's an error inserting the order, invoke the callback with an error message
                            callback("Error creating order: " + error.stack, null);
                            return;
                        }
                        // Move cart items to order items table
                        const orderItems = cartItems.map(item => [
                            uuidv4(),
                            orderId,
                            item.product_id,
                            item.quantity,
                            item.product_price,
                            item.quantity * item.product_price
                        ]);

                        connection.query(
                            'INSERT INTO order_items (order_item_id, order_id, product_id, quantity, unit_price, subtotal) VALUES ?',
                            [orderItems], (error, result) => {
                                if (error) {
                                    // If there's an error moving cart items, invoke the callback with an error message
                                    callback("Error moving cart items to order: " + error.stack, null);
                                    return;
                                }
                                // Remove cart items after order creation
                                connection.query(
                                    'DELETE FROM user_cart WHERE user_id = ?',
                                    [userId], (error, result) => {
                                        if (error) {
                                            // If there's an error removing cart items, invoke the callback with an error message
                                            callback("Error clearing cart after order creation: " + error.stack, null);
                                            return;
                                        }
                                        // Invoke the callback indicating order creation success
                                        callback(null, "Order created successfully");
                                    });
                            });
                    });
            });
    },

    // Method to cancel an order
    cancelOrder: function (orderId, callback) {
        // Here you can implement logic to cancel the order with the provided order ID
        // For simplicity, we'll just invoke the callback with a success message
        callback(null, "Order cancelled successfully");
    },

    // Method to get order history for a user
    getOrderHistory: function (userId, callback) {
        // Get all orders for the user with the provided user ID
        connection.query(
            'SELECT * FROM orders WHERE user_id = ?',
            [userId], (error, orders) => {
                if (error) {
                    // If there's an error getting order history, invoke the callback with an error message
                    callback("Error getting order history: " + error.stack, null);
                    return;
                }
                // Invoke the callback with the user's order history
                callback(null, orders);
            });
    },

    // Method to process payment for an order
    processPayment: function (orderId, paymentMethod, callback) {
        // Here you can implement logic to process payment for the given order ID
        // For simplicity, we'll just invoke the callback with a success message
        callback(null, "Order payment processed successfully");
    },
};

export default OrderModel;