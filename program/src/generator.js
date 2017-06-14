/*

 ____        _                        _            
/ ___|  __ _| |_ __ ___   ___  _ __  | |___      __
\___ \ / _` | | '_ ` _ \ / _ \| '_ \ | __\ \ /\ / /
 ___) | (_| | | | | | | | (_) | | | || |_ \ V  V / 
|____/ \__,_|_|_| |_| |_|\___/|_| |_(_)__| \_/\_/  

	Author: Ze-Hao, Wang (Salmon)
	GitHub: http://github.com/grass0916
	Site:   http://salmon.tw

	Copyright 2017 Salmon @ NTUST GAME Lab
	Released under the MIT license

*/

var fs         = require('fs');
var async      = require('async');
var ncp        = require('ncp');
var rmrf       = require('rimraf');
var pug        = require('pug');
var fontSpider = require('font-spider');
var minify     = require('html-minifier').minify;

// Paths setting.
var viewsPath  = __dirname + '/../views/';
var importPath = __dirname + '/../import/';
var publicPath = __dirname + '/../public/';
var coverPath  = __dirname + '/../public/images/cover/';
var outputPath = __dirname + '/../../output/';

function emailExtractor(member) {
	if (member.mail) {
		var regRes = member.mail.match(/(.+)@(.+)/);
		if (regRes && regRes.length >= 3) {
			return member.mail = [regRes[1], regRes[2]];
		}
	}
	delete member.mail;
}

async.waterfall([
	// Dynamic covers.
	function (callback) {
		// Import the customer data.
		var data = {};
		data.members     = require(importPath + 'members.json');
		data.cadres      = require(importPath + 'cadres.json');
		data.information = require(importPath + 'info.json');
		// Hide the '@' in email information.
		data.members.faculty.map(emailExtractor);
		data.members.graduate.map(emailExtractor);
		data.members.ungraduate.map(emailExtractor);
		data.members.alumni.map(emailExtractor);

		// Cadres.
		var members = [];
		Object.keys(data.members).forEach(function (category) {
			members = members.concat(data.members[category]);
		});
		data.cadres = data.cadres.map(function (cadre) {
			// Grab the leaders.
			cadre.leaders = cadre.leaders.map(function (leader) {
				leader.person = members.find(function (member) {
					return member.studentId === leader.person;
				});
				return leader;
			});
			return cadre;
		});

		// Read the path.
		fs.readdir(coverPath, function (err, files) {
			data.covers = files
			callback(err, data);
		});
	},
	// Render the output.
	function (data, callback) {
		// Options for pug.
		var options   = {};
		var indexPage = pug.compileFile(viewsPath + 'index.pug', options);
		var indexHTML = minify(indexPage(data), { removeAttributeQuotes: true, removeComments: true, minifyJS: true, minifyCSS: true });
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
			ncp(publicPath, outputPath + 'public', function (err) {
				// Then, minimize the font via font-spider (Dynamic subsetting).
				// p.s. This package not suppot '.oft', please transfer them first. (Maybe you can choose 'fontforge')
				fontSpider.spider([__dirname + '/../../output/index.html'], {
					// Ignore Google fonts APIs.
					ignore: ['Armata', 'Pontano', 'Roboto', 'ABeeZee'],
					unique: true,
					backup: false,
					silent: true
				}).then(function (webFonts) {
					return fontSpider.compressor(webFonts, {
						backup: false
					});
				}).then(function (webFonts) {
					// console.log(webFonts);
				}).catch(function (errors) {
					console.error(errors);
				});
			});
			// Copy the insides in 'extends'.
			fs.mkdirSync(outputPath + 'productions');
			ncp(__dirname + '/extends/', outputPath, function (err) { });
		});
	}
]);
