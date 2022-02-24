const express = require('express')
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config()
const port = process.env.PORT || 5000;
const path = require('path')

const fs = require('fs');

const app = express();

const albumRouter = require('./api/routes/album');
// const orderRouter = require('./api/routes/order')
const userRouter = require('./api/routes/user')

// app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(express.json());

app.use(morgan('dev'));
  
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    res.setHeader('Access-Control-Allow-Headers', 
    'Origins, X-Requested-With, X-Auth-Token, Content-Type, Accept, authorization');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')

    next();
});

app.use('/albums', albumRouter)
// app.use('/orders', orderRouter)
app.use('/users', userRouter)


app.use((req, res, next) => {
   const error = new Error('Not Found');
   error.status = 404;
    throw error;
});

app.use((error, req, res, next) => {
    if (req.file) {
      fs.unlink(req.file.path, err => {
        console.log(err);
      });
    }
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
  });

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@toxxcluster.mzzr8.mongodb.net/${process.env.MONGODB_DATABASENAME}?retryWrites=true&w=majority`)

app.listen(port, (req, res) => { console.log(`working at ${port}`)})
