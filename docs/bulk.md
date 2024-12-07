## **Bulk Requests in MongoDB**

### **Learning Objectives**
1. **Understand Bulk Operations**:
   - Learn how to perform multiple database operations efficiently in MongoDB.
2. **Implement Bulk Write Requests**:
   - Use MongoDB's `bulkWrite` method for inserts, updates, deletions, and more.
3. **Optimize Performance**:
   - Explore best practices for executing bulk operations in a scalable and efficient manner.

---

### **1. What Are Bulk Requests?**

Bulk requests allow you to perform multiple operations (e.g., inserts, updates, deletes) in a single database command. These are particularly useful when dealing with large datasets or batch processing tasks.

#### **1.1 Benefits of Bulk Operations**
- **Efficiency**:
  - Reduces the number of round-trips between the application and the database.
- **Atomicity**:
  - Bulk operations are atomic at the individual operation level (each operation succeeds or fails independently).
- **Performance**:
  - Optimized for handling large volumes of data with reduced overhead.

#### **1.2 Use Cases**
- Importing large datasets.
- Updating multiple records based on specific conditions.
- Deleting outdated or irrelevant data.
- Performing batch updates in e-commerce systems (e.g., inventory adjustments).

---

### **2. Bulk Write Operations in MongoDB**

MongoDB’s `bulkWrite` method allows you to perform the following operations in bulk:
1. **Insert** (`insertOne`).
2. **Update** (`updateOne`, `updateMany`).
3. **Delete** (`deleteOne`, `deleteMany`).
4. **Replace** (`replaceOne`).

#### **2.1 Syntax**

```javascript
db.collection.bulkWrite(
  [
    { operationType: { options } }, // Example: { insertOne: { document } }
    { operationType: { options } }, // Example: { updateOne: { filter, update } }
    ...
  ],
  { ordered: true } // Optional: Determines whether operations are executed sequentially
);
```

- **`operationType`**: The type of operation (`insertOne`, `updateOne`, etc.).
- **`options`**: Parameters for the operation (e.g., filter conditions, update documents).
- **`ordered`**: If `true`, stops execution on the first error; if `false`, continues despite errors.

---

### **3. Examples of Bulk Write Operations**

#### **3.1 Bulk Insert**
Insert multiple documents into the collection in one operation.

```javascript
const bulkInsert = async () => {
  const products = [
    { name: "Product A", price: 100 },
    { name: "Product B", price: 200 },
    { name: "Product C", price: 300 }
  ];

  const result = await Product.bulkWrite(
    products.map(product => ({ insertOne: { document: product } }))
  );

  console.log(`${result.insertedCount} products inserted.`);
};
```

---

#### **3.2 Bulk Update**
Update multiple documents based on specific conditions.

**Example: Update Stock for Multiple Products**
```javascript
const bulkUpdate = async () => {
  const updates = [
    { filter: { name: "Product A" }, update: { $set: { stock: 50 } } },
    { filter: { name: "Product B" }, update: { $set: { stock: 30 } } }
  ];

  const result = await Product.bulkWrite(
    updates.map(update => ({ updateOne: { filter: update.filter, update: update.update } }))
  );

  console.log(`${result.modifiedCount} products updated.`);
};
```

---

#### **3.3 Bulk Delete**
Delete multiple documents in a single operation.

**Example: Remove Outdated Products**
```javascript
const bulkDelete = async () => {
  const productsToDelete = ["Product X", "Product Y"];

  const result = await Product.bulkWrite(
    productsToDelete.map(name => ({ deleteOne: { filter: { name } } }))
  );

  console.log(`${result.deletedCount} products deleted.`);
};
```

---

#### **3.4 Mixed Bulk Operations**
Combine different operations in a single `bulkWrite` request.

**Example: Insert, Update, and Delete**
```javascript
const bulkMixed = async () => {
  const result = await Product.bulkWrite([
    { insertOne: { document: { name: "Product D", price: 400 } } },
    { updateOne: { filter: { name: "Product A" }, update: { $set: { price: 120 } } } },
    { deleteOne: { filter: { name: "Product C" } } }
  ]);

  console.log(`
    Inserted: ${result.insertedCount}, 
    Updated: ${result.modifiedCount}, 
    Deleted: ${result.deletedCount}
  `);
};
```

---

### **4. Best Practices for Bulk Operations**

#### **4.1 Optimize Batch Sizes**
- Limit the number of operations in a single `bulkWrite` request (e.g., 500-1000 operations per batch) to avoid overwhelming the database.

#### **4.2 Use `unordered` for Resilience**
- If the order of operations doesn’t matter, set `ordered: false` to ensure the entire batch is executed even if some operations fail.

**Example**:
```javascript
await Product.bulkWrite(operations, { ordered: false });
```

#### **4.3 Leverage Indexes**
- Ensure indexed fields are used in filter conditions for efficient updates and deletions.

#### **4.4 Monitor Performance**
- Use the `explain()` method to analyze query performance and adjust operations accordingly.

**Example**:
```javascript
db.products.bulkWrite([...]).explain();
```

---

### **5. Error Handling in Bulk Operations**

Handle errors gracefully to ensure robust bulk operations.

#### **5.1 Log Errors**
Log errors for failed operations to diagnose issues.

**Example**:
```javascript
try {
  const result = await Product.bulkWrite(operations);
  console.log("Bulk operation successful:", result);
} catch (error) {
  console.error("Bulk operation failed:", error);
}
```

#### **5.2 Use `writeErrors`**
MongoDB returns a `writeErrors` array for failed operations.

**Example**:
```javascript
const result = await Product.bulkWrite(operations, { ordered: false });
if (result.writeErrors.length > 0) {
  console.error("Errors in bulk operation:", result.writeErrors);
}
```

---

### **6. Bulk Operations and Transactions**

Combine bulk operations with transactions for ACID compliance when modifying multiple collections.

**Example**:
```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  await Product.bulkWrite(
    [
      { insertOne: { document: { name: "Product E", price: 500 } } },
      { updateOne: { filter: { name: "Product A" }, update: { $set: { stock: 20 } } } }
    ],
    { session }
  );

  await session.commitTransaction();
  console.log("Bulk transaction completed successfully.");
} catch (error) {
  await session.abortTransaction();
  console.error("Transaction failed:", error);
} finally {
  session.endSession();
}
```

---

### **Summary**

1. **Bulk Write Operations**:
   - Use `bulkWrite` for efficient batch processing (insert, update, delete).
   - Combine multiple operations into a single command for better performance.

2. **Best Practices**:
   - Limit batch sizes, use `unordered` mode when applicable, and leverage indexes for performance.

3. **Error Handling**:
   - Log errors and use `writeErrors` for diagnosing failed operations.

4. **Transactions**:
   - Combine bulk operations with transactions for ACID compliance in multi-collection updates.
