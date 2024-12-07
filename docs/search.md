## **Search Algorithms for E-commerce**

### **Learning Objectives**
1. **Understand Search Algorithms**:
   - Learn the principles behind search algorithms for structured and unstructured data.
2. **Explore Advanced Search Techniques**:
   - Implement advanced search features like fuzzy search, relevance ranking, and faceted search.
3. **Optimize Product Search**:
   - Leverage indexing, query optimization, and algorithmic strategies to improve search efficiency.
4. **Scalable Search Systems**:
   - Integrate external search engines (like Elasticsearch) for large-scale applications.

---

### **1. Search Basics**

#### **1.1 What is a Search Algorithm?**
A search algorithm retrieves information from a data store (like MongoDB) based on query parameters. E-commerce search algorithms often need to handle:
- **Exact Matches**: Retrieve products by name or ID.
- **Partial Matches**: Handle queries like "Smar" for "Smartphone."
- **Complex Filters**: Combine multiple filters like price range, category, and stock.
- **Relevance Scoring**: Rank results based on query relevance.

#### **1.2 Key Components of a Search System**
1. **Indexing**: Preprocess data to create indexes for fast lookups.
2. **Query Parsing**: Process user input to match indexed fields.
3. **Ranking**: Assign relevance scores to results.
4. **Faceted Search**: Allow filtering by attributes like brand, price, or rating.

---

### **2. MongoDB-Based Search**

#### **2.1 Text Indexing**
MongoDB provides a built-in text search feature for efficient queries on textual data.

**Creating a Text Index**:
```javascript
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});

// Add a text index for full-text search
productSchema.index({ name: 'text', description: 'text' });
const Product = mongoose.model('Product', productSchema);
```

**Querying with Text Search**:
```javascript
app.get('/search', async (req, res) => {
  const query = req.query.q; // User query
  const products = await Product.find({ $text: { $search: query } });
  res.status(200).json(products);
});
```

#### **2.2 Sorting by Relevance**
When performing a text search, MongoDB automatically includes a **relevance score** (`$meta: "textScore"`) that you can use for sorting.

**Example**:
```javascript
const products = await Product.find(
  { $text: { $search: query } },
  { score: { $meta: "textScore" } } // Include relevance score
).sort({ score: { $meta: "textScore" } }); // Sort by score
```

---

### **3. Advanced Search Algorithms**

#### **3.1 Fuzzy Search**
Handles queries with typos or partial matches.

**Implementation with `fuzzysearch`**:
```javascript
const fuzzysearch = require('fuzzysearch');

app.get('/fuzzy-search', async (req, res) => {
  const query = req.query.q.toLowerCase();
  const products = await Product.find();
  const filtered = products.filter(product => fuzzysearch(query, product.name.toLowerCase()));
  res.status(200).json(filtered);
});
```

**MongoDB Alternative with Regular Expressions**:
```javascript
const products = await Product.find({ name: { $regex: query, $options: 'i' } });
```

---

#### **3.2 Relevance Ranking**
Assign scores to search results based on multiple factors, such as:
- **Exact Match**: Higher weight for exact name matches.
- **Partial Match**: Medium weight for partial matches.
- **Category or Tags**: Boost results from popular categories.

**Example Relevance Scoring**:
```javascript
app.get('/ranked-search', async (req, res) => {
  const query = req.query.q;
  const products = await Product.find({
    $text: { $search: query }
  }, {
    score: { $meta: "textScore" }
  });

  // Adjust scores based on additional logic
  const ranked = products.map(product => ({
    ...product._doc,
    finalScore: product.score + (product.popularity || 0) // Boost popular products
  })).sort((a, b) => b.finalScore - a.finalScore); // Sort by final score

  res.status(200).json(ranked);
});
```

---

#### **3.3 Faceted Search**
Allows filtering products by attributes like price range, brand, or color.

**Aggregation Query for Faceted Search**:
```javascript
const filters = [
  { price: { $gte: 100, $lte: 500 } },
  { category: "Electronics" }
];

const products = await Product.aggregate([
  { $match: { $and: filters } }, // Apply filters
  {
    $facet: {
      byBrand: [{ $group: { _id: "$brand", count: { $sum: 1 } } }],
      byPriceRange: [{ $group: { _id: "$price", count: { $sum: 1 } } }],
      results: [{ $project: { name: 1, price: 1 } }]
    }
  }
]);
res.status(200).json(products);
```

---

### **4. Optimizing Search Performance**

#### **4.1 Leveraging Indexing**
- Use **compound indexes** for queries involving multiple fields (e.g., `name` and `price`).
- Ensure **fields used in filters** (e.g., `price`, `category`) are indexed.

#### **4.2 Query Optimization**
- Use `$regex` sparingly for large datasets (prefer text indexes for full-text search).
- Avoid fetching unnecessary fields by using projections.

#### **4.3 External Search Engines**
For complex search requirements or large-scale applications, consider external search engines like **Elasticsearch** or **Algolia**.

**Elasticsearch Advantages**:
- Handles large-scale data efficiently.
- Supports advanced features like synonyms, autocomplete, and relevance tuning.

---

### **5. Scalable Search Features**

#### **5.1 Autocomplete**
Autocomplete improves user experience by suggesting relevant terms as the user types.

**Example**:
```javascript
app.get('/autocomplete', async (req, res) => {
  const query = req.query.q;
  const suggestions = await Product.find({ name: { $regex: `^${query}`, $options: 'i' } }, { name: 1 });
  res.status(200).json(suggestions);
});
```

#### **5.2 Synonym Handling**
Include synonyms in your search logic for better results:
- Maintain a **synonyms map** in your application.
- Expand user queries based on the map.

---

### **6. Search Algorithm Summary**

#### **Algorithms**:
1. **Exact Match**:
   - Use MongoDB's text indexes for fast lookups.
2. **Fuzzy Search**:
   - Handle typos and partial matches using regex or `fuzzysearch`.
3. **Relevance Ranking**:
   - Use scoring systems to rank results based on multiple factors.
4. **Faceted Search**:
   - Enable filtering by product attributes (e.g., price, brand).
5. **Autocomplete**:
   - Suggest terms as users type to enhance usability.

#### **Optimization Techniques**:
- Use proper indexing for fields involved in queries.
- Leverage aggregation pipelines for complex filters.
- Integrate external search engines for large-scale applications.
