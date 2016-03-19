'use strict';

var http = require('http');
var dispatcher = require('httpdispatcher');
var database = require('./database');
var port = 8000;
var fs = require('fs');
var jwt = require("jsonwebtoken");

// Arquivos estáticos (js/css/images/etc.).
dispatcher.setStatic('assets');
dispatcher.setStaticDirname('');

/* INDEX */

dispatcher.onGet("/", function(req, res) {
    fs.readFile('./views/index.html', function read(err, data) {
        if (err) {
            throw err;
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
});

/* LOGIN */

dispatcher.onGet("/login", function(req, res) {
    fs.readFile('./views/login.html', function read(err, data) {
        if (err) {
            throw err;
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
});

dispatcher.onPost("/authenticate", function(req, res) {
    console.log(req.body);
    console.log('authenticate', {username: req.body.username, password: req.body.password});
    // User.findOne({username: req.body.username, password: req.body.password}, function(err, user) {
    //     if (err) {
    //         res.json({
    //             type: false,
    //             data: "Error occured: " + err
    //         });
    //     } else {
    //         if (user) {
    //            res.json({
    //                 type: true,
    //                 data: user,
    //                 token: user.token
    //             });
    //         } else {
    //             res.json({
    //                 type: false,
    //                 data: "Incorrect email/password"
    //             });
    //         }
    //     }
    // });
});

/* SIGNUP */

dispatcher.onGet("/signup", function(req, res) {
    fs.readFile('./views/signup.html', function read(err, data) {
        if (err) {
            throw err;
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
});

/* TESTES */

dispatcher.onGet("/page", function(request, response) {
	var commands = request.url.split('/');
	var body = "Hello Bava";

	var content_length = body.length.toString();

	response.writeHead(200, { 'Content-Type': 'text/plain',
                            'Content-Length': content_length });
	response.end(body);
});

dispatcher.onGet("/database", function(request, response) {
	database.create();
	response.writeHead(200, { 'Content-Type': 'text/plain',
                            'Content-Length': 1 });
	response.end();
});

var server = module.exports = http.createServer(function(req, res) {
	dispatcher.dispatch(req, res);
});

server.listen(port, function(){
    console.log("Server listening on: http://localhost:%s", port);
});