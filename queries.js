const { MongoClient } = require('mongodb');
//Connection URI
const uri ="mongodb://localhost:27017/"; // Local MongoDB

// Database and collection names
const dbName = 'plp_bookstore';
const collectionName = 'books';

async function main() {
  const client = new MongoClient(uri); // connecting to MongoDB
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB server');

    // Get database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // BASIC CRUD OPERATIONS
    // Fetch all Fantasy books
    const fantasyBooks = await collection.find({genre: "Fantasy"}).toArray();
    console.log('Fantasy books in the collection:');
    fantasyBooks.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author} (${book.published_year})`);
    });
    // Fetch books by George Orwell
        orwellBooks = await collection.find({author: "George Orwell"}).toArray();
        console.log('Books by George Orwell:');
        orwellBooks.forEach((book, index) => {
            console.log(`${index + 1}. "${book.title}" by ${book.author} (${book.published_year})`);
        })

    // Fetch books after 1945
        recentBooks = await collection.aggregate([
            {$match:{published_year: {$gt: 1945}}}
        ]).toArray();
        console.log('Books published after 1945:', recentBooks);
      
    // Update the price of the book
        const result = await collection.updateOne({ title: "The Hobbit"}, {$set: {price: 17.99}});
        console.log(`Updated ${result.modifiedCount} document(s)`);

    // Delete a book by title
    const deleteBook = await collection.deleteOne({title: "The Alchemist"});
    console.log(`Deleted ${deleteBook.deletedCount} document(s)`);

    //ADVANCED QUERIES
    //Find books that are both in stock and published after 2010
    const recentInStock = await collection.aggregate([
        {$match: {in_stock: true, published_year: {$gt: 2010}}}
    ]).toArray();
    //await collection.find({in_stock: true, published_year: {$gt: 2010}}).toArray();
    console.log('Books that are in stock and published after 2010:', recentInStock);
    
    // Project only the title, author, and price fields
    const projectedBooks = await collection.aggregate([
        {$project: {title: 1, author: 1, price: 1, _id: 0}}
    ]).toArray();
    console.log('Books with only title, author, and price fields:', projectedBooks);

    // Implement sorting to display books by price (both ascending and descending)
    // Ascending
    const booksByPriceAsc = await collection.aggregate([
        { $sort: { price: 1}}
    ]).toArray();
    console.log('Books sorted by price (ascending):', booksByPriceAsc);
   
    // Descending
    const booksByPriceDesc = await collection.aggregate([
        { $sort: { price: -1}}
    ]).toArray();
    console.log('Books sorted by price (descending):', booksByPriceDesc);

    // Use the limit and skip methods to implement pagination (5 books per page)
    const page = 1; // Change this value to get different pages
    const booksPerPage = 5;
    const pagiatedBooks = await collection.find().sort({title:1}).skip((page - 1) * booksPerPage).limit(booksPerPage).toArray();
    console.log(`Books on page ${page}:`, pagiatedBooks);
    //AGGREGATION PIPELINE
    // Average book price by genre
    const booksByGenre = await collection.aggregate([
        {$match: {genre: "Fiction"}},
        {$group: {_id: "$genre", avgPrice: {$avg: "$price"}}}
    ]).toArray();
    console.log('Average book price by genre:', booksByGenre);
    // Author with the most books
    const mostBooksAuthor = await collection.aggregate([
        {$group: {_id: "$author", totalBooks: {$sum: 1}}},
        {$sort: {totalBooks: -1}},
        {$limit: 1}
    ]).toArray();
    console.log('Author with the most books:', mostBooksAuthor)

    // Group books by publication decade
    const bookByDecade = await collection.aggregate([
        {$project: {decade: {$subtract:["$published_year", {$mod: ["$published_year", 10]}]}, title: 1}},
        {$group: {_id: "$decade", totalSum: {$sum: 1}, books: {$push: "$title"}}},
        {$sort: {_id: 1}}
    ]).toArray();
    console.log('Books grouped by publication decade:', bookByDecade)
    // Indexing for performance optimization
    await collection.createIndex({title: 1});
    console.log('Index created on title field');
    // Compound index on author and published_year
    await collection.createIndex({author:1, published_year: 1});
    console.log('Compound index created on author and published_year fields');
    // explain query execution plan
    const explainStats = await collection.find({title: "1984"}).explain("executionStats");
    console.log('Query execution plan for finding book by title "1984" after indexing:', explainStats);
    const explainStats2 = await collection.find({author: "George Orwell", published_year: 1949}).explain("executionStats");
    console.log('Query execution plan for finding books by George Orwell published in 1949 after indexing:', explainStats2);
  }
    catch (err) {
    console.error('Error occurred:', err);
    } finally {
    // Close the connection
    await client.close();
    console.log('Connection closed');
  }
}

main().catch(console.error);