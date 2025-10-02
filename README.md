# PLP Bookstore - MongoDB Database Project

A comprehensive MongoDB database project demonstrating CRUD operations, advanced queries, aggregation pipelines, and performance optimization techniques for a bookstore application.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Structure](#database-structure)
- [Project Files](#project-files)
- [Features](#features)
- [Usage](#usage)
- [Query Examples](#query-examples)
- [Performance Optimization](#performance-optimization)

## Overview

This project implements a bookstore database using MongoDB, showcasing various database operations including:

- Basic CRUD (Create, Read, Update, Delete) operations
- Advanced querying with filtering and projection
- Sorting and pagination
- Aggregation pipelines
- Index creation for performance optimization
- Query execution plan analysis

## Prerequisites

Before running this project, ensure you have the following installed:

- Node.js (v12 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm (Node Package Manager)

## Installation

1. Clone or download this project to your local machine

2. Install the required dependencies:
```bash
npm install mongodb
```

3. Update the MongoDB connection URI in both files:
```javascript
const uri = 'your-mongodb-connection-string-here';
```

## Database Structure

**Database Name:** `plp_bookstore`  
**Collection Name:** `books`

### Book Schema

Each book document contains the following fields:

```javascript
{
  title: String,           // Book title
  author: String,          // Author name
  genre: String,           // Book genre
  published_year: Number,  // Year of publication
  price: Number,           // Price in USD
  in_stock: Boolean,       // Availability status
  pages: Number,           // Number of pages
  publisher: String        // Publisher name
}
```

## Project Files

### 1. `insert_books.js`

Initial setup script that:
- Connects to MongoDB
- Creates the database and collection
- Populates the collection with 12 sample books
- Drops existing collection if it already contains data

**Sample Books Include:**
- Classic fiction (To Kill a Mockingbird, 1984, The Great Gatsby)
- Fantasy (The Hobbit, The Lord of the Rings)
- Dystopian (Brave New World, Animal Farm)
- Romance (Pride and Prejudice)
- And more...

### 2. `main.js`

Main application file demonstrating:
- Basic CRUD operations
- Advanced queries
- Aggregation pipelines
- Index creation and performance analysis

## Features

### Basic CRUD Operations

1. **Read Operations**
   - Fetch books by genre (Fantasy)
   - Fetch books by author (George Orwell)
   - Fetch books published after a specific year (1945)

2. **Update Operations**
   - Update book price by title

3. **Delete Operations**
   - Delete book by title

### Advanced Queries

1. **Filtering**
   - Find books that are both in stock AND published after 2010
   
2. **Projection**
   - Display only specific fields (title, author, price)

3. **Sorting**
   - Sort books by price (ascending and descending)

4. **Pagination**
   - Implement pagination with configurable page size (5 books per page)

### Aggregation Pipeline

1. **Average Price by Genre**
   - Calculate average book price for Fiction genre

2. **Author Statistics**
   - Find the author with the most books in the collection

3. **Group by Decade**
   - Group books by publication decade with book counts

### Performance Optimization

1. **Single Field Index**
   - Index on `title` field for faster title searches

2. **Compound Index**
   - Composite index on `author` and `published_year` fields

3. **Query Analysis**
   - Execution plan analysis for indexed queries

## Usage

### Step 1: Populate the Database

Run the insert script first to set up the database:

```bash
node insert_books.js
```

Expected output:
```
Connected to MongoDB server
12 books were successfully inserted into the database
Inserted books:
1. "To Kill a Mockingbird" by Harper Lee (1960)
2. "1984" by George Orwell (1949)
...
Connection closed
```

### Step 2: Run the Main Application

Execute the main script to perform all operations:

```bash
node main.js
```

This will run through all CRUD operations, queries, aggregations, and indexing operations.

## Query Examples

### Find Books by Genre
```javascript
const fantasyBooks = await collection.find({genre: "Fantasy"}).toArray();
```

### Find Books with Multiple Conditions
```javascript
const recentInStock = await collection.aggregate([
    {$match: {in_stock: true, published_year: {$gt: 2010}}}
]).toArray();
```

### Sort Books by Price
```javascript
// Ascending
const booksByPriceAsc = await collection.aggregate([
    { $sort: { price: 1 }}
]).toArray();

// Descending
const booksByPriceDesc = await collection.aggregate([
    { $sort: { price: -1 }}
]).toArray();
```

### Pagination
```javascript
const page = 1;
const booksPerPage = 5;
const paginatedBooks = await collection.find()
    .sort({title: 1})
    .skip((page - 1) * booksPerPage)
    .limit(booksPerPage)
    .toArray();
```

### Average Price by Genre
```javascript
const avgPrice = await collection.aggregate([
    {$match: {genre: "Fiction"}},
    {$group: {_id: "$genre", avgPrice: {$avg: "$price"}}}
]).toArray();
```

### Author with Most Books
```javascript
const mostBooksAuthor = await collection.aggregate([
    {$group: {_id: "$author", totalBooks: {$sum: 1}}},
    {$sort: {totalBooks: -1}},
    {$limit: 1}
]).toArray();
```

### Group by Decade
```javascript
const bookByDecade = await collection.aggregate([
    {$project: {
        decade: {$subtract: ["$published_year", {$mod: ["$published_year", 10]}]}, 
        title: 1
    }},
    {$group: {_id: "$decade", totalSum: {$sum: 1}, books: {$push: "$title"}}},
    {$sort: {_id: 1}}
]).toArray();
```

## Performance Optimization

### Creating Indexes

```javascript
// Single field index
await collection.createIndex({title: 1});

// Compound index
await collection.createIndex({author: 1, published_year: 1});
```

### Analyzing Query Performance

```javascript
const explainStats = await collection.find({title: "1984"})
    .explain("executionStats");
```

The execution stats provide insights into:
- Number of documents scanned
- Index usage
- Query execution time
- Winning plan details

## Common MongoDB Queries

Here are some additional queries you can try in MongoDB Shell:

```javascript
// Find all books
db.books.find()

// Find books by specific author
db.books.find({ author: "George Orwell" })

// Find books published after 1950
db.books.find({ published_year: { $gt: 1950 } })

// Find books in a specific genre
db.books.find({ genre: "Fiction" })

// Find in-stock books
db.books.find({ in_stock: true })

// Find books within a price range
db.books.find({ price: { $gte: 10, $lte: 15 } })
```

## Error Handling

Both scripts include comprehensive error handling:

```javascript
try {
    // Database operations
} catch (err) {
    console.error('Error occurred:', err);
} finally {
    await client.close();
    console.log('Connection closed');
}
```

## Notes

- The connection URI contains credentials. In production, use environment variables.
- The insert script drops the collection if it already exists to ensure clean data.
- All queries use async/await for better error handling and code readability.
- Indexes improve query performance but should be created based on actual query patterns.

## License

This project is created for educational purposes as part of the PLP curriculum.

## Contributing

Feel free to fork this project and submit pull requests for any improvements.
