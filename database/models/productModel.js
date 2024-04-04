import { v4 as uuidv4 } from "uuid"; // Importing UUID library for generating unique product IDs
import connection from "../connection.js"; // Importing database connection module
import dotenv from "dotenv"; // Importing dotenv for environment variables

dotenv.config(); // Loading environment variables from .env file if present

const ProductModel = {
    // Method to fetch all products
    fetchProducts: async function (callback) {
        try {
            // Querying all products from the database
            const [rows] = await connection.execute('SELECT * FROM products');
            // Callback with fetched products
            callback(rows, null);

        } catch (error) {
            // Callback with error message if there's an error fetching products
            callback(null, "Error fetching products: " + error.stack);
        }
    },

    // Method to fetch a product by its ID
    fetchProductById: async function (productId, callback) {
        try {
            // Querying product by ID from the database
            const [rows] = await connection.execute('SELECT * FROM products WHERE product_id = ?', [productId]);

            // Checking if product exists
            if (rows.length === 0) {
                callback("Product not found", null);
                return;
            }

            // Callback with fetched product
            callback(rows[0], null);

        } catch (error) {
            // Callback with error message if there's an error fetching product
            callback(null, "Error fetching product: " + error.stack);
        }
    },

    // Method to fetch products by name
    fetchProductsByName: async function (searchTerm, callback) {
        const searchQuery = `%${searchTerm}%`; // Constructing search query with wildcard characters

        try {
            // Querying products by name from the database
            const [rows] = await connection.execute('SELECT * FROM products WHERE product_name LIKE ?', [searchQuery]);
            // Callback with fetched products
            callback(rows, null);

        } catch (error) {
            // Callback with error message if there's an error searching products
            callback(null, "Error searching products: " + error.stack);
        }
    },

    // Method to fetch products by category
    fetchProductsByCategory: async function (categoryName, callback) {
        try {
            // Querying products by category from the database
            const [rows] = await connection.execute('SELECT * FROM products WHERE category_id = ?', [categoryName]);
            // Callback with fetched products
            callback(rows, null);

        } catch (error) {
            // Callback with error message if there's an error fetching products
            callback(null, "Error fetching products: " + error.stack);
        }
    },

    // Method to add a new product
    addProduct: async function (userLogged, productInfo, callback) {
        try {
            // Checking if the user is authorized to add a product
            const [userResult] = await connection.execute('SELECT * FROM users WHERE user_id = ?', [userLogged.user.user_id]);

            // If user not found or not an admin, return unauthorized message
            if (userResult.length === 0 || !userResult[0].is_admin) {
                callback(null, "Unauthorized");
                return;
            }

            // Stringifying tags JSON
            const tagsJson = JSON.stringify(productInfo.tags);
            // Generating a new UUID for the product
            const productId = this.generateUUID();
            // Inserting product details into the database
            await connection.execute('INSERT INTO products (product_id, product_name, product_price, product_picture, product_description, tags) VALUES (?, ?, CAST(? AS DECIMAL(10, 2)), ?, ?, ?)',
                [productId, productInfo.product_name, productInfo.product_price, productInfo.product_picture, productInfo.product_description, tagsJson]);

            // Callback with the created product details
            callback({ product_id: productId, ...productInfo }, null);

        } catch (error) {
            // Callback with error message if there's an error adding product
            callback(null, "Error adding product: " + error.stack);
        }
    },

    // Method to update a product by its ID
    updateProductById: async function (userLogged, productInfo, callback) {
        try {
            // Checking if the user is authorized to add a product
            const [userResult] = await connection.execute('SELECT * FROM users WHERE user_id = ?', [userLogged.user.user_id]);

            // If user not found or not an admin, return unauthorized message
            if (userResult.length === 0 || !userResult[0].is_admin) {
                callback(null, "Unauthorized");
                return;
            }

            // Updating product details in the database
            const [result] = await connection.execute('UPDATE products SET product_name = ?, product_description = ?, product_price = ?, category_id = ? WHERE product_id = ?',
                [productInfo.updatedProduct.product_name, productInfo.updatedProduct.product_description, productInfo.updatedProduct.product_price, productInfo.updatedProduct.category_id, productInfo.productId]);

            if (result.affectedRows === 0) {
                callback("Product not found", null);
                return;
            }

            callback("Product updated successfully", null);

        } catch (error) {
            callback(null, "Error updating product: " + error.stack);
        }
    },

    // Method to delete a product by its ID
    deleteProductById: async function (userLogged, productId, callback) {
        try {
            // Checking if the user is authorized to add a product
            const [userResult] = await connection.execute('SELECT * FROM users WHERE user_id = ?', [userLogged.user.user_id]);

            // If user not found or not an admin, return unauthorized message
            if (userResult.length === 0 || !userResult[0].is_admin) {
                callback(null, "Unauthorized");
                return;
            }

            // Deleting product from the database
            const [result] = await connection.execute('DELETE FROM products WHERE product_id = ?', [productId]);

            // Checking if the product exists
            if (result.affectedRows === 0) {
                callback("Product not found", null);
                return;
            }

            // Callback indicating successful product deletion
            callback("Product deleted successfully", null);

        } catch (error) {
            // Callback with error message if there's an error deleting product
            callback(null, "Error deleting product: " + error.stack);
        }
    },

    // Method to generate UUID for a product
    generateUUID: function () {
        return uuidv4();
    }
};

export default ProductModel; // Exporting the ProductModel object as default