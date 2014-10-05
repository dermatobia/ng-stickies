/* global app:true */
'use strict';

/**
 * @ngdoc overview
 * @name stickiesApp
 * @description
 * # stickiesApp
 *
 * Main module of the application.
 */
var app = angular.module('stickiesApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'firebase'
]);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'BoardsCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.constant('FIREBASE_URL', 'https://ng-stickies.firebaseio.com/');