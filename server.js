'use strict';

var http = require('http');
var dispatcher = require('httpdispatcher');
var database = require('./database');
var cookie = require('./cookie');
var port = 8000;
var fs = require('fs');
var url = require('url');


// =======================================================
// ======= ARQUIVOS ESTÁTICOS (js/css/images/etc.) =======
// =======================================================
dispatcher.setStatic('assets');
dispatcher.setStaticDirname('');


// =======================================================
// ===================== PÁGINAS =========================
// =======================================================

dispatcher.onGet("/", function(req, res) {
    fs.readFile('./views/index.html', 'utf-8', function read(err, data) {
        if (err) {
            throw err;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(_replacePageTags(req, data));
    });
});

dispatcher.onGet("/login", function(req, res) {
    fs.readFile('./views/login.html', function read(err, data) {
        if (err) {
            throw err;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

dispatcher.onGet("/signup", function(req, res) {
    fs.readFile('./views/signup.html', function read(err, data) {
        if (err) {
            throw err;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

dispatcher.onGet("/categories", function(req, res) {
    isAuthenticated(req, function(user) {		
        if (!user || !isAdmin(user)) return notAuthorized(req, res);

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

dispatcher.onGet("/categories/create", function(req, res) {
    isAuthenticated(req, function(user) {		
        if (!user || !isAdmin(user)) return notAuthorized(req, res);

        setDefaultHeaders(res);
        fs.readFile('./views/categories/create.html', 'utf-8', function read(err, data) {
            if (err) {
                throw err;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(_replacePageTags(req, data));
        });
    });
});

dispatcher.onGet("/posts/create", function(req, res) {
    isAuthenticated(req, function(user) {		
        if (!user) return notAuthorized(req, res);

        fs.readFile('./views/posts/create.html', function read(err, data) {
            if (err) {
                throw err;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    });
});


// =======================================================
// ========================= API =========================
// =======================================================

dispatcher.onPost("/api/authenticate", function(req, res) {
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

dispatcher.onPost("/api/signup", function(req, res) {
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
                database.Users.save({ fullName: formData.fullName, email: formData.email, password: formData.password, isAdmin: 0 }, function(err, user1) {
                    cookie.setAuthCookie(res, user1.email);
                    res.end(JSON.stringify({
                        type: true,
                        data: user1
                    }));
                });
            }
        }
    });
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

dispatcher.onPost("/api/categories", function(req, res) {
	isAuthenticated(req, function(user) {
        if (!user || !isAdmin(user)) return notAuthorized(req, res);

        var formData = JSON.parse(req.body);  
		console.log(formData);		
        setDefaultHeaders(res);                
		database.Categories.save(formData.catName);        
		res.end(JSON.stringify({
            type: true
        }));
    });    	
});

dispatcher.onGet("/api/posts/mostRecents", function(req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    database.Posts.mostRecents(query.title ? query.title : '', function(err, rows) {
        setDefaultHeaders(res);
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

dispatcher.onGet("/api/posts", function(req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    database.Posts.findOne({ id: query.id }, function(err, rows) {
        setDefaultHeaders(res);
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

dispatcher.onPost("/api/posts", function(req, res) {
    isAuthenticated(req, function(user) {
        if (!user) return notAuthorized(req, res);

        var formData = JSON.parse(req.body);
        
        setDefaultHeaders(res);
        
        database.Posts.save({ categoryId: formData.category, userId: user.id, title: formData.title, content: formData.content, status: 0 });
        res.end(JSON.stringify({
            type: true
        }));
    });
});


// =======================================================
// ================== MÉTODOS AUXILIARES =================
// =======================================================

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
    fs.readFile('./views/unauthorized.html','utf-8', function read(err, data) {
        if (err) {
            throw err;
        }
        res.writeHead(401, { 'Content-Type': 'text/html' });
        res.end(_replacePageTags(req, data));
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

function isAdmin(user){
	return user.isAdmin !== 0;
}


// =======================================================
// ======================= SERVIDOR ======================
// =======================================================

var server = module.exports = http.createServer(function(req, res) {	
    dispatcher.dispatch(req, res);
});

server.listen(port, function() {
    console.log("Server listening on: http://localhost:%s", port);
});