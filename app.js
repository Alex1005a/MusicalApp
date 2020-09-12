const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
const logger = require('morgan');
const formidable = require('express-formidable');

mongoose.promise = global.Promise;

const app = express();

app.use(formidable());
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'Secret', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

app.use(errorHandler());


//Configure Mongoose
mongoose.connect('mongodb://localhost/musicalApp');
mongoose.set('debug', true);

//Models & routes
require('./models/Compositions');
require('./models/Users');
require('./config/passport');
app.use(require('./routes'));

module.exports = app;
//app.listen(8000, () => console.log('Server running on http://localhost:8000/'));