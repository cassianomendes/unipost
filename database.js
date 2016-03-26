'use strict';

var database = module.exports = {} ;

var fs = require("fs");
var file = "data/unipost.db";
var exists = fs.existsSync(file);

if(!exists) {
    console.log("Criando arquivo DB.");
    fs.openSync(file, "w");
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

database.create = () => {
	db.serialize(function() {
		 if(!exists) {
			db.run("CREATE TABLE User (id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,"
									+ "email TEXT NOT NULL,"
									+ "password TEXT NOT NULL,"
									+ "isAdmin INTEGER NOT NULL)");
			
			db.run("CREATE TABLE Category (id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL," 
									    + "name TEXT NOT NULL)");
									
			db.run("CREATE TABLE Post (id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,"
									+ "categoryId INTEGER NOT NULL,"
									+ "userId INTEGER NOT NULL,"
									+ "title TEXT NOT NULL," 
									+ "content TEXT NOT NULL,"
									+ "status INTEGER NOT NULL,"
									+ "FOREIGN KEY(categoryId) REFERENCES Category(id),"
									+ "FOREIGN KEY(userId) REFERENCES User(id))");
		  }				
	});
}

database.Categories = {
    all: function () {
        db.all("SELECT * FROM Category", function(err, rows) {
            return rows;
        });
    },
    byId: function (id) {
        db.all("SELECT * FROM Category WHERE id=" + id, function(err, rows) {
            return rows;
        });
    },
    delete: function (id) {
        db.run("DELETE * FROM Category where id=" + id); 
    },
    insert: function (name) {
        db.run("INSERT INTO Category (name) VALUES ('" + name + "')");
    },
    update: function (id, name) {
        db.run("UPDATE Category SET name='" + name + "' where id=" + id);
    }
}

database.Users = {
    insert: function (email, password, isAdmin) {
        db.run("INSERT INTO User (email, password, isAdmin) VALUES ('" + email + "', '" + password + "', " + isAdmin + ")");
    },
    authenticate: function (email, password) {
        db.all("SELECT * FROM User WHERE email='" + email + "' and password='" + password + "'", function(err, rows) {
            if (err) throw err;
            return rows.length > 0;
        });
    }
}