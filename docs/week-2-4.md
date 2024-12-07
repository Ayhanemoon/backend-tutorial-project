## **Week 2-4: Full RESTful API with MongoDB, Mongoose, Versioning, Documentation, and Data Validation**

### **Objective**
By the end of this weeks, you will:
1. Set up MongoDB with Mongoose for data storage.
2. Implement a complete RESTful API for user management (Create, Read, Update, Delete).
3. Introduce API versioning to manage future changes.
4. Document the API using Swagger for interactive, detailed guidance.
5. Apply data validation using Joi to ensure data integrity.
6. Test all CRUD and authentication routes for functionality.

---

### **1. Choosing a Database: Why MongoDB and Mongoose?**

#### **1.1 Overview of Data Storage Options**

Selecting the right data storage solution is essential for building a scalable and maintainable application:

1. **SQL Databases (Relational)**:
   - **Examples**: MySQL, PostgreSQL.
   - **Structure**: Data is organized in tables with rows and columns.
   - **Relationships**: Uses foreign keys to link tables.
   - **Best For**: Applications that require complex queries, strict data integrity, and consistency.

2. **NoSQL Databases (Non-relational)**:
   - **Examples**: MongoDB, Cassandra, DynamoDB.
   - **Structure**: Stores data in flexible, JSON-like documents.
   - **Best For**: Large-scale applications with rapidly evolving schemas and high data volumes.

#### **1.2 Why MongoDB and Mongoose?**

1. **Flexible Schema**:
   - MongoDB’s document-based structure allows storing data in JSON-like objects without a fixed schema, which is advantageous for rapid development.

2. **Data Modeling with Mongoose**:
   - Mongoose is an ODM (Object Data Modeling) library that provides schemas and built-in validation, making it easy to handle CRUD operations with MongoDB.

3. **Scalability**:
   - MongoDB is designed for horizontal scaling, making it ideal for high-traffic applications.

---

### **2. Structuring the Project for a RESTful API**

Organizing the project in a modular structure makes it easy to maintain and scale.

#### **2.1 Folder Structure**

```
app/
├── src/
│   ├── config/           # Configuration (database connection)
│   ├── controllers/      
│   │   ├── authController.js    # Handles login and registration
│   │   └── userController.js    # Handles user CRUD operations
│   ├── middlewares/      # Middleware for validation and authentication
│   ├── models/           # Database models (User)
│   ├── routes/           
│   │   ├── auth.js       # Authentication routes (login, registration)
│   │   └── users.js      # User routes (CRUD)
│   ├── index.js          # Main server entry point
│   └── .env              # Environment variables (MongoDB URI, JWT secret)
├── node_modules/         # Installed dependencies
└── package.json          # Project metadata and dependencies
```

#### **2.2 Explanation of Each Part**

1. **config/**:
   - Centralizes configuration files, including database connections and environment variables.

2. **controllers/**:
   - Holds business logic for request handling. Separating controllers keeps route definitions simple and logical.

3. **middlewares/**:
   - Contains reusable middleware functions for validation, authentication, and error handling.

4. **models/**:
   - Defines Mongoose schemas, adding structure and validation to MongoDB collections.

5. **routes/**:
   - Defines routes for different resources, with separate files for `auth` (authentication) and `users` (CRUD operations).

---

### **3. Connecting MongoDB with Mongoose**

#### **3.1 Installing MongoDB and Mongoose**

1. **Install MongoDB** locally or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud-based hosting.
2. **Install Mongoose**:
   ```bash
   npm install mongoose
   ```

#### **3.2 Configuring MongoDB Connection**

1. **Add Database URI to `.env`**:
   - Update `.env` with MongoDB URI:
     ```
     MONGO_URI=mongodb://localhost:27017/your_database_name
     ```

2. **Connect to MongoDB in `index.js`**:
   - In `src/index.js`, set up Mongoose to connect to MongoDB:
     ```javascript
     const mongoose = require('mongoose');

     mongoose.connect(process.env.MONGO_URI, {
       useNewUrlParser: true,
       useUnifiedTopology: true
     })
     .then(() => console.log('Connected to MongoDB'))
     .catch(err => console.error('Could not connect to MongoDB', err));
     ```

---

### **4. Creating the User Model for CRUD Operations**

Define the User schema in `models/user.js`, specifying the structure and constraints for user data.

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
```

**Explanation**:
- **username** and **email** are required and unique identifiers.
- **password** is stored securely by hashing before saving.
- **createdAt** logs the date the user was created.

---

### **5. Implementing Full RESTful CRUD Operations in the User Controller**

Define each CRUD operation in `controllers/userController.js`.

```javascript
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Create a new user
exports.createUser = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  const { username, email } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};
```

---

### **6. RESTful User Routes**

Define RESTful routes for user management in `routes/users.js`.

```javascript
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User CRUD routes
router.post('/', userController.createUser);      // POST /users
router.get('/', userController.getAllUsers);      // GET /users
router.get('/:id', userController.getUserById);   // GET /users/:id
router.put('/:id', userController.updateUser);    // PUT /users/:id
router.delete('/:id', userController.deleteUser); // DELETE /users/:id

module.exports = router;
```

#### **Adding Route to `index.js`**
In `index.js`, add this route:
```javascript
const userRoutes = require('./routes/users');
app.use('/api/v1/users', userRoutes);
```

---

### **7. API Versioning**

**Why Version APIs?

**
- Versioning allows you to introduce changes without breaking existing functionality, maintaining **backward compatibility** for current clients.

#### **7.1 Common Versioning Approaches**

1. **URL Path Versioning**:
   - **Method**: Add the version number to the URL path (e.g., `/api/v1/users`).
   - **Advantages**: Clear and simple, easily identifiable.
   - **Example**:
     ```javascript
     app.use('/api/v1/users', userRoutes); // Versioned User routes
     app.use('/api/v1/auth', authRoutes);  // Versioned Auth routes
     ```

2. **Query Parameter Versioning**:
   - **Method**: Specify the version as a query parameter (e.g., `/api/users?version=1`).
   - **Advantages**: Dynamic but less clear than URL path versioning.

3. **Header-based Versioning**:
   - **Method**: Use custom headers for versioning.
   - **Advantages**: Keeps URLs clean but requires client handling of headers.

For this project, we use **URL Path Versioning** for simplicity.

---

### **8. Adding Swagger Documentation**

#### **8.1 Setting Up Swagger**

1. **Install Swagger dependencies**:
   ```bash
   npm install swagger-jsdoc swagger-ui-express
   ```

2. **Configure Swagger in `index.js`**:
   ```javascript
   const swaggerJsDoc = require('swagger-jsdoc');
   const swaggerUi = require('swagger-ui-express');

   const swaggerOptions = {
     swaggerDefinition: {
       openapi: '3.0.0',
       info: {
         title: 'User API',
         version: '1.0.0',
         description: 'API for managing users',
       },
     },
     apis: ['./src/routes/*.js'],
   };

   const swaggerDocs = swaggerJsDoc(swaggerOptions);
   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
   ```

3. **Access Documentation**:
   - Start the server and navigate to `/api-docs` for interactive documentation.

#### **8.2 Example Swagger Documentation for `/api/v1/users`**

```yaml
paths:
  /api/v1/users:
    post:
      summary: Create a new user
      tags:
        - Users
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                username:
                  type: string
                password:
                  type: string
                email:
                  type: string
              required:
                - username
                - password
                - email
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  user:
                    $ref: '#/components/schemas/User'
```

---

### **9. Data Validation with Joi**

#### **9.1 Setting Up Joi**

1. **Install Joi**:
   ```bash
   npm install joi
   ```

2. **Define Validation Rules in `middlewares/validate.js`**:
   ```javascript
   const Joi = require('joi');

   const registerSchema = Joi.object({
     username: Joi.string().min(3).required(),
     password: Joi.string().min(6).required(),
     email: Joi.string().email().required()
   });

   exports.validateRegistration = (req, res, next) => {
     const { error } = registerSchema.validate(req.body);
     if (error) return res.status(400).json({ message: error.details[0].message });
     next();
   };
   ```

3. **Apply Validation Middleware in Routes**:
   - In `routes/auth.js`, use `validateRegistration` to validate incoming registration data.

---

### **10. Testing CRUD and Auth Endpoints**

Use **Postman** or **cURL** to test each route:
1. **User CRUD**: POST `/users`, GET `/users`, GET `/users/:id`, PUT `/users/:id`, DELETE `/users/:id`.
2. **Auth**: POST `/auth/register`, POST `/auth/login`.



---
---

```
# CleanUp Your Application's Structure
```

---
---


### **Updated Application Structure with Swagger Documentation**

```
app/
├── src/
│   ├── config/           
│   │   ├── database.js        # Database connection setup
│   │   ├── swagger.js         # Swagger configuration file
│   ├── controllers/      
│   │   ├── authController.js  # Handles login and registration
│   │   └── userController.js  # Handles user CRUD operations
│   ├── middlewares/           # Joi validation, authentication
│   ├── models/                # Mongoose schema definitions
│   ├── routes/           
│   │   ├── auth.js            # Authentication routes (login, registration)
│   │   └── users.js           # User CRUD routes (API endpoints)
│   ├── index.js               # Main server entry point
│   └── .env                   # Environment variables (MongoDB URI, JWT secret)
├── node_modules/              # Installed dependencies
└── package.json               # Project metadata and dependencies
```

### **Adding Swagger Configuration**

1. **Create `swagger.js` in `config/`**:
   - In `src/config/swagger.js`, define the Swagger configuration options.

   ```javascript
   const swaggerJsDoc = require('swagger-jsdoc');

   const swaggerOptions = {
     swaggerDefinition: {
       openapi: '3.0.0',
       info: {
         title: 'User API',
         version: '1.0.0',
         description: 'API for managing users',
       },
       servers: [
         {
           url: '/api/v1',
           description: 'Version 1 API'
         }
       ]
     },
     apis: ['./src/routes/*.js'], // Path to the API docs in route files
   };

   const swaggerDocs = swaggerJsDoc(swaggerOptions);
   module.exports = swaggerDocs;
   ```

2. **Load Swagger Docs in `index.js`**:
   - In `src/index.js`, import the Swagger configuration and set up the Swagger UI route.

   ```javascript
   const swaggerUi = require('swagger-ui-express');
   const swaggerDocs = require('./config/swagger');

   // Swagger documentation route
   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
   ```

3. **Document Routes with Swagger Annotations**:
   - Add JSDoc-style annotations to routes for each endpoint in `routes/users.js` and `routes/auth.js`.

---

### **Example Swagger Annotations in `routes/users.js`**

In `routes/users.js`, use Swagger annotations to define each endpoint's documentation:

```javascript
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *               - email
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post('/', userController.createUser);
```