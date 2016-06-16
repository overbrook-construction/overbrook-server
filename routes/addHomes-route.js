'use strict';

var multer = require('multer');
var AWS = require('aws-sdk');
var User = require(__dirname + '/../models/user');
var basicHTTP = require(__dirname + '/../lib/basic_http')
var jwtAuth = require(__dirname + '/../lib/jwt_auth');
var House = require(__dirname + '/../models/house-models');
var del = require('del');
var fs = require('fs');

module.exports = (apiRouter) => {
  apiRouter.route('/userLogin')
  .get(basicHTTP, (req, res) => {
  User.findOne({username: req.basicHTTP.username}, (err, user) => {
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

var uploaded = __dirname + '/../uploads'

// ADD PICTURE ROUTE !!!!!!
  apiRouter.route('/picUpload')
  .post((req, res) => {
    var houseId = req.body.name
    var housePrefix = req.body.housePrefix

      fs.readdir(uploaded, (err, files) => {
        if (err) throw err;
        var dir = './uploads/';
        var newHome = 'newHome';
        var count = 0;
        files.map((file) => {
          count ++;
          var newName = housePrefix + '-' + count.toString() + '.jpg';
          fs.renameSync('./uploads/' + file, dir + newName);
            var path = './uploads/' + newName;
            var bodyStream = fs.createReadStream(path);

            var s3 = new AWS.S3();
            var params = {
              Bucket: 'overbrook-images',
              Key: newName,
              ACL: 'public-read-write',
              Body: bodyStream,
              ContentEncoding: 'base64',
              ContentLength: bodyStream.length
            }

            s3.putObject(params, function(err, data) {
              if (err) console.log(err, err.stack);
              res.end();
            });
            var urlParams = {
              Bucket: 'overbrook-images',
              Key: newName
            };
            var saveUrl;
            s3.getSignedUrl('putObject', urlParams, (err, url) => {
              var tempUrl = url;
              var splitAt;
              function getUrl(url) {
                for (var i = 0; i < url.length; i++) {
                  if (url[i] == '?') {
                    saveUrl = url.substring(0, i);
                  }
                }
                console.log('save url is : ', saveUrl);
                return saveUrl
              }
              getUrl(url)
            })
            House.findByIdAndUpdate({_id: houseId}, {$push: {pics: saveUrl}}, (err, house) => {
              if (err) throw err;
            })
        })
        del(['./uploads/*', '!uploads/']).then(paths => {
	         console.log('Deleted files and folders:\n', paths.join('\n'));
         });
      })
      res.end();
  })

// ROUTE FOR ADDITIONAL USERS IN LATER USE CASES
  // apiRouter.route('/addUser')
  // .post((req, res) => {
  //   var newUser = new User()
  //   console.log('SIGN UP HAS BEEN HIT WITH : ', req.body.username)
  //   newUser.username = req.body.username || req.body.email
  //   newUser.email = req.body.email
  //   newUser.password = req.body.password
  //   newUser.save((err, data) => {
  //     console.log('ERROR WHILE SAVING USER ', err)
  //     var token = data.generateToken()
  //     res.status(200).json({token: token})
  //   })
  // })


  apiRouter.route('/addHomes')
  .post(jwtAuth, (req, res) => {
    var newHouse = new House(req.body);
    newHouse.save((err, house) => {
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
  .put(jwtAuth, (req, res) => {
    House.findByIdAndUpdate({_id: req.params.id}, req.body, (err, person) => {
      if (err) throw err;
      res.json(req.body);
    })
  })
  .delete(jwtAuth, (req, res) => {
    House.findById(req.params.id, (err, house) => {
      if (err) throw err;
      house.remove((err, house) => {
        res.json(house);
      })
    })
  })

  apiRouter.route('/addPics')
  .post(jwtAuth, (req, res) => {
    var body = [];
    req.on('data', function(chunk) {
      body.push(chunk)
    }).on('end', function() {
      body = Buffer.concat(body).toString();


      var s3 = new AWS.S3();
      var params = {
        Bucket: 'overbrook-images',
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
