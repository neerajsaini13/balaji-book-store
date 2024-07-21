// getting-started.js
const mongoose = require('mongoose');
const Book = require('../models/Book');
const { sampleBooksData } = require('./script');


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://neerajkumartanwar32:balajiBookStoreNeeraj9799@balajibookstore.tlkhgdl.mongodb.net/?retryWrites=true&w=majority&appName=balajibookstore');
}

const addBooks = async () => {
    await Book.deleteMany()
    await Book.insertMany(sampleBooksData);
    console.log("book data initialized");
}

addBooks()