'use strict';

var http = require('http');
var dispatcher = require('httpdispatcher');
var database = require('./database');
var cookie = require('./cookie');
var port = 8000;
var fs = require('fs');
var url = require('url');

// Arquivos estáticos (js/css/images/etc.).
dispatcher.setStatic('assets');
dispatcher.setStaticDirname('');

/* INDEX */

dispatcher.onGet("/", function(req, res) {
    fs.readFile('./views/index.html', 'utf-8', function read(err, data) {
        if (err) {
            throw err;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(_replacePageTags(req, data));
    });
});

/* LOGIN */

dispatcher.onGet("/login", function(req, res) {
    fs.readFile('./views/login.html', function read(err, data) {
        if (err) {
            throw err;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

dispatcher.onPost("/authenticate", function(req, res) {
    var formData = JSON.parse(req.body);
    setDefaultHeaders(res);
    database.Users.findOne({ email: formData.email }, function(err, user) {
        if (err) {
            res.end(JSON.stringify({
                type: false,
                data: "Erro ocorrido: " + err
            }));
        } else {
            if (user && user.password === formData.password) {
                cookie.setAuthCookie(res, user.email);
                res.end(JSON.stringify({
                    type: true,
                    data: user
                }));
            } else {
                res.end(JSON.stringify({
                    type: false,
                    data: "Usuário e/ou senha inválidos"
                }));
            }
        }
    });
});

/* SIGNUP */

dispatcher.onGet("/signup", function(req, res) {
    fs.readFile('./views/signup.html', function read(err, data) {
        if (err) {
            throw err;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

dispatcher.onPost("/signup", function(req, res) {
    var formData = JSON.parse(req.body);
    setDefaultHeaders(res);
    database.Users.findOne({ email: formData.email }, function(err, user) {
        if (err) {
            res.end(JSON.stringify({
                type: false,
                data: "Erro ocorrido: " + err
            }));
        } else {
            if (user) {
                res.end(JSON.stringify({
                    type: false,
                    data: "Usuário já existe!"
                }));
            } else {
                database.Users.save({ email: formData.email, password: formData.password, isAdmin: 0 }, function(err, user1) {
                    cookie.setAuthCookie(res, user.email);
                    res.end(JSON.stringify({
                        type: true,
                        data: user1
                    }));
                });
            }
        }
    });
});

/* CATEGORY */

dispatcher.onGet("/categories", function(req, res) {
    isAuthenticated(req, function(user) {
        if (!user) return notAuthorized(req, res);

        setDefaultHeaders(res);
        fs.readFile('./views/categories.html', 'utf-8', function read(err, data) {
            if (err) {
                throw err;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(_replacePageTags(req, data));
        });
    });
});

dispatcher.onGet("/categoriesList", function(req, res) {
    isAuthenticated(req, function(user) {
        if (!user) return notAuthorized(req, res);

        setDefaultHeaders(res);

        database.Categories.all(function(rows) {
            console.log("Categorias: " + JSON.stringify(rows));
            res.end(JSON.stringify({
                type: true,
                data: rows
            }));
        });
    });
});

dispatcher.onPost("/categories", function(req, res) {
    var formData = JSON.parse(req.body);
});

dispatcher.onGet("/api/categories", function(req, res) {
    isAuthenticated(req, function(user) {
        if (!user) return notAuthorized(req, res);

        setDefaultHeaders(res);

        database.Categories.all(function(rows) {
            res.end(JSON.stringify({
                type: true,
                data: rows
            }));
        });
    });
});

/* POSTS */

dispatcher.onGet("/posts/create", function(req, res) {
    fs.readFile('./views/posts/create.html', function read(err, data) {
        if (err) {
            throw err;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

dispatcher.onGet("/api/posts", function(req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    database.Posts.mostRecents(query.title ? query.title : '', function(err, rows) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        if (err) {
            res.end(JSON.stringify({
                type: false,
                data: "Erro ocorrido: " + err
            }));
        } else {
            res.end(JSON.stringify({
                type: true,
                data: rows
            }));
        }
    });
});

function _replacePageTags(req, data) {
    var accountHeader;
    if (cookie.getAuthCookie(req)) {
        accountHeader = '<li><a id="link-logout" href="#">Sair</a></li>';
    } else {
        accountHeader = '<li><a href="/signup">Inscrever-se</a></li>' +
            '<li><a href="/login">Entrar</a></li>';
    }
    return data.replace('@AccountHeader@', accountHeader);
}

function notAuthorized(req, res) {
    fs.readFile('./views/unauthorized.html', function read(err, data) {
        if (err) {
            throw err;
        }
        res.writeHead(401, { 'Content-Type': 'text/html' });
        res.end(data);
    });
}

function isAuthenticated(req, callback) {
    var userEmail = cookie.getAuthCookie(req);
    if (!userEmail) return callback(undefined);
    database.Users.findOne({ email: userEmail }, function(err, user) {
        callback(user);
    });
}

function setDefaultHeaders(res) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
}

var server = module.exports = http.createServer(function(req, res) {
    dispatcher.dispatch(req, res);
});

server.listen(port, function() {
    console.log("Server listening on: http://localhost:%s", port);
});