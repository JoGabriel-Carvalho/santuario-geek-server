import CartModel from "../../database/models/cartModel.js";

const sendResponse = (response, statusCode, message) => {
    return response.status(statusCode).json({ message });
};

export const getUserCart = async (request, response) => {
    const userId = request.user.id;

    await CartModel.getUserCart(userId, (error, results) => {
        if (error) {
            return sendResponse(response, 500, error);
        }

        return sendResponse(response, 200, results);
    });
};

export const addItemToCart = async (request, response) => {
    const userId = request.user.id;
    const { productId, quantity } = request.body;

    await CartModel.addItemToCart(userId, productId, quantity, (error, result) => {
        if (error) {
            return sendResponse(response, 500, error);
        }

        return sendResponse(response, 201, result);
    });
};

export const removeItemFromCart = async (request, response) => {
    const userId = request.user.id;
    const { productId } = request.params;

    await CartModel.removeItemFromCart(userId, productId, (error, result) => {
        if (error) {
            return sendResponse(response, 500, error);
        }

        return sendResponse(response, 200, result);
    });
};

export const updateCartItemQuantity = async (request, response) => {
    const userId = request.user.id;
    const { productId, newQuantity } = request.body;

    await CartModel.updateCartItemQuantity(userId, productId, newQuantity, (error, result) => {
        if (error) {
            return sendResponse(response, 500, error);
        }

        return sendResponse(response, 200, result);
    });
};