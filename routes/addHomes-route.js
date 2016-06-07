'use strict';

//require('dotenv');
var multer = require('multer');
var AWS = require('aws-sdk');
var User = require(__dirname + '/../models/user');
var basicHTTP = require(__dirname + '/../lib/basic_http')
var jwtAuth = require(__dirname + '/../lib/jwt_auth');
var House = require(__dirname + '/../models/house-models');

var fs = require('fs'),
    S3FS = require('s3fs'),
    s3fsImpl = new S3FS('overbrook-images', {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKe: process.env.AWS_SECRET_ACCESS_KEY
    })

module.exports = (apiRouter) => {
  apiRouter.route('/userLogin')
  .get(basicHTTP, (req, res) => {
  console.log('BASIC SENT BACK USERNAME ', req.basicHTTP.username)
  User.findOne({username: req.basicHTTP.username}, (err, user) => {
    console.log('SEARCHING FOR USERNAME !!!')
    if (err) {
      return res.status(401).json({msg: 'authenticat seyuzzz no!'})
    }
    if (!user) return res.status(401).json({msg: 'no seyzzz the authenticat'})
    var valid = user.compareHash(req.basicHTTP.password, user.password)
    if (!valid) {
      return res.status(401).json({msg: 'Auth failure'})
    }
    res.json({token: user.generateToken()})
  })
})

  apiRouter.route('/addUser')
  .post((req, res) => {
    var newUser = new User()
    console.log('SIGN UP HAS BEEN HIT WITH : ', req.body.username)
    newUser.username = req.body.username || req.body.email
    newUser.email = req.body.email
    newUser.password = req.body.password
    newUser.save((err, data) => {
      console.log('ERROR WHILE SAVING USER ', err)
      var token = data.generateToken()
      res.status(200).json({token: token})
    })
  })


  apiRouter.route('/addHomes')
  .post((req, res) => {
    var newHouse = new House(req.body);
    newHouse.save((err, house) => {
      console.log('NEWLY SAVED HOUSE IS : ', req.body.address);
      res.json(house);
    })
  })
  .get((req, res) => {
    House.find({}, (err, houses) => {
      if (err) throw err;
      res.json(houses);
    });
  })

  apiRouter.route('/addHomes/:id')
  .put((req, res) => {
    console.log('ADD HOMES PUT ROUTE HIT WITH : ', req.body);
    House.findByIdAndUpdate({_id: req.params.id}, req.body, (err, person) => {
      if (err) throw err;
      res.json(req.body);
    })
  })
  .delete((req, res) => {
    console.log('BACKEND HIT WITH : ', req.params.id);
    House.findById(req.params.id, (err, house) => {
      if (err) throw err;
      house.remove((err, house) => {
        res.json(house);
      })
    })
  })

  apiRouter.route('/addPics')
  .post((req, res) => {
    var body = [];
    req.on('data', function(chunk) {
      body.push(chunk)
    }).on('end', function() {
      console.log('JSON STRINGIFY BODY : ', JSON.stringify(body));
      body = Buffer.concat(body).toString();
      console.log('BODY IS : ', body);


      var s3 = new AWS.S3();
      var params = {
        Bucket: 'overbrook-images',
        // Key: process.env.AWS_ACCESS_KEY_ID,
        Key: 'h2432/testObjec',
        ACL: 'public-read-write',
        Body: JSON.stringify(body)
      }

      s3.putObject(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else     console.log('POSTING TO S3 WITH THIS DATA', data);
        res.json(data);
      });
    })
  })
}
