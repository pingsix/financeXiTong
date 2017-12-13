/**
 * 上传svn
 * @author HontianYem 
 */

var process = require("child_process");
var path = require("path");


var upLoadSvn = (floders) => {
	var WEBROOT = path.dirname(__dirname.replace(/\\/g,'/')) + '/';
	
	var addSvnDirs = (floders) => {
		if(!floders || !floders.length) return;
		var dirs = '';
		floders.forEach((v,index,arr) => {
			dirs += WEBROOT + v + '*' 
		})
		dirs = dirs.slice(0,-1);
		return dirs;
	}
	
	var addSvn = (commit) => {
		process.exec('TortoiseProc.exe /command:add /path:' + addSvnDirs(floders) ,(err) => {
			console.log('--addSvnErro',err)
			commit();
		})
	}
	
	addSvn(() => {
		process.exec('TortoiseProc.exe /command:commit /path:' + WEBROOT,(err) => {
			console.log('--commitSvnErro',err)
		})
	});
}


var floderConfig = [
	'src/',
	'config/',
	'tools/',
	'package.json',
	'dist/'
]

upLoadSvn(floderConfig);
