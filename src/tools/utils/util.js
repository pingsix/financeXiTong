/**
 * 
 */

//console.log()



export default angular
	.module('util',[])
    .factory('validator',[validatorService])
    .factory('util',utilService);
    
    function validatorService(){
        return {
            isEmpty : function(text){
                if(!text || /^\s*$/g.test(text)){
                    return true;
                }
            }
        }
    }


    function utilService(){
        var doc = document;
        var service = {
            cookie : function(name){
                var value = undefined;
                if(arguments.length>=2){
                    value = arguments[1];
                }

                var exdate=new Date();
                exdate.setDate(exdate.getDate()+1);//默认为1天过期时间
                var exp = exdate;
                if(arguments.length>=3){
                    var exdate = new Date();
                    exdate.setDate(exdate.getDate()+parseInt(arguments[2]));

                    exp = exdate;
                }

                if(typeof(value)=="undefined"){
                    if(name){
                        var all = document.cookie.split('; ');
                        for (var i = 0, len = all.length; i < len; i++) {
                            var cookie = all[i].split('=');
                            if (cookie[0] === name) {
                                return decodeURIComponent(cookie[1]);
                            }
                        }
                        return null;
                    }else{
                        return document.cookie;
                    }
                }else{//设置

                    if(value!==null){//设置

                        document.cookie = name+'='+value+';expires='+exp+';path=/;';
                    }else{//删除
                        //暂时为实现
                        document.cookie = name+'=;expires=-1;path=/;';
                    }
                }
            },
            getById : function(id){
                if(typeof id === 'string'){
                    return doc.getElementById(id)
                }else{
                    throw new Error('type error');
                }

            },
            //eq:config = {className:'',tag:'',root:''}
            getElementsByClassName : function(config){
                //className,tag,root
                var tag = config.tag || '*',
                    root = typeof(config.root) == 'string' ? document.getElementById(config.root) : config.root || document.body,
                    list = root.getElementsByTagName(tag),
                    target = [];
                for(var i=0,len=list.length;i < len;i++){
                    for(var j=0,jarr = list[i].className.split(' '),jlen=jarr.length;j < jlen;j++){
                        if(jarr[j] == config.className){
                            target.push(list[i])
                        }
                    }
                }
                return target
            },
            parent : function(current,targetType){
                //parents(obj,ul)
                if(arguments.length == 2){
                    var r = new RegExp(targetType,'ig');
//                  console.log("ru",r)
//                  console.log("currentu",current)
                    var parent = current.parentNode;
//                  console.log("parentu",parent)
                    while(!r.test(parent.nodeName)){
                        parent = parent.parentNode;
                        if(/html/ig.test(parent.nodeName)){
                            break;
                        }
                    }
                    return parent;
                }
            },
            getStyle :  function(obj,property){
                var style = null;
                if(!obj){
                	console.warn(obj)
                	return
                }
                if(obj.currentStyle){
                    style = obj.currentStyle[property];
                }else if(window.getComputedStyle){
                    style = document.defaultView.getComputedStyle(obj,null)[property];
                }
                return style;
            },
            getById :  function(idName){
            	return doc.getElementById(idName);
            },
            //规则中心 验证规则条件是否正确
            isRuleError : function(str){
                var r = /[)(]/gm,
                    r2 = /\([^()]*\)/gm,
                    newStr = str;
                newStr = newStr.replace(r2,'');
                if(r2.test(newStr)){
                    arguments.callee(newStr);
                }else{
                    return r.test(newStr)
                }
            },
            dialogOffsetLeft : function(cfg,id) {
                var that = this;
                if (cfg && id) {
                    var target = that.getElementsByClassName(cfg),
                        targetWidth = target[0].scrollWidth,
                        objWidth = that.getStyle(that.getById(id), 'width'),
                    	left = 0;
                    if (objWidth) {
                        objWidth = parseInt(objWidth.replace(/(\d+)\D+/g, '$1'));
                    }
                    if (objWidth < targetWidth) {
                        left = Math.round((targetWidth - objWidth) / 2);
                    }
                    return left;
                }
            },
            loadScript : function (url,id,callback) {

            },
            //判断对象是否为空{}
            isEmptyObject : function(obj) { 
				for ( var name in obj ) { 
					return true; 
				} 
				return false; 
			},
			//判断对象是否是数组
            isArr : function(obj) { 
            	return Array.isArray(obj);
//          	return Object.prototype.toString.call(obj).slice(8,-1) === 'Array';
			},
			//但数组去重
			rmSame : function(arr){
				var newArr = [];
				for(var i = 0; i < arr.length; i++){
					if(newArr.indexOf(arr[i]) == -1){
						newArr.push(arr[i])
					}
				}
				return newArr
			},
			/**
			 *@param {} 
			 *@return  Array
			 */
			objToArr : function(obj,newKeys){
				var arr = [],
					objKeys = Object.keys(obj),
					i = 0,
					ii = objKeys.length;
				
				var temporary = {}; //临时添加属性属性对象
				if(Object.prototype.toString.call(newKeys).slice(8,-1) === 'Array'){
					for(var k = 0 ,kk = newKeys.length ; k < kk ; k ++){
							temporary[newKeys[k]] = '';
					}
				}
				else if(Object.prototype.toString.call(newKeys).slice(8,-1) === 'String'){
					temporary[newKeys] = '';
				}
					
				for(; i < ii ; i++){
					var objArr = temporary;
//					for(var j in objArr){
//						var preVariable;
//						objArr[j] = objKeys[i];
//						if(preVariable && preVariable !== j){
//							objArr[j] = obj[objKeys[i]];
//						}
//						preVariable = j;
//					}
					
					arr.push(objArr)
				}
				return arr;
			},
			ejson : function(obj){
				return eval("(" + obj + ")");
			},
            //校验链接与用户权限2
			hasPermit : function(inputUrl){
				if(!inputUrl) return;
	        	var treeUrlArr = eval("(" + localStorage.getItem('menu') + ")"),
	        		retrunFlag = false,
	        		removeParam,
	        		compareUrl;
	        	if(!treeUrlArr) return false;
				inputUrl = inputUrl.split("/");
				for(var i = 0 ; i < inputUrl.length; i++){
					if(/.html/.test(inputUrl[i])){
						removeParam = inputUrl[i].replace("#",'') + location.hash;
						compareUrl = removeParam.split("?")[0];
					}
				}
	        	for(var k = 0; k < treeUrlArr.length; k++){	
	        		for(var i = 0,Chil = treeUrlArr[k].children; i < Chil.length; i++){
	        			if(Chil[i].href.split("?")[0].trim() == compareUrl){
	        				return retrunFlag = true;
	        			} 
	        		}
				}
	        	return retrunFlag;
        	},
			//校验链接与用户权限1
			checkRole : function($q){
				var defer = $q.defer();
//				alert(that.hasPermit(location.href))
                if (this.hasPermit(location.href)) {
                    defer.resolve();
                } else {
                    defer.reject();
//                  setTimeout(function() { location.href = '/'; }, 0);
                }
				return defer.promise;
			},
			getLatelyDay : function(day,is){
				var day = typeof day === 'number' ? day : 0 ;
				var ms = day * 86400000;
				var latelyMs = (new Date()).getTime() - ms;
				if(is !== 'noExtend'){
					return (new Date(latelyMs)).toLocaleDateString().replace(/\//g,'-') + ' 00:00:00';
				}else{
					return (new Date(latelyMs)).toLocaleDateString().replace(/\//g,'-');
				}
			}
			
        };
        return service;
    }


