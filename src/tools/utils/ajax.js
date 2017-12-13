/**
 * @ devs ajax
 * @last modify 2016/11/8
 * @author 
 */

export default angular
    .module('ajax',[])
    .factory('ajax',['$http','$q','$httpParamSerializerJQLike',function($http,$q,$httpParamSerializerJQLike){
    	/**
	     * 补全配置信息
	     * @param options
	     * @returns {*|{}}
	     */
	    var fillOptions = function(options) {
	        options = options || {};
	
	        // 设置contenttype
	        if (!options.headers) options.headers = {};
	        if (!options.headers['Content-Type']) {
	            options.headers['Content-Type'] = options.by === 'json' ? 'application/json' : 'application/x-www-form-urlencoded';
	        }
	
	        // 带上cookie
	        options.withCredentials = true;
	        return options;
	    };
	
	    /**
	     * 获得全的url
	     * @param url
	     * @returns {*}
	     */
	    var fullUrl = function(url) {
	        var prefix = "";
	
	        // fixme 这段代码不够严谨，需要统一规则后修改
	        // 判断是否是开发或者测试环境
	        if (typeof TEMP_API_URL == "string") {
	            prefix = TEMP_API_URL;
	        }
	
	        return (fullUrl = function(url) {
	            if (url.length > 0 && url.charAt(0) === "/") {
	                url = prefix + url;
	            }
	            return url;
	        })(url);
	    };
	
	    function isUndefined(value) {return typeof value === 'undefined';}
	    function isDefined(value) {return typeof value !== 'undefined';}
	    function isObject(value) {
	        // http://jsperf.com/isobject4
	        return value !== null && typeof value === 'object';
	    }
	    function isBlankObject(value) {
	        return value !== null && typeof value === 'object' && !getPrototypeOf(value);
	    }
	    function isString(value) {return typeof value === 'string';}
	    function isNumber(value) {return typeof value === 'number';}
	    function isDate(value) {
	        return Object.prototype.toString.call(value) === '[object Date]';
	    }
	    function isWindow(obj) {
	        return obj && obj.window === obj;
	    }
	    var isArray = Array.isArray;
	    function isFunction(value) {return typeof value === 'function';}
	    function isRegExp(value) {
	        return toString.call(value) === '[object RegExp]';
	    }
	    function isArrayLike(obj) {
	        if (obj == null || isWindow(obj)) {
	            return false;
	        }
	
	        // Support: iOS 8.2 (not reproducible in simulator)
	        // "length" in obj used to prevent JIT error (gh-11508)
	        var length = "length" in Object(obj) && obj.length;
	
	        if (obj.nodeType === 1 && length) {
	            return true;
	        }
	
	        return isString(obj) || isArray(obj) || length === 0 ||
	            typeof length === 'number' && length > 0 && (length - 1) in obj;
	    }
	
	    function encodeUriQuery(val, pctEncodeSpaces) {
	        return encodeURIComponent(val).
	        replace(/%40/gi, '@').
	        replace(/%3A/gi, ':').
	        replace(/%24/g, '$').
	        replace(/%2C/gi, ',').
	        replace(/%3B/gi, ';').
	        replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
	    }
	
	    function serializeValue(v) {
	        if (isObject(v)) {
	            return isDate(v) ? v.toISOString() : toJson(v);
	        }
	        return v;
	    }
	
	    function forEach(obj, iterator, context) {
	        var key, length;
	        if (obj) {
	            if (isFunction(obj)) {
	                for (key in obj) {
	                    // Need to check if hasOwnProperty exists,
	                    // as on IE8 the result of querySelectorAll is an object without a hasOwnProperty function
	                    if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
	                        iterator.call(context, obj[key], key, obj);
	                    }
	                }
	            } else if (isArray(obj) || isArrayLike(obj)) {
	                var isPrimitive = typeof obj !== 'object';
	                for (key = 0, length = obj.length; key < length; key++) {
	                    if (isPrimitive || key in obj) {
	                        iterator.call(context, obj[key], key, obj);
	                    }
	                }
	            } else if (obj.forEach && obj.forEach !== forEach) {
	                obj.forEach(iterator, context, obj);
	            } else if (isBlankObject(obj)) {
	                // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
	                for (key in obj) {
	                    iterator.call(context, obj[key], key, obj);
	                }
	            } else if (typeof obj.hasOwnProperty === 'function') {
	                // Slow path for objects inheriting Object.prototype, hasOwnProperty check needed
	                for (key in obj) {
	                    if (obj.hasOwnProperty(key)) {
	                        iterator.call(context, obj[key], key, obj);
	                    }
	                }
	            } else {
	                // Slow path for objects which do not have a method `hasOwnProperty`
	                for (key in obj) {
	                    if (hasOwnProperty.call(obj, key)) {
	                        iterator.call(context, obj[key], key, obj);
	                    }
	                }
	            }
	        }
	        return obj;
	    }
	    function forEachSorted(obj, iterator, context) {
	        var keys = Object.keys(obj).sort();
	        for (var i = 0; i < keys.length; i++) {
	            iterator.call(context, obj[keys[i]], keys[i]);
	        }
	        return keys;
	    }
	
	    var json2param = function (params) {
	        if (!params) return '';
	        var parts = [];
	        serialize(params, '', true);
	        return parts.join('&');
	
	        function serialize(toSerialize, prefix, topLevel) {
	            if (toSerialize === null || isUndefined(toSerialize)) return;
	            if (isArray(toSerialize)) {
	                forEach(toSerialize, function(value, index) {
	                    serialize(value, prefix + '[' + (isObject(value) ? index : '') + ']');
	                });
	            } else if (isObject(toSerialize) && !isDate(toSerialize)) {
	                forEachSorted(toSerialize, function(value, key) {
	                    serialize(value, prefix +
	                        (topLevel ? '' : '.') +
	                        key +
	                        (topLevel ? '' : ''));
	                });
	            } else {
	                parts.push(encodeUriQuery(prefix) + '=' + encodeUriQuery(serializeValue(toSerialize)));
	            }
	        }
	    };
    	
    	
    	function getOs(){  
		   if(window.navigator.userAgent.indexOf("Firefox")>=0){  
		        return "Firefox";  
		   }  
		}
		
		function exit(){
			if(getOs() !== 'Firefox'){
				location.href = './login.html';
			}
		}
    	
    	function onError(response,next){
    		
//  		console.log('response',response)
//  		return;
	    	if(response){
	    		var data = response.data;
	    		if(typeof data == 'string'){
	    			console.log(203,data);
	    			return
	    			location.href = data;
	    		}
		       	// 如果是未登录，或者session已过期，那就直接跳转到首页
			    if (!data || (typeof data.responseCode !== 'undefined' && data.responseCode === '009')) {
			        exit();
			        return;
		   		}
			    else if(response.status === 500){
			    	alert(response.statusText)
			        return;
			    }
			    else if(typeof data != "object" || data === null){
			    	exit();
		       		return;
			    }
			    else{
		   		}
	    	}
    		next(data)
    	}
    	
    	
    	var ajax = {
			DOMAIN : location.protocol + '//' + location.host + '/',
    		get : function(url,data,options){
                var deferred = $q.defer();
 				options = fillOptions(options);

                if (typeof data == "object" && data !== null) {
                    data = json2param(data);
                }
                url = fullUrl(url);
                if (typeof data == "string" && data.length > 0) {
                    url += (url.indexOf("?") == -1 ? "?" : ":") + data;
                }
                $http.get(url,data,options).success(function(data){
                    deferred.resolve(data);
                }).error(function(){
                    deferred.resolve(data);
                });
                return deferred.promise;
            },
			post : function(url,data,options){
		        var deferred = $q.defer();
		        options = fillOptions(options);

                if (typeof data == "object" && data !== null && options.headers['Content-Type'].indexOf('application/x-www-form-urlencoded') != -1) {
                    data = json2param(data);
                }
		        $http.post(fullUrl(url),data,options).then(
		        	function(response) {
	                    var data = response.data;
	                    if (typeof data == "object" && data !== null && ( data.responseCode === '000' || data.page)) {
	                        deferred.resolve(data);
	                    } else {
	                    	onError(response,deferred.reject)
	                    }
	                }, 
	                function(response) {
	                	onError(response,deferred.reject)
	                });
                return deferred.promise;
        	}
    	}
    	
        //开发机
        ajax.DOMAIN = '';  
        
    	return ajax;
    	
    }])
    
