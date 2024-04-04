import OrderModel from "../../database/models/orderModel.js";

const sendResponse = (response, statusCode, message) => {
    return response.status(statusCode).json({ message });
};

export const createOrder = async (request, response) => {
    const userId = request.user.user_id;
    const orderDetails = request.body;

    await OrderModel.createOrder(userId, orderDetails, (result, error) => {
        if (error) {
            return sendResponse(response, 500, error);
        }

        return sendResponse(response, 201, result);
    });
};

export const cancelOrder = async (request, response) => {
    const orderId = request.params.orderId;

    await OrderModel.cancelOrder(orderId, (result, error) => {
        if (error) {
            return sendResponse(response, 500, error);
        }

        return sendResponse(response, 200, result);
    });
};

export const getOrderDetails = async (request, response) => {
    const orderId = request.params.orderId;

    await OrderModel.getOrderDetails(orderId, (result, error) => {
        if (error) {
            return sendResponse(response, 500, error);
        }

        return sendResponse(response, 200, result);
    });
};