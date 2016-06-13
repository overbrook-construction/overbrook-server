var express = require('express');
var app = express();
var apiRouter = express.Router();
var adminRouter = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var debug = require('debug')('overbrook:server');

var multer = require('multer');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    console.log('FILE FROM FILE NAME : ', file.originalname);
    cb(null, file.originalname)
  }
})






// var upload = multer({dest: './uploads'});

// PRODUCTION _________________
// var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/dev';

// STAGING ____________________
var mongoURI = 'mongodb://overbrook:overbrook425@ds011903.mlab.com:11903/overbrook-construction';

debug('mongoURI ' + mongoURI);
var origin =   process.env.ORIGIN || 'http://localhost:8080';

// var origin = 'https://overbrook-client.herokuapp.com'

var cors = require('cors');

mongoose.connect(mongoURI);

require('./routes/email-route')(apiRouter);
require('./routes/addHomes-route')(apiRouter);

var corsOptions = {
  origin: origin
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(multer({
  storage: storage
}).any());

/*
//WORKING PRIOR TO STORAGE - MULTER
app.use(multer({
  dest: './uploads'
}).any());
*/

app.use('/', apiRouter);



app.listen(process.env.PORT || 3000, function() {
  console.log('Server started on port 3000');
});
