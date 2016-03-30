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
			db.run("CREATE TABLE User (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,"
									+ "email TEXT NOT NULL,"
									+ "password TEXT NOT NULL,"
									+ "isAdmin BOOLEAN NOT NULL)");
			
			db.run("CREATE TABLE Category (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," 
									    + "name TEXT NOT NULL)");
									
			db.run("CREATE TABLE Post (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,"
									+ "categoryId INTEGER NOT NULL,"
									+ "userId INTEGER NOT NULL,"
									+ "title TEXT NOT NULL," 
									+ "content TEXT NOT NULL,"
									+ "status BOOLEAN NOT NULL,"
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
    save: function (name) {
        db.run("INSERT INTO Category (name) VALUES ('" + name + "')");
    },
    update: function (id, name) {
        db.run("UPDATE Category SET name='" + name + "' where id=" + id);
    }
}

database.Users = {
    save: function (obj, callback) {
        db.run("INSERT INTO User (email, password, isAdmin) VALUES ('" + obj.email + "', '" + obj.password + "', " + obj.isAdmin + ")");
        this.findOne({ email: obj.email }, callback);
    },
    findOne: function (obj, callback) {
        db.all("SELECT * FROM User WHERE email='" + obj.email + "'", function (err, rows) {
            if (err) callback(err);
            callback(null, rows[0]);
        });
    }
}

database.Posts = {
    mostRecents: function (callback) {
        db.all("SELECT p.id, p.title, c.name category FROM Post p INNER JOIN Category c ON c.id = p.categoryId ORDER BY p.id DESC LIMIT 20", callback);
    }
}