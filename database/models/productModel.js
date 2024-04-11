import { v4 as uuidv4 } from "uuid"; // Importing UUID library for generating unique product IDs
import connection from "../connection.js"; // Importing database connection module
import dotenv from "dotenv"; // Importing dotenv for environment variables

dotenv.config(); // Loading environment variables from .env file if present

const ProductModel = {
    // Method to fetch all products
    fetchProducts(callback) {
        // Querying all products from the database
        connection.query(
            'SELECT * FROM products', (error, rows) => {
            if (error) {
                // Callback with error message if there's an error fetching products
                callback(null, "Error fetching products: " + error.stack);
                return;
            }
            // Callback with fetched products
            callback(rows, null);
        });
    },

    // Method to fetch a product by its ID
    fetchProductById(productId, callback) {
        // Querying product by ID from the database
        connection.query(
            'SELECT * FROM products WHERE product_id = ?',
            [productId],
            (error, rows) => {
                if (error) {
                    // Callback with error message if there's an error fetching product
                    callback(null, "Error fetching product: " + error.stack);
                    return;
                }

                // Checking if product exists
                if (rows.length === 0) {
                    callback("Product not found", null);
                    return;
                }

                // Callback with fetched product
                callback(rows[0], null);
            }
        );
    },

    // Method to fetch products by name
    fetchProductsByName(searchTerm, callback) {
        const searchQuery = `%${searchTerm}%`; // Constructing search query with wildcard characters

        // Querying products by name from the database
        connection.query(
            'SELECT * FROM products WHERE product_name LIKE ?',
            [searchQuery],
            (error, rows) => {
                if (error) {
                    // Callback with error message if there's an error searching products
                    callback(null, "Error searching products: " + error.stack);
                    return;
                }
                // Callback with fetched products
                callback(rows, null);
            }
        );
    },

    // Method to fetch products by tags
    fetchProductsByTags(tags, callback) {
        // Split the tags string into individual tags
        const tagArray = tags.split("-");
        // Construct the WHERE clause for SQL query
        const whereClause = tagArray.map(tag => "tags LIKE '%" + tag + "%'").join(" AND ");

        // Querying products by tags from the database
        connection.query(
            'SELECT * FROM products WHERE ' + whereClause,
            (error, rows) => {
                if (error) {
                    // Callback with error message if there's an error fetching products
                    callback(null, "Error fetching products: " + error.stack);
                    return;
                }
                // Callback with fetched products
                callback(rows, null);
            }
        );
    },

    // Method to add a new product
    async addProduct(userId, productInfo, callback) {
        try {
            // Retrieve user information by ID
            const userResult = await this.getUserById(userId);

            // Check if user is not found or is not an admin
            if (userResult.length === 0 || !userResult[0].is_admin) {
                // Send unauthorized message via callback
                callback(null, "Unauthorized");
                return;
            }

            // Convert tags array to JSON string
            const tagsJson = JSON.stringify(productInfo.tags);

            // Generate a unique product ID
            const productId = this.generateUUID();

            // Insert new product into the database
            connection.query(
                'INSERT INTO products (product_id, product_name, product_price, product_picture, product_description, tags) VALUES (?, ?, CAST(? AS DECIMAL(10, 2)), ?, ?, ?)',
                [productId, productInfo.product_name, productInfo.product_price, productInfo.product_picture, productInfo.product_description, tagsJson],
                (error, results) => {
                    if (error) {
                        // Send error message if an error occurs during product addition
                        callback(null, "Error adding product: " + error.stack);
                    } else {
                        // Send the newly added product information via callback
                        callback({ product_id: productId, ...productInfo }, null);
                    }
                }
            );

        } catch (error) {
            // Send error message if an error occurs during product addition
            callback(null, "Error adding product: " + error.stack);
        }
    },

    // Method to update a product by its ID
    async updateProductById(userId, productId, productInfo, callback) {
        try {
            // Retrieve user information by ID
            const userResult = await this.getUserById(userId);

            // Check if user is not found or is not an admin
            if (userResult.length === 0 || !userResult[0].is_admin) {
                // Send unauthorized message via callback
                callback(null, "Unauthorized");
                return;
            }

            // Convert tags array to JSON string
            const tagsJson = JSON.stringify(productInfo.tags);

            // Perform the product update query
            connection.query(
                'UPDATE products SET product_name = ?, product_description = ?, product_price = ?, product_picture = ?, tags = ? WHERE product_id = ?',
                [productInfo.product_name, productInfo.product_description, productInfo.product_price, productInfo.product_picture, tagsJson, productId],
                (error, result) => {
                    if (error) {
                        // Send error message if an error occurs during product update
                        callback(null, "Error updating product: " + error.stack);
                    } else {
                        // Check if the product was found and updated
                        if (result.affectedRows === 0) {
                            // Send message if product not found
                            callback("Product not found", null);
                        } else {
                            // Send success message via callback
                            callback("Product updated successfully", null);
                        }
                    }
                }
            );

        } catch (error) {
            // Send error message if an error occurs during product update
            callback(null, "Error updating product: " + error.stack);
        }
    },

    // Method to delete a product by its ID
    async deleteProductById(userId, productId, callback) {
        try {
            // Retrieve user information by ID
            const userResult = await this.getUserById(userId);

            // Check if user is not found or is not an admin
            if (userResult.length === 0 || !userResult[0].is_admin) {
                // Send unauthorized message via callback
                callback(null, "Unauthorized");
                return;
            }

            // Perform the product deletion query
            connection.query(
                'DELETE FROM products WHERE product_id = ?',
                [productId],
                (error, result) => {
                    if (error) {
                        // Send error message if an error occurs during product deletion
                        callback(null, "Error deleting product: " + error.stack);
                    } else {
                        // Check if the product was found and deleted
                        if (result.affectedRows === 0) {
                            // Send message if product not found
                            callback("Product not found", null);
                        } else {
                            // Send success message via callback
                            callback("Product deleted successfully", null);
                        }
                    }
                }
            );

        } catch (error) {
            // Send error message if an error occurs during product deletion
            callback(null, "Error deleting product: " + error.stack);
        }
    },

    // Method to get user by ID
    getUserById(userId) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM users WHERE user_id = ?',
                [userId],
                (error, userResult) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(userResult);
                }
            );
        });
    },

    // Method to generate UUID for a product
    generateUUID() {
        return uuidv4();
    }
};

export default ProductModel; // Exporting the ProductModel object as default