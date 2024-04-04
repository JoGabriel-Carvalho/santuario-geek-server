import { v4 as uuidv4 } from "uuid";
import connection from "../connection.js";
import dotenv from "dotenv";

dotenv.config();

const ProductModel = {
    fetchProducts: async function (callback) {
        try {
            const [rows] = await connection.execute('SELECT * FROM products');
            callback(rows, null);

        } catch (error) {
            callback(null, "Error fetching products: " + error.stack);
        }
    },

    fetchProductById: async function (productId, callback) {
        try {
            const [rows] = await connection.execute('SELECT * FROM products WHERE product_id = ?', [productId]);

            if (rows.length === 0) {
                callback("Product not found", null);
                return;
            }

            callback(rows[0], null);

        } catch (error) {
            callback(null, "Error fetching product: " + error.stack);
        }
    },

    fetchProductsByName: async function (searchTerm, callback) {
        const searchQuery = `%${searchTerm}%`;

        try {
            const [rows] = await connection.execute('SELECT * FROM products WHERE product_name LIKE ?', [searchQuery]);
            callback(rows, null);

        } catch (error) {
            callback(null, "Error searching products: " + error.stack);
        }
    },

    fetchProductsByCategory: async function (categoryName, callback) {
        try {
            const [rows] = await connection.execute('SELECT * FROM products WHERE category_id = ?', [categoryName]);
            callback(rows, null);

        } catch (error) {
            callback(null, "Error fetching products: " + error.stack);
        }
    },

    addProduct: async function (userLogged, productInfo, callback) {
        try {
            const [userResult] = await connection.execute('SELECT * FROM users WHERE user_id = ?', [userLogged.user.user_id]);

            if (userResult.length === 0) {
                callback(null, "User not found");
                return;
            }

            if (!userResult[0].is_admin) {
                callback(null, "Unauthorized");
                return;
            }

            const tagsJson = JSON.stringify(productInfo.tags);
            const productId = this.generateUUID();
            await connection.execute('INSERT INTO products (product_id, product_name, product_price, product_picture, product_description, tags) VALUES (?, ?, CAST(? AS DECIMAL(10, 2)), ?, ?, ?)',
                [productId, productInfo.product_name, productInfo.product_price, productInfo.product_picture, productInfo.product_description, tagsJson]);

            callback({ product_id: productId, ...productInfo }, null);

        } catch (error) {
            callback(null, "Error adding product: " + error.stack);
        }
    },

    updateProductById: async function (productInfo, callback) {
        try {
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

    deleteProductById: async function (productId, callback) {
        try {
            const [result] = await connection.execute('DELETE FROM products WHERE product_id = ?', [productId]);

            if (result.affectedRows === 0) {
                callback("Product not found", null);
                return;
            }

            callback("Product deleted successfully", null);

        } catch (error) {
            callback(null, "Error deleting product: " + error.stack);
        }
    },

    generateUUID: function () {
        return uuidv4();
    }
};

export default ProductModel;