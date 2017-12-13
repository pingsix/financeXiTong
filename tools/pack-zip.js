
var fs = require('fs');
var path = require("path");
var archiver = require('archiver');

var domain = 'alarm.100credit.com';
/**
 * 压缩目录
 * @param {Object} packagePath
 * @param {Object} packageName
 */
var creatZip = function(packagePath,packageName){
	var zipPath = path.dirname(__dirname).replace(/\\/ig,'/') + '/dist/';
	var output = fs.createWriteStream(domain + '.zip');
	var archive = archiver('zip');
	archive.on('error', function(err){
	    throw err;
	});
	archive.pipe(output);
	archive.bulk([
	    {
	    	src: ['**'],
            dest: '/',
            cwd: zipPath,
            expand: true
	    }
	]);
	archive.finalize();
}
creatZip();