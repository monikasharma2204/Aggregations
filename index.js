// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const path = require('path');
// const os = require('os');
// const mongoose = require('mongoose');

// // connect to mongo DB 
// const mongoURI = 'mongodb+srv://diamond:qi4N6aQYaFayQFWM@cluster0.q80klw5.mongodb.net/yourDatabaseName';

// mongoose.connect(mongoURI)
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.log('MongoDB connection error:', err));


// //    mongodb+srv://diamond:qi4N6aQYaFayQFWM@cluster0.q80klw5.mongodb.net/

const connectAndGeneratePDF = require('./pdfGenerator');

connectAndGeneratePDF();
