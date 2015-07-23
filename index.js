var express = require('express');
var app = express();
var request = require('request');
var async = require('async');
var cons = require('consolidate');
var _ = require('lodash');
var tress = require('./trees');

app.engine('html', cons.lodash);
app.set('view engine', 'html');
// app.set('views', 'views');

var host;
var port;
var apiHost;
var apiPort;
app.set('host', host = 'localhost');
app.set('port', port = 8000);
app.set('apiHost', apiHost = 'localhost');
app.set('apiPort', apiPort = 3000);

var url = 'http://' + host + ':' + port;

var apiURL = 'http://' + apiHost + ':' + apiPort;

var path = function (path) {
  return url + path;
};

var apiPath = function (path) {
  return apiURL + path;
};

var apiGetNode = function (id, cb) {
  request(apiPath('/nodes/' + link.other.id), function (err, resp, body) {
    var node = JSON.parse(body);
    cb(null, node);
  });
};

app.get('', function (req, res) {
  res.redirect('/nodes');
});

app.get('/nodes', function (req, res) {
  request(apiPath('/nodes'), function (err, resp, body) {
    var issues = JSON.parse(body);
    res.render('index', {
      url: url,
      apiURL: apiURL,
      issues: issues
    });
  });
});

app.get('/nodes/:id', function (req, res) {
  var id = req.param('id');
  request(apiPath('/nodes/' + id), function (err, resp, body) {
    var node = JSON.parse(body);
    
    console.log('links', node.links);
    reduce(node.links, apiGetNode, function (err, result) {
      console.log('result', result);
      res.render('node', {
        url: url,
        apiURL: apiURL,
        node: node,
        deep: result || {}
      });
    }, 0, 2);

  });
});


var reduce = require('./reduce');

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
