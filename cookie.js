'use strict';

var cookie = module.exports = {} ;
var authCookieName = "AuthUser";
var crypto = require("crypto");
var passwd = 'UnIsInOs2016';

cookie.getCookies = (req) => {
	var list = {}, rc = req.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
};

cookie.getAuthCookie = (req) => {
	var list = cookie.getCookies(req);	
	if (!list[authCookieName]) return undefined;
    
    var decipher = crypto.createDecipher('aes-256-cbc', passwd);
    var decripted = decipher.update(list[authCookieName], 'base64', 'utf8');
    decripted += decipher.final('utf8');
                         
	return decripted;
};

cookie.setAuthCookie = (res, value) => {
	var now = new Date();
	var time = now.getTime();
	time += 3600 * 1000;
	now.setTime(time);
    
    var cipher = crypto.createCipher('aes-256-cbc', passwd);
    var cripted = cipher.update(value, 'utf8', 'base64');
    cripted += cipher.final('base64');
    
	res.setHeader('Set-Cookie', authCookieName + '='
                  + cripted + "; expires="+ now.toUTCString() + "; path=/;");
	return res;
};