import { v4 as uuidv4 } from "uuid";
import connection from "../connection.js";

const OrderModel = {
    createOrder: async function (userId, orderDetails, callback) {
        const orderId = uuidv4();

        try {
            await connection.execute('INSERT INTO orders (order_id, user_id, total_amount, status) VALUES (?, ?, ?, ?)',
                [orderId, userId, orderDetails.total_amount, orderDetails.status]);

            callback({ order_id: orderId, ...orderDetails }, null);

        } catch (error) {
            callback(null, "Error creating order: " + error.stack);
        }
    },

    cancelOrder: async function (orderId, callback) {
        try {
            const [result] = await connection.execute('UPDATE orders SET status = ? WHERE order_id = ?',
                ['cancelled', orderId]);

            if (result.affectedRows === 0) {
                callback("Order not found", null);
                return;
            }

            callback("Order cancelled successfully", null);

        } catch (error) {
            callback(null, "Error cancelling order: " + error.stack);
        }
    },

    getOrderDetails: async function (orderId, callback) {
        try {
            const [orderRows] = await connection.execute('SELECT * FROM orders WHERE order_id = ?', [orderId]);

            if (orderRows.length === 0) {
                callback("Order not found", null);
                return;
            }

            const [itemRows] = await connection.execute('SELECT order_items.*, products.product_name, products.product_price FROM order_items INNER JOIN products ON order_items.product_id = products.product_id WHERE order_items.order_id = ?', [orderId]);

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

            callback(orderDetails, null);

        } catch (error) {
            callback(null, "Error fetching order details: " + error.stack);
        }
    }
};

export default OrderModel;