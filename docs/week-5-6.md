## **Week 4: Managing Transactions, Shopping Cart, and Product Search**

### **Learning Objectives**
1. **MongoDB Transactions and ACID Compliance**:
   - Understand how MongoDB supports transactions and manage data consistency.
2. **User Shopping Cart Management**:
   - Implement data persistence using sessions and cookies for shopping cart management.
3. **Search and Filtering of Products**:
   - Implement efficient search and filtering mechanisms with indexing and search algorithms.

---

### **1. MongoDB Transactions and ACID Compliance**

#### **1.1 MongoDB Transactions**

MongoDB supports **ACID transactions** in replica sets (v4.0+) and sharded clusters (v4.2+). ACID transactions allow for multi-document operations, ensuring consistency, isolation, and durability.

**ACID Compliance**:
- **A**: Atomicity — Ensures that a group of operations are all completed or none at all.
- **C**: Consistency — Ensures that data is valid and in the correct state before and after the transaction.
- **I**: Isolation — Ensures that transactions are isolated from one another, preventing conflicts.
- **D**: Durability — Ensures that changes made by a transaction are permanent, even in the case of a failure.

#### **1.2 Example: Using MongoDB Transactions**

In a typical e-commerce scenario, you need a transaction when a user makes a purchase — updating both the **Inventory** and **Order** collections.

```javascript
const mongoose = require('mongoose');
const session = await mongoose.startSession();

session.startTransaction();
try {
  // Example: Deduct inventory and create an order

  const product = await Product.findById(productId).session(session);
  if (product.inventory.inStock < quantity) {
    throw new Error("Insufficient stock");
  }

  product.inventory.inStock -= quantity;
  await product.save({ session });

  const order = new Order({
    user: userId,
    items: [{ product: productId, quantity }],
    status: "Pending",
    totalAmount: product.price * quantity
  });
  await order.save({ session });

  await session.commitTransaction();
  res.status(200).json({ message: 'Order placed successfully!' });
} catch (error) {
  await session.abortTransaction();
  res.status(500).json({ message: error.message });
} finally {
  session.endSession();
}
```

- **Start a session**: MongoDB transaction starts with `startSession()`.
- **Commit or Abort**: If operations are successful, commit the transaction. If any error occurs, abort the transaction.

#### **1.3 MongoDB Transaction Limitations**
- Transactions are most useful when you need to maintain consistency across **multiple documents**.
- **Performance**: Transactions can incur overhead. Avoid long-running transactions.
  
---

### **2. Managing a User’s Shopping Cart (Data Persistence)**

#### **2.1 Using Sessions and Cookies for Cart Persistence**

Sessions and cookies are commonly used to maintain a user's shopping cart state across multiple HTTP requests.

- **Session**: Stores cart data server-side.
- **Cookie**: Stores cart data client-side (less secure, limited in size).

#### **2.2 Example: Storing Cart in Session**

When a user adds items to their cart, you store the cart in the server's session (using `express-session` for Node.js).

1. **Install Express Session**:
   ```bash
   npm install express-session
   ```

2. **Setup Session Middleware**:
   ```javascript
   const session = require('express-session');

   app.use(session({
     secret: 'secret-key',
     resave: false,
     saveUninitialized: true
   }));
   ```

3. **Add Item to Cart (Session)**:
   ```javascript
   app.post('/add-to-cart', (req, res) => {
     const { productId, quantity } = req.body;
     if (!req.session.cart) {
       req.session.cart = [];
     }
     const product = { productId, quantity };
     req.session.cart.push(product);
     res.status(200).json({ message: 'Item added to cart!' });
   });
   ```

#### **2.3 Storing Cart in Cookies**

For persistent shopping carts across sessions, you can store the cart in cookies.

1. **Setting a Cookie**:
   ```javascript
   app.post('/add-to-cart', (req, res) => {
     const { productId, quantity } = req.body;
     let cart = req.cookies.cart || [];
     cart.push({ productId, quantity });
     res.cookie('cart', cart, { maxAge: 900000, httpOnly: true });
     res.status(200).json({ message: 'Item added to cart!' });
   });
   ```

2. **Retrieving Cart from Cookie**:
   ```javascript
   app.get('/cart', (req, res) => {
     const cart = req.cookies.cart || [];
     res.status(200).json(cart);
   });
   ```

---

### **3. Search and Filter Products**

#### **3.1 Search Products Using MongoDB Indexing**

Indexing is essential for efficient querying in a large product database, especially for e-commerce sites with thousands of products.

- **Creating an Index**:
  MongoDB allows you to create indexes on fields to improve search performance. For example, create an index on the `name` field for fast product searches.

  ```javascript
  const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
  });

  // Create an index on the name field
  productSchema.index({ name: 'text' });

  const Product = mongoose.model('Product', productSchema);
  ```

#### **3.2 Example: Searching for Products**

- **Search by Product Name** (using text search index):
  ```javascript
  app.get('/search', async (req, res) => {
    const query = req.query.q; // Query parameter for product name
    const products = await Product.find({ $text: { $search: query } });
    res.status(200).json(products);
  });
  ```

#### **3.3 Filtering Products with Multiple Criteria**

You can combine filtering by different criteria (e.g., price, category, availability).

- **Example: Price Range and Category Filtering**:
  ```javascript
  app.get('/products', async (req, res) => {
    const { minPrice, maxPrice, category } = req.query;
    const query = {};

    if (minPrice) query.price = { $gte: minPrice };
    if (maxPrice) query.price = { $lte: maxPrice };
    if (category) query.category = category;

    const products = await Product.find(query);
    res.status(200).json(products);
  });
  ```

#### **3.4 Search Algorithms**

In complex e-commerce scenarios, you may want to implement more advanced search algorithms, such as:

1. **Fuzzy Search**:
   - Use a package like `fuzzysearch` for more flexible matching.
2. **Relevance Ranking**:
   - Use **text indexing** combined with scoring (e.g., full-text search with weights for fields).

---

### **Summary of Key Concepts**

1. **MongoDB Transactions**:
   - MongoDB supports **multi-document ACID transactions**, ideal for e-commerce operations like purchase and inventory updates.
   - Use **`startSession()`** and **`commitTransaction()`** for handling transactions in MongoDB.

2. **Shopping Cart Management**:
   - Use **sessions** or **cookies** to persist user shopping cart data across requests.
   - **Sessions** store data on the server side, while **cookies** store data on the client side.

3. **Search and Filter**:
   - Implement efficient **text indexing** for product searches.
   - Combine **range queries** (e.g., price, rating) and **category filters** for enhanced product discovery.

4. **Search Algorithms**:
   - Implement advanced search algorithms, including **fuzzy search** and **relevance scoring**.
