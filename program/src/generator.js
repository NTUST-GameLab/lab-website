/*

 ____        _                        _            
/ ___|  __ _| |_ __ ___   ___  _ __  | |___      __
\___ \ / _` | | '_ ` _ \ / _ \| '_ \ | __\ \ /\ / /
 ___) | (_| | | | | | | | (_) | | | || |_ \ V  V / 
|____/ \__,_|_|_| |_| |_|\___/|_| |_(_)__| \_/\_/  

	Author: Ze-Hao, Wang (Salmon)
	GitHub: http://github.com/grass0916
	Site:   http://salmon.tw

	Copyright 2016 Salmon @ NTUST GAME Lab
	Released under the MIT license

*/

var fs   = require('fs');
var ncp  = require('ncp');
var rmrf = require('rimraf');
var jade = require('jade');

// Paths setting.
var viewsPath  = __dirname + '/../views/';
var importPath = __dirname + '/../import/';
var publicPath = __dirname + '/../public/';
var outputPath = __dirname + '/../../output/';

// Options for jade.
var options = {};

// Import the customer data.
var data = {};
data.members    = require(importPath + 'members.json');
data.infomation = require(importPath + 'info.json');

// Hide the '@' in email information.
data.members.graduate.map(function (member) {
	if (member.mail) {
		var regRes = member.mail.match(/(.+)@(.+)/);
		if (regRes && regRes.length >= 3) {
			return member.mail = [regRes[1], regRes[2]];
		}
	}
	delete member.mail;
});

// Render the index page.
options = {};
var indexPage = jade.compileFile(viewsPath + 'index.jade', options);
var indexHTML = indexPage(data);

// Update the output HTML.
rmrf(outputPath, {}, function (err) {
	if (err) {
		console.log(err);
		process.exit();
	}
	// Write the HTML.
	fs.mkdirSync(outputPath);
	fs.writeFileSync(outputPath + 'index.html', indexHTML);
	// Clone the public folder.
	fs.mkdirSync(outputPath + 'public');
	ncp(publicPath, outputPath + 'public', function (err) { });
});
