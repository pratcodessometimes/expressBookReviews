const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Customer already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
  return res.status(404).json({ message: "Book not found" });
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const matchedBooks = [];
  for (const [isbn, book] of Object.entries(books)) {
    if (book.author.toLowerCase() === author) {
      matchedBooks.push({ isbn, ...book });
    }
  }
  if (matchedBooks.length > 0) {
    return res.status(200).json(matchedBooks);
  }
  return res.status(404).json({ message: "No books found for this author" });
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const matchedBooks = [];
  for (const [isbn, book] of Object.entries(books)) {
    if (book.title.toLowerCase() === title) {
      matchedBooks.push({ isbn, ...book });
    }
  }
  if (matchedBooks.length > 0) {
    return res.status(200).json(matchedBooks);
  }
  return res.status(404).json({ message: "No books found with this title" });
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

// Task 10: Get all books using async/await with Axios
public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 11: Get book details by ISBN using Promises
public_users.get('/async/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => res.status(200).json(response.data))
    .catch((error) => res.status(404).json({ message: error.message }));
});

// Task 12: Get book details by Author using Promises
public_users.get('/async/author/:author', function (req, res) {
  const author = req.params.author;
  axios.get(`http://localhost:5000/author/${author}`)
    .then((response) => res.status(200).json(response.data))
    .catch((error) => res.status(404).json({ message: error.message }));
});

// Task 13: Get book details by Title using Promises
public_users.get('/async/title/:title', function (req, res) {
  const title = req.params.title;
  axios.get(`http://localhost:5000/title/${title}`)
    .then((response) => res.status(200).json(response.data))
    .catch((error) => res.status(404).json({ message: error.message }));
});

module.exports.general = public_users;