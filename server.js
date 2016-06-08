var express = require('express');
var app = express();
var apiRouter = express.Router();
var adminRouter = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var debug = require('debug')('overbrook:server');
var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/dev';
debug('mongoURI ' + mongoURI); 
var origin =   process.env.ORIGIN || 'http://localhost:8080';

var cors = require('cors');

mongoose.connect(mongoURI);

require('./routes/email-route')(apiRouter);
require('./routes/addHomes-route')(apiRouter);

var corsOptions = {
  origin: origin
};

app.use(cors(corsOptions));

//app.use((req, res, next) => {
//  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
//  res.header('Access-Control-Allow-Headers', 'Content-Type, token, authorization');
//  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//  next();
//});

app.use(bodyParser.json());
app.use('/', apiRouter);



app.listen(process.env.PORT || 3000, function() {
  console.log('Server started on port 3000');
});
