import { v4 as uuidv4 } from "uuid"; // Importing UUID library for generating unique product IDs
import connection from "../connection.js"; // Importing database connection module

const OrderModel = {
    // Create an order from the user's cart
    createOrderFromCart: function (userId, callback) {
        const orderId = uuidv4();

        // Retrieve cart items for the user
        this.retrieveCartItems(userId, (error, cartItems) => {
            if (error) {
                return callback("Error getting cart items: " + error.stack, null);
            }

            if (cartItems.length === 0) {
                return callback("The cart is empty, cannot create order", null);
            }

            // Calculate total amount for the order
            this.calculateTotalAmount(cartItems, (error, totalAmount) => {
                if (error) {
                    return callback(error, null);
                }

                // Insert order into the database
                this.insertOrder(userId, orderId, totalAmount, cartItems, callback);
            });
        });
    },

    // Retrieve cart items for a user from the database
    retrieveCartItems: function (userId, callback) {
        connection.query(
            'SELECT * FROM user_cart WHERE user_id = ?',
            [userId],
            (error, cartItems) => {
                callback(error, cartItems);
            }
        );
    },

    // Calculate the total amount for an order based on cart items
    calculateTotalAmount: function (cartItems, callback) {
        let totalAmount = 0;
        let processedItems = 0;

        // Function to query product price from the database
        const queryProductPrice = (productId, quantity, callback) => {
            connection.query(
                'SELECT product_price FROM products WHERE product_id = ?',
                [productId],
                (error, product) => {
                    if (error) {
                        return callback(error, null);
                    }

                    if (product.length === 0) {
                        return callback("Product not found for ID: " + productId, null);
                    }

                    // Calculate subtotal for the item and add to total amount
                    const unitPrice = product[0].product_price;
                    const subtotal = quantity * unitPrice;
                    totalAmount += subtotal;
                    processedItems++;

                    // If all items are processed, invoke callback with total amount
                    if (processedItems === cartItems.length) {
                        callback(null, totalAmount);
                    }
                }
            );
        };

        // Loop through cart items and calculate total amount
        cartItems.forEach(item => {
            queryProductPrice(item.product_id, item.quantity, callback);
        });
    },

    // Insert an order into the database
    insertOrder: function (userId, orderId, totalAmount, cartItems, callback) {
        connection.query(
            'INSERT INTO orders (order_id, user_id, total_amount, delivery_address_id) VALUES (?, ?, ?, (SELECT address_id FROM addresses WHERE user_id = ? ORDER BY created_at DESC LIMIT 1))',
            [orderId, userId, totalAmount, userId],
            (error, result) => {
                if (error) {
                    return callback("Error creating order: " + error.stack, null);
                }

                // Move cart items to the order
                this.moveCartItemsToOrder(orderId, cartItems, callback);
            }
        );
    },

    // Move cart items to the order in the database
    moveCartItemsToOrder: function (orderId, cartItems, callback) {
        let processedItems = 0;
        const orderItems = [];

        // Function to query product price from the database
        const queryProductPrice = (productId, quantity, callback) => {
            connection.query(
                'SELECT product_price FROM products WHERE product_id = ?',
                [productId],
                (error, product) => {
                    if (error) {
                        return callback("Error getting product price: " + error.stack, null);
                    }

                    if (product.length === 0) {
                        return callback("Product not found for ID: " + productId, null);
                    }

                    // Calculate subtotal for the item
                    const unitPrice = product[0].product_price;
                    const subtotal = quantity * unitPrice;

                    // Push order item details into the array
                    orderItems.push([
                        uuidv4(),
                        orderId,
                        productId,
                        quantity,
                        unitPrice,
                        subtotal
                    ]);

                    processedItems++;

                    // If all items are processed, insert order items into the database
                    if (processedItems === cartItems.length) {
                        connection.query(
                            'INSERT INTO order_items (order_item_id, order_id, product_id, quantity, unit_price, subtotal) VALUES ?',
                            [orderItems],
                            (error, result) => {
                                if (error) {
                                    return callback("Error moving cart items to order: " + error.stack, null);
                                }

                                // Clear cart items after moving to the order
                                this.clearCartItems(cartItems[0].user_id, callback);
                            }
                        );
                    }
                }
            );
        };

        // Loop through cart items and move them to the order
        cartItems.forEach(item => {
            queryProductPrice(item.product_id, item.quantity, callback);
        });
    },

    // Clear cart items from the database after order creation
    clearCartItems: function (userId, callback) {
        connection.query(
            'DELETE FROM user_cart WHERE user_id = ?',
            [userId],
            (error, result) => {
                if (error) {
                    return callback("Error clearing cart after order creation: " + error.stack, null);
                }

                callback("Order created successfully", null);
            }
        );
    }
};

export default OrderModel;