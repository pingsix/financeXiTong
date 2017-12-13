/**
 * 
 * 	自定义fs模块
 * 
 */

var fs = require('fs');
var path = require("path");
// 删除文件目录
function deleteFileDire(rootPath,excludeFile){
	var B = {};
	
	B.rootPath = rootPath || '';
	B.excludeFile = excludeFile || '';    //  例如   'index.html,test.js'
	
	B.deleteFile = function(path){
		var files = [];
		if(fs.existsSync(path)) {
			files = fs.readdirSync(path);
			files.forEach(function(file,index){
				// 如果该文件在排除文件范围内则终止
				if(B.excludeFile.indexOf(file) >= 0) {
					return false;
				}
	            var curPath = path + '/' + file;
	            if(fs.statSync(curPath).isDirectory()) { // recurse
	                B.deleteFile(curPath);
	            } else { // delete file
	                fs.unlinkSync(curPath);
	            }
	        });
	        // 如果目录为空才删除该目录
			if(!fs.readdirSync(path).length) {
				fs.rmdirSync(path);
			}
		}
	}
	
	// 执行删除文件
	B.deleteFile(B.rootPath);
	
}

//生成应用入口
function creatEnrty(wholePath,cutPage){
	var wholePath = wholePath.indexOf("index.html") === -1 ? wholePath + '/index.html' : wholePath;
	var cutPage = cutPage || './login.thml';
	var _path = '<script>location.href="' + cutPage + '"</script>';
	var createFolder = function(dir) { //文件写入
	    var sep = path.sep
	    var folders = path.dirname(dir).split(sep);
	    var p = '';
	    while (folders.length) {
	        p += folders.shift() + sep;
	        if (!fs.existsSync(p)) {
	            fs.mkdirSync(p);
	        }
	    }
	};
	
	createFolder(wholePath);
	fs.createWriteStream(wholePath);
	fs.writeFile(wholePath, _path, function(err){
//		console.log('Error-->',err)
	})
}

module.exports = {
	deleteFileDire : deleteFileDire,
	creatEnrty : creatEnrty
};