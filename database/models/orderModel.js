import { v4 as uuidv4 } from "uuid"; // Importing UUID library for generating unique order IDs
import connection from "../connection.js"; // Importing database connection module

const OrderModel = {
    // Method to create a new order
    createOrder: async function (userId, orderDetails, callback) {
        const orderId = uuidv4(); // Generating a new UUID for the order

        try {
            // Inserting order details into the database
            await connection.execute('INSERT INTO orders (order_id, user_id, total_amount, status) VALUES (?, ?, ?, ?)',
                [orderId, userId, orderDetails.total_amount, orderDetails.status]);

            // Callback with the created order details
            callback({ order_id: orderId, ...orderDetails }, null);

        } catch (error) {
            // Callback with error message if there's an error during order creation
            callback(null, "Error creating order: " + error.stack);
        }
    },

    // Method to cancel an existing order
    cancelOrder: async function (orderId, callback) {
        try {
            // Updating the status of the order to 'cancelled' in the database
            const [result] = await connection.execute('UPDATE orders SET status = ? WHERE order_id = ?',
                ['cancelled', orderId]);

            // Checking if the order exists
            if (result.affectedRows === 0) {
                callback("Order not found", null);
                return;
            }

            // Callback indicating successful cancellation of the order
            callback("Order cancelled successfully", null);

        } catch (error) {
            // Callback with error message if there's an error during order cancellation
            callback(null, "Error cancelling order: " + error.stack);
        }
    },

    // Method to retrieve details of a specific order
    getOrderDetails: async function (orderId, callback) {
        try {
            // Fetching order details from the database
            const [orderRows] = await connection.execute('SELECT * FROM orders WHERE order_id = ?', [orderId]);

            // Checking if the order exists
            if (orderRows.length === 0) {
                callback("Order not found", null);
                return;
            }

            // Fetching item details related to the order from the database
            const [itemRows] = await connection.execute('SELECT order_items.*, products.product_name, products.product_price FROM order_items INNER JOIN products ON order_items.product_id = products.product_id WHERE order_items.order_id = ?', [orderId]);

            // Constructing order details object with items
            const orderDetails = {
                order_id: orderRows[0].order_id,
                user_id: orderRows[0].user_id,
                total_amount: orderRows[0].total_amount,
                status: orderRows[0].status,
                created_at: orderRows[0].created_at,
                items: itemRows.map(item => ({
                    item_id: item.item_id,
                    product_id: item.product_id,
                    product_name: item.product_name,
                    quantity: item.quantity,
                    price_per_unit: item.product_price,
                    total_price: item.quantity * item.product_price
                }))
            };

            // Callback with the fetched order details
            callback(orderDetails, null);

        } catch (error) {
            // Callback with error message if there's an error fetching order details
            callback(null, "Error fetching order details: " + error.stack);
        }
    }
};

export default OrderModel; // Exporting the OrderModel object as default