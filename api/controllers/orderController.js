import OrderModel from "../../database/models/orderModel.js";

const sendResponse = (response, statusCode, message) => {
    return response.status(statusCode).json({ message });
};

export const createOrderFromCart = async (request, response) => {
    const userId = request.user.id;

    await OrderModel.createOrderFromCart(userId, (result, error) => {
        if (error) {
            return sendResponse(response, 500, error);
        }

        return sendResponse(response, 201, result);
    });
};