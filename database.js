'use strict';

var database = module.exports = {} ;

var fs = require("fs");
var file = "unipost/unipost.db";
var exists = fs.existsSync(file);

var sqlite3 = require("sqlite3").verbose();

//TODO: Somente pode abrir se o arquivo já existir, quando não existe da erro
//var db = new sqlite3.Database(file);

database.create = () => {
	db.serialize(function() {
		 if(!exists) {
			db.run("CREATE TABLE User (id INTEGER PRIMARY KEY NOT NULL AUTOINCREMENT " 
									+ "email TEXT NOT NULL " 
									+ "password TEXT NOT NULL "
									+ "isAdmin INTEGER NOT NULL)");
			
			db.run("CREATE TABLE Category (id INTEGER PRIMARY KEY NOT NULL AUTOINCREMENT " 
									+ "name TEXT NOT NULL)");
									
			db.run("CREATE TABLE Post (id INTEGER PRIMARY KEY NOT NULL AUTOINCREMENT " 
									+ "categoryId INTEGER NOT NULL "
									+ "userId INTEGER NOT NULL "
									+ "title TEXT NOT NULL " 
									+ "content TEXT NOT NULL "
									+ "status INTEGER NOT NULL"
									+ "FOREIGN KEY(categoryId) REFERENCES Category(categoryId)"
									+ "FOREIGN KEY(userId) REFERENCES User(userId)");
									
		  }				
	});
}