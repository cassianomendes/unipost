'use strict';

var http = require('http');
var dispatcher = require('httpdispatcher');
var database = require('./database');
var port = 8000;

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

var server = module.exports = http.createServer(function(request, response) {
	dispatcher.dispatch(request, response);						
});

server.listen(port, function(){
    console.log("Server listening on: http://localhost:%s", port);
});
