import ProductModel from "../../database/models/productModel.js";

const sendResponse = (response, statusCode, message) => {
    return response.status(statusCode).json({ message });
};

export const fetchProducts = async (request, response) => {
    await ProductModel.fetchProducts((result, error) => {
        if (error) {
            return sendResponse(response, 500, error);
        }

        if (!result) {
            return sendResponse(response, 404, "No products found");
        }

        return sendResponse(response, 200, result);
    });
};

export const fetchProductById = async (request, response) => {
    const productId = request.params.productId;

    await ProductModel.fetchProductById(productId, (result, error) => {
        if (error) {
            return sendResponse(response, 500, error);
        }

        if (!result) {
            return sendResponse(response, 404, "Product not found");
        }

        return sendResponse(response, 200, result);
    });
};

export const fetchProductsByName = async (request, response) => {
    const searchTerm = request.params.searchTerm;

    await ProductModel.fetchProductsByName(searchTerm, (result, error) => {
        if (error) {
            return sendResponse(response, 500, error);
        }

        if (!result || result.length === 0) {
            return sendResponse(response, 404, "No products found");
        }

        return sendResponse(response, 200, result);
    });
};

export const fetchProductsByCategory = async (request, response) => {
    const categoryName = request.params.categoryName;

    await ProductModel.fetchProductsByCategory(categoryName, (result, error) => {
        if (error) {
            return sendResponse(response, 500, error);
        }

        if (!result || result.length === 0) {
            return sendResponse(response, 404, "No products found in the specified category");
        }

        return sendResponse(response, 200, result);
    });
};

export const addProduct = async (request, response) => {
    const userLogged = request.user;
    const productInfo = request.body;

    await ProductModel.addProduct(userLogged, productInfo, (result, error) => {
        if (error) {
            return sendResponse(response, 500, error);
        }

        if (result === "Unauthorized") {
            return sendResponse(response, 401, "Unauthorized");
        }

        return sendResponse(response, 201, result);
    });
};

export const updateProductById = async (request, response) => {
    const userLogged = request.user;
    const productId = request.params.productId;
    const productInfo = request.body;

    await ProductModel.updateProductById(userLogged, productId, productInfo, (result, error) => {
        if (error) {
            return sendResponse(response, 500, error);
        }

        if (result === "Unauthorized") {
            return sendResponse(response, 401, "Unauthorized");
        }

        if (result === "Product not found") {
            return sendResponse(response, 404, "Product not found");
        }

        return sendResponse(response, 200, result);
    });
};

export const deleteProductById = async (request, response) => {
    const userLogged = request.user;
    const productId = request.params.productId;

    await ProductModel.deleteProductById(userLogged, productId, (result, error) => {
        if (error) {
            return sendResponse(response, 500, error);
        }

        if (result === "Unauthorized") {
            return sendResponse(response, 401, "Unauthorized");
        }

        if (result === "Product not found") {
            return sendResponse(response, 404, "Product not found");
        }

        return sendResponse(response, 200, result);
    });
};