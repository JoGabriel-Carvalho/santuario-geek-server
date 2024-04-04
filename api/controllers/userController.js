import UserModel from "../../database/models/userModel.js";

const sendResponse = (response, statusCode, message) => {
    return response.status(statusCode).json({ message });
};

export const signin = async (request, response) => {
    UserModel.signin(request.body, (result, error) => {
        if (error) {
            return sendResponse(response, 500, error);
        }

        if (result.statusCode === 404) {
            return sendResponse(response, 404, "User not found");
        }

        if (result.statusCode === 401) {
            return sendResponse(response, 401, "Invalid password");
        }

        return sendResponse(response, 200, result);
    });
};

export const signup = async (request, response) => {
    UserModel.signup(request.body, (result, error) => {
        if (error) {
            return sendResponse(response, 500, error);
        }

        if (result.statusCode === 400) {
            return sendResponse(response, 400, "Email already exists");
        }

        return sendResponse(response, 201, result);
    });
};

export const addAddress = async (request, response) => {
    const userId = request.user.id; // Extracting user ID from authenticated user's token
    const addressInfo = request.body; // Extracting address details from request body

    await UserModel.addAddress(userId, addressInfo, (result, error) => {
        if (error) {
            return sendResponse(response, 500, error);
        }

        return sendResponse(response, 201, result);
    });
};

export const updateAddress = async (request, response) => {
    const addressId = request.params.addressId; // Extracting address ID from request parameters
    const addressInfo = request.body; // Extracting updated address details from request body

    await UserModel.updateAddress(addressId, addressInfo, (result, error) => {
        if (error) {
            return sendResponse(response, 500, error);
        }

        if (result === "Address not found") {
            return sendResponse(response, 404, "Address not found");
        }

        return sendResponse(response, 200, result);
    });
};

export const deleteAddress = async (request, response) => {
    const addressId = request.params.addressId; // Extracting address ID from request parameters

    await UserModel.deleteAddress(addressId, (result, error) => {
        if (error) {
            return sendResponse(response, 500, error);
        }

        if (result === "Address not found") {
            return sendResponse(response, 404, "Address not found");
        }

        return sendResponse(response, 200, result);
    });
};