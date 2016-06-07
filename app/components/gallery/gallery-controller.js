'use strict';

require(__dirname + '/../../ajax-service/data-service');

angular.module('GalleryModule', ['AjaxService'])
  .controller('GalleryController', ['$location', 'ajax', '$window', function($location, ajax, $window) {

    var vm = this;
    vm.houseData;
    // var data = ajax.allHomeData;
    var data;


  vm.getData = function() {
    if ($window.localStorage){
      var yup = JSON.parse($window.localStorage.getItem('allHomeData'));
      console.log('YUP IS : ', yup);
      data = yup
    }
    else {

    ajax.getData();
    vm.houseData = ajax.allHomeData;
  }
}

  vm.showInfo = false;


  vm.clickedHomePicArray = [];
  vm.clickedAddress = [];
  // vm.homePicArray = clickedHomePicArray;


  vm.showSideCompleted = function(clickedValue){
    vm.clickedHomePicArray = [];
    vm.clickedAddress = [];
    for (var key in data) {
      var obj = data[key];
      if(obj.status === clickedValue) {
        vm.clickedHomePicArray.push(obj);
        vm.clickedAddress.push(obj);
      }
    }
    // geoFunc(vm.clickedAddress, iconValue)
  }



  vm.changeStateFalse = function(){
    // console.log('CHANGE STATE IS BEING HIT');
    vm.showInfo = false;
  }

  vm.changeStateTrue = function() {
    vm.showInfo = true;
  }

  vm.singleHomeData = {};

    vm.showInfoView = function() {
      $location.path('/info');
    }

    vm.runSingleData = function(id) {
      console.log('RUN SINLE DATA HIT FROM MAP CTRL WITH : ', id)
      vm.singleHouseDataLoader(id);
    }

    vm.singleHouseDataLoader = function(id){
      var singleHomeData = {};
      for (var key in data) {
        console.log("FIXES ARE WORKING AS PLANNED !!!!!");
        var obj = data[key]
        if (data[key]._id == id) {
          // console.log('THIS IS THE MATCHING OBJECT', obj);
          vm.singleHomeData.address = obj.address;
          vm.singleHomeData.sqft = obj.sqft;
          vm.singleHomeData.bedrooms = obj.bedrooms;
          vm.singleHomeData.bathrooms = obj.bathrooms;
          vm.singleHomeData.lotsize = obj.lotsize;
          vm.singleHomeData.schooldistrict = obj.schooldistrict;
          vm.singleHomeData.elementary = obj.elementary;
          vm.singleHomeData.middle = obj.middle;
          vm.singleHomeData.hs = obj.hs;
          vm.singleHomeData.status = obj.status;
          vm.singleHomeData.pics = obj.pics;
          vm.singleHomeData.mapPic = obj.pics[obj.pics.length-1];
          vm.singleHomeData.frontPic = obj.pics[0];
        }
      }
    }
  }])

// USE A FACTORY OR SERVICE TO TRANSFER THE OBJECT BETWEEN THE GALLERY AND INFO VIEWS BASED ON CLICKED HOMES

// .factory('HomeFactory', function() {
//
//   this.singleHouseDataLoader = function(id){
//     console.log('ID SENT FROM VIEW : ', id + ' singleHomeDataLoader is called');
//     var singleHomeData = {};
//     for (var key in data) {
//       var obj = data[key]
//       if (data[key]._id == id) {
//         // console.log('THIS IS THE MATCHING OBJECT', obj);
//         singleHomeData.address = obj.address;
//         singleHomeData.sqft = obj.sqft;
//         singleHomeData.bedrooms = obj.bedrooms;
//         singleHomeData.bathrooms = obj.bathrooms;
//         singleHomeData.lotsize = obj.lotsize;
//         singleHomeData.schooldistrict = obj.schooldistrict;
//         singleHomeData.elementary = obj.elementary;
//         singleHomeData.middle = obj.middle;
//         singleHomeData.hs = obj.hs;
//         singleHomeData.status = obj.status;
//         singleHomeData.pics = obj.pics;
//         singleHomeData.mapPic = obj.pics[obj.pics.length-1];
//         singleHomeData.frontPic = obj.pics[0];
//       }
//     }
//   }
//   return singleHomeData
// })
