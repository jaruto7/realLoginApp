var express = require( 'express' );
var passport = require( 'passport' );
var GoogleStartegy = require( 'passport-google-oauth' ).OAuth2Strategy;
var config = require( './config' );
var app = express();
var googleProfile = {};