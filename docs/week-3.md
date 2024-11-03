## **Week 3: Comprehensive Guide to Product, Category, Attribute Rule Management, and Middleware Validation**

### **Learning Objectives**
1. **Design and Implement Product and Category Models**:
   - Build flexible models with Mongoose to accommodate category-specific attributes.
2. **Implement Full CRUD Operations**:
   - Develop complete RESTful APIs for products, categories, and attribute rules.
3. **Data Validation with Middleware**:
   - Enforce category-specific attribute validation using middleware.
4. **API Versioning and Swagger Documentation**:
   - Create versioned and well-documented APIs.
5. **Data Model Diagrams and Explanations**:
   - Visualize model relationships and understand data modeling strategies.

---

### **1. Data Modeling Strategies**

**Objective**: Design flexible and maintainable data models for different product types and category-specific attributes.

#### **1.1 Relational vs. Non-Relational Data Models**

- **Relational Databases (e.g., PostgreSQL)**:
  - **Structure**: Data is stored in normalized tables with foreign keys.
  - **Pros**: Ensures data consistency and supports complex queries.
  - **Cons**: Rigid schemas make adapting to varied or changing data difficult.

- **Non-Relational Databases (e.g., MongoDB)**:
  - **Structure**: Data is stored in collections with flexible document schemas.
  - **Pros**: Supports dynamic schemas, making it suitable for projects with diverse data types.
  - **Cons**: Requires careful data management to maintain consistency.

**Approach for Product Modeling**:
- **Embedding**: Embed category-specific data directly in the product document for fast read access.
- **Referencing**: Reference related data using `ObjectId` for better normalization and relationship management.

#### **1.2 Using `extraAttributes` for Flexibility**

**Challenge**: Products from different categories need shared attributes (e.g., `name`, `price`) and unique category-specific fields (e.g., `size` for clothing, `warranty` for electronics).

**Solution**: Use an `extraAttributes` field in the `Product` model to handle category-specific data.

**Benefits**:
- **Scalability**: Easily supports new product categories.
- **Simplicity**: Reduces schema changes when new attributes are added.

**Considerations**:
- **Validation**: Custom logic is required to validate category-specific attributes.
- **Consistency**: Ensure data consistency with controlled validation logic.

### **2. Data Model Diagrams**

```
+-----------------+      +-----------------+
|   Product       |      |   Category      |
|-----------------|      |-----------------|
| _id             |----->| _id             |
| name            |      | name            |
| price           |      | description     |
| description     |      | createdAt       |
| category (ref)  |      +-----------------+
| extraAttributes |
| createdAt       |      +-----------------+     
| updatedAt       |<---->| AttributeRule   |
+-----------------+      |-----------------|
                         | categoryName    |
                         | requiredAttrs   |
                         | optionalAttrs   |
                         | createdAt       |
                         +-----------------+
```

**Explanation**:
- **Product** references **Category** via the `category` field.
- **AttributeRule** specifies the required and optional attributes for each category, linked through `categoryName`.

---

### **3. Data Models**

#### **3.1 Product Model (`Product.js`)**

```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  extraAttributes: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
```

#### **3.2 Category Model (`Category.js`)**

```javascript
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now }
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
```

#### **3.3 AttributeRule Model (`AttributeRule.js`)**

```javascript
const mongoose = require('mongoose');

const attributeRuleSchema = new mongoose.Schema({
  categoryName: { type: String, required: true, unique: true },
  requiredAttributes: [{ type: String }],
  optionalAttributes: [{ type: String }]
});

const AttributeRule = mongoose.model('AttributeRule', attributeRuleSchema);
module.exports = AttributeRule;
```

---

### **4. Controllers**

#### **4.1 Product Controller (`productController.js`)**

```javascript
const Product = require('../models/Product');
const Category = require('../models/Category');
const AttributeRule = require('../models/AttributeRule');

// Create a new product
exports.addProduct = async (req, res) => {
  try {
    const { name, price, description, category, extraAttributes } = req.body;

    const product = new Product({ name, price, description, category, extraAttributes });
    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description, extraAttributes, category } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description, extraAttributes, category },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
```

#### **4.2 Category Controller (`categoryController.js`)**

```javascript
const Category = require('../models/Category');

// Create a new category
exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error });
  }
};

// Update a category by ID
exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message:

 'Category not found' });
    }
    res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error });
  }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error });
  }
};
```

#### **4.3 AttributeRule Controller (`attributeRuleController.js`)**

```javascript
const AttributeRule = require('../models/AttributeRule');

// Create or update an attribute rule
exports.addOrUpdateAttributeRule = async (req, res) => {
  try {
    const { categoryName, requiredAttributes, optionalAttributes } = req.body;

    const updatedRule = await AttributeRule.findOneAndUpdate(
      { categoryName },
      { requiredAttributes, optionalAttributes },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Attribute rule added/updated successfully', rule: updatedRule });
  } catch (error) {
    res.status(500).json({ message: 'Error adding/updating attribute rule', error });
  }
};

// Get all attribute rules
exports.getAllAttributeRules = async (req, res) => {
  try {
    const rules = await AttributeRule.find();
    res.status(200).json(rules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attribute rules', error });
  }
};

// Get an attribute rule by category name
exports.getAttributeRuleByCategory = async (req, res) => {
  try {
    const rule = await AttributeRule.findOne({ categoryName: req.params.categoryName });
    if (!rule) {
      return res.status(404).json({ message: 'Attribute rule not found' });
    }
    res.status(200).json(rule);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attribute rule', error });
  }
};

// Delete an attribute rule by category name
exports.deleteAttributeRule = async (req, res) => {
  try {
    const deletedRule = await AttributeRule.findOneAndDelete({ categoryName: req.params.categoryName });
    if (!deletedRule) {
      return res.status(404).json({ message: 'Attribute rule not found' });
    }
    res.status(200).json({ message: 'Attribute rule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting attribute rule', error });
  }
};
```

---

### **5. Middleware for Category Rule Validation**

**`checkCategoryRules.js` (Middleware)**:
```javascript
const Category = require('../models/Category');
const AttributeRule = require('../models/AttributeRule');

const checkCategoryRules = async (req, res, next) => {
  try {
    const { category, extraAttributes } = req.body;

    // Fetch category details
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Fetch attribute rules for the category
    const attributeRules = await AttributeRule.findOne({ categoryName: categoryDetails.name.toLowerCase() });
    if (attributeRules) {
      const { requiredAttributes } = attributeRules;

      // Check for missing required attributes
      const missingRequiredAttributes = requiredAttributes.filter(attr => !(attr in extraAttributes));
      if (missingRequiredAttributes.length > 0) {
        return res.status(400).json({
          message: `Missing required attributes for ${categoryDetails.name}: ${missingRequiredAttributes.join(', ')}`
        });
      }
    }

    // Proceed to the next middleware or route handler if validation passes
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking category rules', error });
  }
};

module.exports = checkCategoryRules;
```

---

### **6. Routing Setup**

**Updated Routing Setup**:

#### **6.1 Product Routes (`productRoutes.js`)**

```javascript
const router = require('express').Router();
const productController = require('../controllers/productController');
const checkCategoryRules = require('../middlewares/checkCategoryRules');

router.post('/', checkCategoryRules, productController.addProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', checkCategoryRules, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
```

#### **6.2 Category Routes (`categoryRoutes.js`)**

```javascript
const router = require('express').Router();
const categoryController = require('../controllers/categoryController');

router.post('/', categoryController.addCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
```

#### **6.3 AttributeRule Routes (`attributeRuleRoutes.js`)**

```javascript
const router = require('express').Router();
const attributeRuleController = require('../controllers/attributeRuleController');

router.post('/', attributeRuleController.addOrUpdateAttributeRule);
router.get('/', attributeRuleController.getAllAttributeRules);
router.get('/:categoryName', attributeRuleController.getAttributeRuleByCategory);
router.delete('/:categoryName', attributeRuleController.deleteAttributeRule);

module.exports = router;
```

---

### **7. Full Project Folder Structure**

```
/project-root
│
├── /src
│   ├── /models
│   │   ├── Product.js                # Product model
│   │   ├── Category.js               # Category model
│   │   ├── AttributeRule.js          # Attribute rule model
│   │   └── User.js                   # User model
│   ├── /controllers
│   │   ├── productController.js      # Product controller
│   │   ├── categoryController.js     # Category controller
│   │   ├── attributeRuleController.js # Attribute rule controller
│   │   └── authController.js         # Auth controller for user authentication
│   ├── /middlewares
│   │   └── checkCategoryRules.js     # Middleware for validating category rules
│   ├── /routes
│   │   ├── productRoutes.js          # Product routes
│   │   ├── categoryRoutes.js         # Category routes
│   │   ├── attributeRuleRoutes.js    # Attribute rule routes
│   │   ├── userRoutes.js             # User routes (optional)
│   │   ├── authRoutes.js             # Authentication routes
│   │   └── index.js                  # Central file to import and register all routes
│   ├── index.js                      # Main server entry point
│   └── .env                          # Environment variables
```

---

---
---
# update structure

### **/routes Directory Structure and Explanation**

```
/routes
│   ├── productRoutes.js          # Routes for product-related operations
│   ├── categoryRoutes.js         # Routes for category management
│   ├── attributeRuleRoutes.js    # Routes for attribute rule management
│   ├── userRoutes.js             # Routes for user management (optional)
│   ├── authRoutes.js             # Routes for authentication (register, login)
│   └── index.js                  # Central file to import and register all routes
```

### **Explanation of Each File**

- **`productRoutes.js`**: Contains routes for CRUD operations on products.
- **`categoryRoutes.js`**: Contains routes for CRUD operations on categories.
- **`attributeRuleRoutes.js`**: Contains routes for managing attribute rules for categories.
- **`userRoutes.js`**: Optional; includes routes for user management, such as user profile and other user-specific actions.
- **`authRoutes.js`**: Contains routes for user authentication, such as login and registration.
- **`index.js`**: Central file for importing and registering all routes, which is then used in the main server file.

### **Content of `/routes/index.js`**

**`index.js` (Routes Index File)**:
```javascript
const express = require('express');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const attributeRuleRoutes = require('./attributeRuleRoutes');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes'); // Include if user routes are used

const router = express.Router();

// Register individual route files with base paths
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/attribute-rules', attributeRuleRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes); // Register if applicable

module.exports = router;
```

### **Main Server Entry (`index.js`)**

**`index.js` (Main Server File)**:
```javascript
const express = require('express');
const routes = require('./src/routes'); // Import the centralized route index
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Register all routes under the '/api' path
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

---

### **Key Benefits of This Structure**

- **Modular Routing**: Each route file handles a specific aspect of the application, making the codebase easier to maintain.
- **Centralized Registration**: The `index.js` file in `/routes` centralizes route registration, simplifying route management and ensuring consistency.
- **Scalability**: This structure allows for easy addition of new features or routes without cluttering the main server file.

This comprehensive folder structure ensures a clean, maintainable, and scalable codebase.


---
---

# Middleware

### **1. Middleware in Express**

Middleware functions in Express are functions that have access to the request (`req`), response (`res`), and next middleware function (`next`). Middleware can execute any code, make changes to `req` and `res`, end the request-response cycle, and call the `next()` function to pass control to the next middleware or route handler.

### **2. Types of Middleware Usage**

- **Global Middleware**: Applied to all incoming requests.
- **Route-Specific Middleware**: Applied only to specific routes.

### **Example of Using Middleware**

Assume we have a middleware function called `checkCategoryRules` in `checkCategoryRules.js` that validates whether the `extraAttributes` in a request match the rules for a specific category.

#### **Middleware Function (`checkCategoryRules.js`)**

```javascript
const Category = require('../models/Category');
const AttributeRule = require('../models/AttributeRule');

const checkCategoryRules = async (req, res, next) => {
  try {
    const { category, extraAttributes } = req.body;

    // Fetch category details
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Fetch attribute rules for the category
    const attributeRules = await AttributeRule.findOne({ categoryName: categoryDetails.name.toLowerCase() });
    if (attributeRules) {
      const { requiredAttributes } = attributeRules;

      // Check for missing required attributes
      const missingRequiredAttributes = requiredAttributes.filter(attr => !(attr in extraAttributes));
      if (missingRequiredAttributes.length > 0) {
        return res.status(400).json({
          message: `Missing required attributes for ${categoryDetails.name}: ${missingRequiredAttributes.join(', ')}`
        });
      }
    }

    // Proceed to the next middleware or route handler if validation passes
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking category rules', error });
  }
};

module.exports = checkCategoryRules;
```

### **3. Applying Middleware to Routes**

#### **1. Route-Specific Middleware**

Apply the middleware directly to specific routes by passing it as an argument to the route method.

**Example in `productRoutes.js`**:
```javascript
const router = require('express').Router();
const productController = require('../controllers/productController');
const checkCategoryRules = require('../middlewares/checkCategoryRules');

// Apply middleware to the POST and PUT routes
router.post('/', checkCategoryRules, productController.addProduct);
router.put('/:id', checkCategoryRules, productController.updateProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
```

#### **2. Global Middleware**

Apply middleware globally to all routes in your Express app using `app.use()` in your `index.js` file.

**Example in `index.js` (Main Server File)**:
```javascript
const express = require('express');
const routes = require('./src/routes'); // Import the centralized route index
const checkCategoryRules = require('./src/middlewares/checkCategoryRules'); // Import middleware
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Apply global middleware to all routes if needed
app.use(checkCategoryRules); // This applies `checkCategoryRules` to all routes (not common for specific validation)

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

### **4. Applying Middleware Conditionally**

You can also apply middleware conditionally based on specific criteria within the route handler.

**Example**:
```javascript
router.post('/', (req, res, next) => {
  if (req.body.category) {
    return checkCategoryRules(req, res, next);
  }
  next();
}, productController.addProduct);
```

### **Best Practices for Using Middleware**

- **Keep Middleware Modular**: Create reusable middleware functions in separate files and import them as needed.
- **Order Matters**: The order of middleware registration is important. Global middleware applied before specific route handlers will run for every request.
- **Use Next**: Always call `next()` to ensure the request is passed to the next middleware or route handler unless you end the response in the middleware.
- **Error Handling**: Middleware can be used for centralized error handling. Custom error-handling middleware takes four arguments (`err, req, res, next`) and is placed at the end of the middleware stack.

This structure helps ensure that your middleware is applied efficiently, modularly, and logically, enhancing your application's maintainability and functionality.