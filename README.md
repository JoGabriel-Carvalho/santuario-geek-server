# Santuario Geek - Server

This is the backend server for the Santuario Geek project, a modern and complex e-commerce specializing in geek products. This server is developed in Node.js and utilizes the Express.js framework to create a RESTful API. It integrates with a MySQL database to store user information, products, orders, and other entities related to the e-commerce.

## Features

- User registration and authentication
- Product navigation and search
- Detailed product display
- Shopping cart and checkout
- Order management
- Payment integration
- Inventory and product management

## Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher) or Yarn
- MySQL (v5.7 or higher)

## Installation

1. Clone the server repository:

git clone https://github.com/JoGabriel-Carvalho/santuario-geek-server.git


2. Install project dependencies:

cd santuario-geek-server
npm install


3. Configure environment variables:

Rename the `.env.example` file to `.env` and configure the necessary environment variables, such as database credentials.


4. Start the server:

npm start


5. The server will be available at `http://localhost:5000`.

## Project Structure

- `api/`: Contains API controllers and routes.
- `database/`: Contains data models and database configuration.
- `middlewares/`: Contains custom middlewares for the application.
- `utils/`: Contains reusable utility functions.
- `server.js`: Entry point of the server.

## Contribution

Contributions are welcome! If you find an issue or have an improvement suggestion, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
