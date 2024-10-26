## **Week 1: Comprehensive Guide to Web Basics, Project Setup, Authentication, and Environment Variables**

### **Objective:**
By the end of this week, you will:
1. Understand core web protocols, HTTP methods, and standards like REST and SOAP.
2. Set up a Node.js project with environment variables, routing, and server creation.
3. Learn about middlewares, models, and implement user authentication using **bcrypt** for password encryption and **JWT (JSON Web Tokens)**.
4. Understand different authentication methods and the reasoning behind using JWT and REST.

---

### **1. Web Protocol Basics**

Before diving into the project setup, it's crucial to understand the basic protocols and methods used in modern web applications.

#### **1.1 Internet Protocols**

There are various internet protocols that form the backbone of communication between clients and servers. Here are some examples:
- **HTTP (Hypertext Transfer Protocol)**: Protocol for transferring hypertext (webpages, API data) between clients and servers.
- **HTTPS**: Secure version of HTTP that encrypts the data transferred between client and server.
- **FTP (File Transfer Protocol)**: Used for transferring files between a client and server.
- **SMTP (Simple Mail Transfer Protocol)**: Used for sending emails between servers.
- **DNS (Domain Name System)**: Translates domain names (like google.com) into IP addresses that computers use to locate each other.

---

#### **1.2 HTTP Methods and the Request-Response Cycle**

The most common protocol used in web development is **HTTP**, which operates in a **request-response** cycle.

**HTTP Methods** are used by clients to indicate what action they want to perform on the server:
- **GET**: Retrieve data from the server (e.g., getting a webpage or API data).
- **POST**: Send new data to the server (e.g., submitting a form, creating a new record).
- **PUT**: Update existing data on the server (e.g., updating user information).
- **DELETE**: Remove data from the server.

**Example of Request-Response:**
1. **Request**: The client (browser or app) sends a request to the server with the following:
   - **Method** (GET, POST, etc.)
   - **URL** (e.g., `/api/products`)
   - **Headers** (e.g., Authorization token, content type)
   - **Body** (data, such as user login details in a POST request)

2. **Response**: The server processes the request and sends back:
   - **Status Code** (e.g., 200 OK, 404 Not Found)
   - **Headers** (content type, cache control)
   - **Body** (data like HTML or JSON)

---

#### **1.3 REST vs. SOAP: Why Choose REST?**

**REST (Representational State Transfer)** and **SOAP (Simple Object Access Protocol)** are two popular standards for web services. Here’s a comparison:

**REST**:
- **Uses HTTP** as the protocol.
- Works with JSON, XML, or plain text.
- Follows a stateless architecture, meaning each request from the client contains all the information the server needs to fulfill that request.
- Easier to use, lightweight, and commonly used for web APIs (like Google, Facebook, etc.).

**SOAP**:
- Can work over various protocols like HTTP, SMTP, and more.
- Always works with XML.
- Includes built-in error handling.
- More complex and heavyweight than REST.

**Why Choose REST?**
- **Simplicity**: REST APIs are easy to use and understand, with clear HTTP methods (GET, POST, etc.).
- **Efficiency**: REST is lightweight and faster, as it doesn’t have the overhead of complex XML processing.
- **Widespread Use**: Most modern web services, like those provided by Google, Twitter, and Facebook, are REST-based, making it the industry standard for building APIs.

---

### **2. Node.js Project Setup**

Now that we have covered the basics of web communication, let's set up a Node.js project. This will be the foundation of your app for all subsequent weeks.

#### **2.1 Initialize Node.js Project**
1. Create a folder for your project (e.g., `app`) and navigate into the `src` directory where all source code will reside:
   ```bash
   mkdir -p app/src
   cd app/src
   npm init -y
   ```

   This initializes a new Node.js project and creates a `package.json` file.

#### **2.2 Install Dependencies**
Install the required packages:
```bash
npm install express jsonwebtoken bcryptjs body-parser dotenv
```
- **express**: A web framework for building HTTP servers and routing.
- **jsonwebtoken (JWT)**: For handling authentication tokens.
- **bcryptjs**: To securely hash and compare passwords.
- **body-parser**: To parse incoming request data, especially JSON.
- **dotenv**: Loads environment variables from `.env` files into your Node.js application.

---

### **3. Project Structure**

We’ll organize the project in a modular way, separating concerns like routing, business logic (controllers), middlewares, and configurations. Here's the initial structure we will build upon:

```
app/
├── src/
│   ├── controllers/      # Logic like user authentication
│   ├── routes/           # Defines API routes (e.g., /auth)
│   ├── middlewares/      # Reusable functions for authentication checks
│   ├── config/           # Environment variables and config files
│   ├── models/           # (For databases, added in later weeks)
│   ├── index.js          # Main entry point for starting the app
│   └── .env              # Stores sensitive info like JWT secret
├── node_modules/         # Installed dependencies
├── package.json          # Project metadata and dependencies
└── .gitignore            # Specifies files to ignore in Git (e.g., node_modules)
```

---

### **4. Environment Variables with dotenv**

**What are Environment Variables?**
- **Environment variables** are used to store sensitive data such as API keys, database credentials, and secrets, outside the source code.

**Why Use dotenv?**
- **dotenv** is a package that allows us to store these variables in a `.env` file and load them into our application via `process.env`. This keeps sensitive information like your **JWT secret** out of your source code.

#### **Steps:**
1. **Create a `.env` file** in the `src/` directory:
   ```bash
   touch .env
   ```

2. **Add Environment Variables**:
   - In Week 1, you need a **JWT secret** and the server’s **port**:
     ```
     PORT=3000
     JWT_SECRET=mysecretkey
     ``

### **4.1 Loading Environment Variables in Node.js**

Now that we have created the `.env` file with environment variables, let’s load them into our application using the **dotenv** package.

1. **Modify `index.js` to load environment variables**:
   - In `src/index.js`, add the following code:
     ```javascript
     const express = require('express');
     const dotenv = require('dotenv');

     // Load environment variables from .env file
     dotenv.config();

     const app = express();
     const PORT = process.env.PORT || 3000;

     app.use(express.json()); // Middleware to parse incoming JSON requests

     // Basic route for testing
     app.get('/', (req, res) => {
       res.json({ message: 'Welcome to Week 1 Setup' });
     });

     app.listen(PORT, () => {
       console.log(`Server running on http://localhost:${PORT}`);
     });
     ```

2. **Explanation:**
   - **dotenv.config()** loads environment variables from the `.env` file and makes them accessible through `process.env`.
   - `process.env.PORT` reads the `PORT` value from `.env`. If it's not set, the app defaults to port 3000.
   - `process.env.JWT_SECRET` will be used later in your authentication logic to sign and verify JSON Web Tokens.

---

### **5. Middlewares in Express.js**

**What are Middlewares?**
- Middlewares are functions that have access to the **request** object (`req`), the **response** object (`res`), and the next middleware function in the application's request-response cycle.
- Middlewares can be used for:
  - Logging
  - Authenticating users
  - Handling errors
  - Parsing request bodies

#### **Example of a Middleware:**
In Week 1, we will use middleware to parse incoming JSON requests and, in later weeks, we’ll create custom middlewares for things like JWT authentication.

1. **In `index.js`**, we have:
   ```javascript
   app.use(express.json());
   ```
   - This built-in middleware parses incoming JSON data so we can access it via `req.body`.

2. **Custom Authentication Middleware (for later weeks)**:
   - You can create middleware to verify JWT tokens for protected routes, but we’ll expand on this in later weeks. Here’s an example of how it might look:
     ```javascript
     const jwt = require('jsonwebtoken');

     const authenticateJWT = (req, res, next) => {
       const token = req.header('Authorization');

       if (!token) {
         return res.status(401).json({ message: 'Access Denied. No token provided.' });
       }

       try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         req.user = decoded; // Attach user info to request object
         next(); // Move to the next middleware or route handler
       } catch (err) {
         res.status(400).json({ message: 'Invalid token.' });
       }
     };

     module.exports = authenticateJWT;
     ```
   - This middleware will be used later when securing routes.

---

### **6. Models: Preparing for Databases**

**What are Models?**
- In a real-world application, models are used to interact with databases. A **model** defines the structure of the data and provides methods to query the database (for example, creating, updating, or retrieving users).

Although we won’t be using databases in Week 1, it’s important to set up a structure for future weeks when we introduce MongoDB or PostgreSQL.

1. **Create a `models/` folder** inside the `src/` directory.
2. **In later weeks**, we will create models like `User.js` that define user data, methods for saving it to a database, and validating inputs.

---

### **7. Authentication: JWT and Other Methods**

**What is JWT (JSON Web Token)?**
- JWT is a compact, URL-safe token used for securely transmitting information between two parties (client and server) as a JSON object. It's commonly used for **authentication**.
- A JWT contains:
  - **Header**: Contains metadata like the signing algorithm (e.g., HS256).
  - **Payload**: Contains the claims (user data) being transmitted.
  - **Signature**: Created using a secret key and ensures the token hasn’t been tampered with.

#### **Why Choose JWT?**
1. **Stateless**: Unlike traditional sessions, JWT tokens don’t need to be stored on the server. The client stores the token (e.g., in localStorage or cookies) and sends it with each request.
2. **Security**: JWT tokens are signed using a secret key, ensuring that the token hasn’t been altered.
3. **Decentralized Authentication**: JWT can be used across different services and APIs (microservices) because the token is self-contained and includes user information.

**Other Authentication Methods:**
1. **Session-based Authentication**:
   - Stores a session on the server side and provides a session ID to the client via cookies.
   - Requires maintaining state on the server, which makes it less scalable than JWT.

2. **OAuth**:
   - A widely used protocol for **delegated authorization**. For example, logging into a third-party site using your Google or Facebook credentials.
   - OAuth allows access without revealing user credentials to the service, by providing access tokens.

---

### **8. Implementing JWT-based Authentication**

In Week 1, we’ll implement user registration and login using **bcrypt** for password hashing and **JWT** for token-based authentication.

#### **8.1 Define Authentication Routes**
1. **Create `routes/auth.js`** in the `src/` folder:
   ```javascript
   const express = require('express');
   const router = express.Router();
   const authController = require('../controllers/authController');

   // Register route
   router.post('/register', authController.register);

   // Login route
   router.post('/login', authController.login);

   module.exports = router;
   ```

2. In **`index.js`**, link this route:
   ```javascript
   const authRoutes = require('./routes/auth');
   app.use('/auth', authRoutes);
   ```

#### **8.2 Create Authentication Logic**
1. **Create `controllers/authController.js`** in the `src/` folder:
   ```javascript
   const bcrypt = require('bcryptjs');
   const jwt = require('jsonwebtoken');

   // Temporary storage for users
   let users = [];

   const JWT_SECRET = process.env.JWT_SECRET;

   // Register a new user
   exports.register = async (req, res) => {
     const { username, password } = req.body;

     // Hash the password before storing it
     const hashedPassword = await bcrypt.hash(password, 10);

     // Save user
     users.push({ username, password: hashedPassword });

     res.json({ message: 'User registered successfully!' });
   };

   // Login a user
   exports.login = async (req, res) => {
     const { username, password } = req.body;

     // Find user
     const user = users.find(u => u.username === username);
     if (!user) {
       return res.status(400).json({ message: 'User not found!' });
     }

     // Compare password
     const isMatch = await bcrypt.compare(password, user.password);
     if (!isMatch) {
       return res.status(400).json({ message: 'Invalid password!' });
     }

     // Generate a JWT
     const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

     res.json({ message: 'Login successful!', token });
   };
   ```

#### **8.3 Testing the API**

- Use **Postman** or **cURL** to test the endpoints:
   - **Register a new user**: POST to `/auth/register` with a JSON body:
     ```json
     {
       "username": "testuser",
       "password": "testpassword"
     }
     ```

   - **Login a user**: POST to `/auth/login` with the same credentials. You should receive a JWT token in the response.

---

### **9. Encryption with bcrypt**

**What is bcrypt?**
- bcrypt is a hashing function designed to be slow, making it difficult for attackers to perform brute-force attacks.
- **bcrypt.hash(password, 10)** generates a hash of the password with a salt of 10 rounds.
- **bcrypt.compare(password, hashedPassword)** checks whether a provided password matches the hashed password.

**Why Use bcrypt?**
- It ensures passwords are stored securely. Even if an attacker gains access to your database, they cannot easily retrieve the original passwords.

---

### **Summary of Week 1**

1. **Web Protocols**: Learn about HTTP, request-response cycle, HTTP methods, and standards like REST.
2. **Node.js Setup**: Initialize a Node.js project and set up routing with Express.
3. **Environment Variables**: Store sensitive information like JWT secrets using **dotenv**.
4. **Middlewares**: Understand how to use built-in and custom middlewares for parsing requests and authentication.
5. **JWT Authentication**: Implement user registration and login using bcrypt and JWT.
6. **Encryption**: Use bcrypt to securely hash and compare passwords.

---
