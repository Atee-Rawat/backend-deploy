
# ERP Backend

This project is built using the **MERN Stack** and serves as the backend foundation for the ERP application.

## Prerequisites

Before starting, ensure that you have the following installed:

- **Node.js**: v18.17.0 or later  
- **npm**: v10.8.1 or later  
- **MongoDB**: Running locally or via a cloud service like MongoDB Atlas

## Setting Up the Project

Clone this repository to your local machine:

```bash
git clone https://github.com/your-repo/backend-project.git

 Navigate to the project directory:
```bash
cd rupin_erp_express_js_backend_main
```
Install dependencies:

```bash
npm install
```
Create a .env file in the root directory and configure the following environment variables:

```bash
MONGO_URI=mongodb://localhost:27017/your-database-name
PORT=5000
JWT_SECRET=your-secret-key
```
Replace your-database-name with the actual name of your MongoDB database. If you're using MongoDB Atlas, use the URI provided by Atlas.

Start the server:

```bash
npm start
```
## Dependencies

express – Fast, minimalist web framework for Node.js

mongoose – MongoDB ODM for managing schemas and database operations

dotenv – Load environment variables from .env

cors – Cross-Origin Resource Sharing support

jsonwebtoken – JWT-based authentication

bcrypt / bcryptjs – Password hashing

joi / joi-password-complexity – Schema validation

cookie-parser – Parse cookies from incoming requests

multer – File upload middleware

uuid – Generate unique identifiers

morgan – HTTP request logger

nodemon – Auto-restarts server during development

For the full list of dependencies, refer to package.json.



