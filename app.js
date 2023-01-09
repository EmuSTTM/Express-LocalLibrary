var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog.js')

const compression = require("compression");
const helmet = require("helmet");

var app = express();

app.use(helmet()) // Proteje la paginas de vilnerabilidades conocidas

//Set up mongoose connection
const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Es para evitar un mensaje de advertencia que comenzó a dar desde la versión 7, pero no está en el tutorial

const dev_db_url = "mongodb://localhost:27017/"
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error: "))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// settings
app.use(logger('dev'));
app.use(express.json());  // Configuración del morgan
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// Compress, required to optimize the HTTP response speed 
app.use(compression())

// static Views
app.use(express.static(path.join(__dirname, 'public')));

// routers - connecting to routes/ <-- this folder is the "controller" of this proyect
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter); // añadimos las rutas catalog a la cadena de middlewares

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
