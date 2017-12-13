/**
 * @ devs 
 * @last modify 2016/11/8
 * @author 
 */
import source from '../tools/utils/menuResources';
import treeTransform from '../tools/widgets/oTree/treeTransform';

import md5 from 'md5';

var dependArr = [
		require('../tools/utils/ajax').default.name,
		require('../tools/utils/util').default.name
	]

export default angular
	.module('login.service',dependArr)
	.factory('loginService',['ajax','util','validator',function(ajax,util,validator){
		function isArr(o){
		    return Object.prototype.toString.call(o) === '[object Array]';
		}
		function isObj(o){
		    return Object.prototype.toString.call(o) === '[object Object]';
		}
		function notInArr(obj,arr){
		    //text是否重复
		    var hasText = true;
		    if(obj.text){
		        arr.forEach(function(v,i,arr){
		            if(obj.text === v.text){
		                hasText = false;
		            }
		        })
		    }
		    return hasText;
		}
		function mix(o1,o2){
		    var obj1 = o1,
		        obj2 = o2;
		    if(isObj(obj1)){
		        for(var item in obj1){
		            if(!obj2.hasOwnProperty(item)){
		                obj2[item] = obj1[item];
		            }else{//存在//
		                if(isObj(obj2[item]) || isArr(obj2[item])){//存在且为 数组或对象
		                    mix(obj1[item],obj2[item]);
		                }else{
		                      obj2[item] = obj1[item];
		                }
		            }
		        }
		    }else if(isArr(obj1)){
		        obj1.forEach(function(v,i,arr){
		            obj2.forEach(function(k,j,arr2){
		                if(isObj(v)){
		                    if(isObj(k)){
		                        if(v.text === k.text){//重复菜单
		                            mix(v,k);
		                        }else{
		                            //2不存在推入
		                            if(notInArr(v,obj2)){
		                                obj2.splice(i,0,v);
		                                //obj2.push(v);
		                            }
		                        }
		                    }else{
		
		                    }
		                }else{
		
		                }
		            })
		        });
		    }
		    return obj2;
		}
		
		function sort(currentArr,sourceArr){
		    var sourceArr = _markSource(sourceArr),
		        currentArr = _markCurrent(currentArr,sourceArr);
		    var tempArr =  _finalSortArr(currentArr);
		    //alert(JSON.stringify(tempArr));
		    return tempArr;
		}
		
		//快排
		function _sort(arr){
		    if(arr.length <= 1){return arr}
		    var middleIndex = Math.floor(arr.length/2),
		            middle = arr.splice(middleIndex,1)[0],
		            middleVal = middle['r'];
		    var left = [],
		        right = [];
		    arr.forEach(function(v,i,k){
		        if(v.r < middleVal){
		            left.push(v);
		        }else{
		            right.push(v);
		        }
		    });
		    return _sort(left).concat([middle],_sort(right));
		}
		//参照数组
		function _markSource(arr){
		    if(!isArr(arr)) return;
		    arr.forEach(function(v,i,arr){
		        if(isObj(v)){
		            v.r = i;
		            for(var item in v){
		                if(isArr(v[item])){
		                    _markSource(v[item]);
		                }
		            }
		        }
		    });
		    return arr;
		}
		//当前数组
		function _markCurrent(currentArr,sourceArr){
		    currentArr.forEach(function(v,i,arr){
		        sourceArr.forEach(function(m,k,arr){
		            if(isObj(v)&&isObj(m)){
		                if(v.text == m.text){
		                    v.r = m.r;
		                    for(var item in v){
		                        if(isArr(v[item]) && isArr(m[item])){
		                            _markCurrent(v[item],m[item]);
		                        }
		                    }
		                }
		            }
		        })
		    });
		
		    return currentArr;
		}
		
		//
		function _finalSortArr(arr){
		    if(!isArr(arr) || arr.length < 1){return}
		    arr = _sort(arr);
		    arr.forEach(function(v,i,k){
		        if(isObj(v)){
		            for(var item in v){
		                if(isArr(v[item])){
		                    v[item] = _sort(v[item]);
		                }
		            }
		        }
		    })
		    return arr;
		}
		
		try{
		    localStorage.removeItem('menu');
		    localStorage.removeItem('userType');
		    localStorage.removeItem('roleId');
		    localStorage.removeItem('modifyAuthFlag');
		}catch(e){}
		
    	/*------------------------------------------------*/
        var jq = angular.element;
        return {
            formSubmit : function(cfg){
                var that = this;
   				//验证用户名是否为空
                if(validator.isEmpty(cfg.username)){
                    jq(util.getById('uesrname')).parent().addClass('red-border');
                    util.getById('uesrname').focus();
                    return;
                }
                //验证密码是否为空
                if(validator.isEmpty(cfg.password)){
                    jq(util.getById('password')).parent().addClass('red-border');
                    util.getById('password').focus();
                    return;
                }
                
                var checkCode2;
                if(!cfg.checkCode){
                	checkCode2 = '';
                }else{
                	checkCode2 = cfg.checkCode.toLowerCase();
                }
                cfg.password = md5(checkCode2 +md5(cfg.password));
                cfg.checkCode = checkCode2;
                
                //通过验证，提交登录请求到后台
				ajax.post(ajax.DOMAIN + '/acc/user/logon.do',cfg).then(function(data){
                    var data3,
                    	url = '';
                    if(window.localStorage && data.result && data.result.length){
                        if(data.result.length == 1){
                           	data3 = {"data":treeTransform.ids2tree(data.result[0],source)}
                        }
						else{
                            var datas = data.result,
                                length = datas.length;
                           	data3 = {"data":treeTransform.ids2tree(data.result[0],source)};	
                            for(var i=1; i<length; i++){
                           		var data2 = {"data":treeTransform.ids2tree(datas[i],source)};	
                                data3 = mix(data2,data3);
                            }
                        }
                        data3.data = sort(data3.data,source);
                        url = data3.data[0].children[0].href;
                        
                        localStorage.setItem('username',cfg.username);
                        localStorage.setItem('menu',JSON.stringify(data3.data));
                        localStorage.setItem('id',data.id);
                        localStorage.setItem('userId',data.userId);
                        localStorage.setItem('jurisdiction',data.jurisdiction);
                        localStorage.setItem('jurisdictionU',data.jurisdictionU);
                        localStorage.setItem('modifyAuthFlag',data.modifyAuthFlag);
                    }
					url = './main.html#/' + url.slice(0,);
                    that.getMesCountDate(url);
                    
                },function(reason){
                	var errorInfo="";
                    switch(reason.responseCode){
                           case '001':
                                errorInfo="系统异常，请稍后再试"
                                document.getElementById('uName_').className="uName";
                                document.getElementById('uPwd_').className="uPwd"
                                document.getElementById('uYzm_').className="uYzm"
                                document.getElementById('loginForm_errorInfo').style.display="block";
                                document.getElementById('loginForm_errorInfo').innerHTML=errorInfo;
                                 break;
                           case '002':
                                errorInfo="用户名或密码错误"
                                document.getElementById('uName_').className="uName";
                                document.getElementById('uPwd_').className="uPwd"
                                document.getElementById('uYzm_').className="uYzm"
                                document.getElementById('loginForm_errorInfo').style.display="block";
                                document.getElementById('loginForm_errorInfo').innerHTML=errorInfo;
                                break;
                           case '022':
                                errorInfo = reason.responseMsg;
                                document.getElementById('uName_').className="uName";
                                document.getElementById('uPwd_').className="uPwd"
                                document.getElementById('uYzm_').className="uYzm"
                                document.getElementById('loginForm_errorInfo').style.display="block";
                                document.getElementById('loginForm_errorInfo').innerHTML=errorInfo;
                                break;
                            case '023':
                            	errorInfo = reason.responseMsg;
                                document.getElementById('uName_').className="uName";
                                document.getElementById('uPwd_').className="uPwd"
                                document.getElementById('uYzm_').className="uYzm"
                                document.getElementById('loginForm_errorInfo').style.display="block";
                                document.getElementById('loginForm_errorInfo').innerHTML=errorInfo;
                                break;
                            case '007':
                                errorInfo="验证码不正确"
                                document.getElementById('uName_').className="uName";
                                document.getElementById('uPwd_').className="uPwd"
                                document.getElementById('uYzm_').className="uYzm"
                                document.getElementById('loginForm_errorInfo').style.display="block";
                                document.getElementById('loginForm_errorInfo').innerHTML=errorInfo;
                               	jq(util.getById('yzm')).parent().addClass('red-border');
                                
                                break;

                    }
                    var r = Math.round(Math.random()*10000);
                    util.getById('yzmImg').src=ajax.DOMAIN + "/acc/code.do?" + r;
                })
            },
             /**
             * 更新未读消息数量,整个系统用（登陆时候会调用一次，修改未读状态的时候会在调用一次）
             * 存储在 localStorage.setItem('mesCount',data.mesCount);
             */
            getMesCountDate : function(url){
//          	console.log(url)
//          	return;
            	if(url == undefined){
            		alert('找不到该用户对应的页面！');
            		location.href = '../view/login.html';
            		return;
            	}
            	location.href = url;
            },
            usernameKeyup : function(text){
                if(!validator.isEmpty(text)){
                    jq(util.getById('uesrname')).parent().removeClass('red-border');
                }
            },
            passwordKeyup : function(text){
                if(!validator.isEmpty(text)){
                    jq(util.getById('password')).parent().removeClass('red-border');
                }
            },
            yzmKeyup : function(text){
                if(!validator.isEmpty(text)){
                    jq(util.getById('yzm')).parent().removeClass('red-border');
                }
            },
            changeCode:function(){
                    var r = Math.round(Math.random()*10000);
                    util.getById('yzmImg').src=ajax.DOMAIN + "/acc/code.do?" + r;
                    
            },
            getCodeUrl : function(){
                return ajax.DOMAIN + '/acc/code.do';
            },
             /**
	          * 通用 查询
	          * @param {String} url
	          * @param {JSON} cfg
	          */
            setDialogLeft : function(cfg,id){
                return util.dialogOffsetLeft(cfg,id);
            }
        };

		
	}])
