#!/usr/bin/env nodejs

var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');
var db = mongoose.connect('mongodb://localhost:27017/data_bag', {useNewUrlParser: true, useUnifiedTopology: true});
var DataStore = require('./models/datastoreModel');
var app = express();
var port = process.env.PORT || 8080;

mongoose.set('useFindAndModify', false)

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

datastoreRouter = require('./routes/datastoreRoutes')(DataStore);
app.use('/api/datastore', datastoreRouter);

app.get('/', function(req, res){
    res.send('API is functional.');
});

module.exports = app.listen(port, function(){
    console.log('Running on port: ' + port);
});
