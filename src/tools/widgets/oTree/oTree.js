/**
 * 
 */
require.config({
	baseUrl : '..',
	paths : {
		'angular' : 'vendor/angular',
	}
})
var dependArr = [
				"angular",
				"utils/ajax",
				"../../widgets/oTree/treeTransform",
//				"../vendor/jquery-1.8.2",
//				"../widgets/jstree/jstree",
//				"../widgets/jstree/jstree.contextmenu",
//				"../widgets/jstree/jstree.dnd",
//				"../widgets/jstree/jstree.checkbox",
				"utils/menuResources",
				]

require(dependArr,function(ng,ajax,treeTransform){
	//setting'ngRoute'
    var m = ng.module('tree',[]);
		m.controller('rendorTopMenu',['$scope','$rootScope',function(scope,$rootScope){
			function renderTopMenu(path){
				var className = '';
				if(path.indexOf('userApply.html') !== -1){
					className = 'menu1';
				}
				else if(path.indexOf('dzgl.html') !== -1){
					className = 'menu2';
				}
				else if(path.indexOf('statistic.html') !== -1){
					className = 'menu3';
				}
				else if(path.indexOf('production.html') !== -1){
					className = 'menu4';
				}
				else if(path.indexOf('manager.html') !== -1){
					className = 'menu5';
				}
				else if(path.indexOf('financeInfo.html') !== -1){
					className = 'menu6';
				}
				return className;
			}
			var slideBar = [];
			/**
			 * rendorTopMenu
			 */
			scope.newTopMenu = (function(menu){
				var newArr = [];
				menu.forEach(function(v){
					var newObj = {};
					newObj.text = v.text;
					newObj.path = v.children[0].href;
					var link = location.href;
					var currentPath = link.slice(link.indexOf("view") + 5 , link.indexOf('#'));
					if(newObj.path.slice(0,newObj.path.indexOf('#')) == currentPath || (v.text == '用户管理' && currentPath.slice(0,currentPath.indexOf('?')) === 'tree.html')){
						newObj.selected = true;
					}
					newObj.menuName = renderTopMenu(newObj.path);
					if(newObj.selected){
						slideBar = v.children;
					}
					newArr.push(newObj)
				})
				newArr = newArr.reverse();
				return newArr;
			})(JSON.parse(localStorage.getItem('menu')))
			
			/**
			 * rendorSliderBar
			 */
			var slideBarStyleArr = ['menu1','menu2','menu3','menu4','menu5','menu6'];
			scope.slideBar = slideBar;
			var brManager = JSON.parse(localStorage.getItem('jurisdiction'));
			var usManager = JSON.parse(localStorage.getItem('jurisdictionU'));
			if(brManager || usManager){
				scope.slideBar.push({id:'j1_17',text:'角色管理',href:'manager.html#/roleAdmin'});
			}
			scope.onlink = location.href;
			scope.$watch('onlink',function(){
				var link = location.href;
				currentPath = link.slice(link.indexOf("view") + 5 , link.indexOf('?'));
			    scope.slideBar.forEach(function(v,i){
					v.menuName = slideBarStyleArr[i];
					if(v.href == currentPath || (v.href == 'manager.html#/roleAdmin' && currentPath == 'tree.html')){
						v.selected = 'selected';
					}else{
						v.selected = '';
					}
				})
			})
		}])
		
		ng.bootstrap(document,['tree']);
	
	
	
	
    	/**
    	 * 不能判断数组长度为0的情况
    	 */
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
        function mix(source,current){
            var obj1 = source,
                obj2 = current;
            if(isObj(obj1)){
                for(var item in obj1){
                    if(!obj2.hasOwnProperty(item)){
                        obj2[item] = obj1[item];
                    }else{//存在//
                        if(isObj(obj2[item]) || (isArr(obj2[item]) && obj2[item].length > 0)){//存在且为 对象 或 数组(数组且长度大于0)
                            mix(obj1[item],obj2[item]);
                        }else if (isArr(obj2[item]) && obj2[item].length == 0) {// 判断数组为[]的情况 eg: children:[]
                            obj2[item] = obj1[item];
                        }else{
                        }
                    }
                }
                    

            }else if(isArr(obj1)){
                obj1.forEach(function(v,i,arr){
                    obj2.forEach(function(k,j,arr2){
                        if(isObj(v)){
                            if(isObj(k)){
                                //console.log(60,v,k);
                                if(v.text === k.text){//重复菜单
                                    //console.log(62,v,k);
                                    mix(v,k);
                                }else{
                                    //console.log(65,v,k);
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


        //重置源数据
        function resetSourceArr(arr){
            if(!isArr(arr)) return;
            arr.forEach(function(v,i,arr){
                if(isObj(v)){
                    v.state = {"selected":true};
                    for(var item in v){
                        if(isArr(v[item])){
                            resetSourceArr(v[item]);
                        }
                    }
                }
            });
            return arr;
        }
        function resetCurrentArr(arr){
            if(!isArr(arr)) return;
            arr.forEach(function(v,i,arr){
                if(isObj(v)){
                    if(v.id){
                        delete v.id;
                    }
                    if(v.li_attr){
                        delete v.li_attr;
                    }
                    if(v.a_attr && v.a_attr.id){
                        delete v.a_attr.id;
                    }

                    v.state = {"selected":false};
                    for(var item in v){
                        if(isArr(v[item])){
                            resetCurrentArr(v[item]);
                        }
                    }
                }
            });
            return arr;
        }


    (function(){

        /*"state" : {
            "opened" : false,
                    "selected" : true
        }*/
        var url=window.location.href;
        var testIdParam = urlToJson(url),
        	roleShow = document.getElementById("roleShow");
        	for(var v in testIdParam){
        		if(testIdParam[v] == "10"){
                	roleShow.style.display = "block";
        		}
        	}

//      将截取的字符串数组转成对象
        function urlToJson(url){
            if(!(/\?/g.test(url))) return {};
            var obj = {};
            var str=url.split("?");
            var str01=str[1].split("&");
            for (var i=0;i<str01.length;i++){
                var temp = str01[i].split('=');
                obj[temp[0]] =  temp[1];
            }
            return obj
        }
        //{id:1,roleName:test}
        var params=urlToJson(url),
        	groupName;
        roleExplain=decodeURI(params.roleExplain);
        function redactRole(){
        	if(params.id){
            $("#title").text("编辑角色");
            var url = CONT_URL + '/role/edit.do';
	            $.ajax({
	                url : url,
	                type : 'post',
	                data: {
						id : params.id,
					},
					headers : {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					xhrFields: {
					    withCredentials: true
					},
	                success : function(data){
	                    if(data.responseCode == "009"){
		                    window.location.href="login.html";
		                }
	                    else if(data.responseCode = '000'){
	                    	
	                    	var current =  data.result.roles || source;
		                    var current =  JSON.parse(current);
		                    
		                    
		                    /**
		                     * 临时兼容用户修改
		                     */
		                    if(typeof current[0] == 'string'){
		                    	current = treeTransform.ids2tree(current,source);
		                    }
		                    /**
		                     * 
		                     */
		                    resetCurrentArr(current);
					        render(current,source);
					        
					        groupName = data.result.groupName;
		                    $("#roleName").val(groupName);
		                    $("#remark").val(data.result.roleExplain);
		                    $("#roleName").attr("disabled",true).css({background:"white"});
		                }
		            }
	            });
	        }else{
	            render(source,source); 
	            $("#title").text("新建角色");
	            $("#roleName").val();
	        }
        }
		redactRole();
		
        function dataFileter(arr){
            if(!arr.length){return};
            arr.forEach(function(v,i){
                if(isObj(v)){
                    if(v.id){
                        delete id
                    }
                    if(v.li_attr){
                        delete li_attr
                    }
                    if(isArr(v.children)){
                        dataFileter(arr);
                    }
                }
            })
        }
        
        function render(current,source){
            source = resetSourceArr(source);
            current = resetCurrentArr(current);
//          console.log("render resetSourceArr  source == ",source)
//          console.log("render resetCurrentArr .current == ",current)
            source = mix(source,current);
            
//			console.log("render mix  source == ",source)

            var json = {
                "core" : {
                    "animation" : 0,
                    "check_callback" : true,
                    "data" : source
                },
                "types" : {
                    "#" : {
                        "max_children" : 1,
                        "max_depth" : 4,
                        "valid_children" : ["root"]
                    },
                    "root" : {
                        "icon" : "/static/3.0.8/assets/images/tree_icon.png",
                        "valid_children" : ["default"]
                    },
                    "default" : {
                        "valid_children" : ["default","file"]
                    },
                    "file" : {
                        "icon" : "glyphicon glyphicon-file",
                        "valid_children" : []
                    }
                },
                "plugins" : [
                    "checkbox",
                    "state", "types", "wholerow"
                ]
            };
			
			//正则输入框
			
			
			
            var selectNodes = [],d;
            $('#dtree').jstree(json);
            d = $('#dtree').jstree(true);
            $('#dtree').bind('loaded.jstree',function(e){
                d.open_all();
            })
            $('#btnSave').bind('click',function(e){
                var url;
                var roleName=$('#roleName').val();
                var remark=$('#remark').val();
                if(roleName==""){
                    alert("请输入角色名称！")
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                    d.open_all();
                    selectNodes = d.get_selected();
                    console.log()
                    d.delete_node(selectNodes);

                    url=window.location.href;
					// url的第一个字段决定公用tree的url 和所传参数
                    var params=urlToJson(url),
                    	isUrl,
                    	params1 = {},
                    	creatRoleId,
                    	creatRoleName,
                    	creatName = document.getElementById("roleName"),
                    	creatId = document.getElementById("roleId");
					if(roleShow.style.display == "block"){
						creatRoleId = creatId.value;
						creatRoleName = creatName.value;
					}
					
					for(var v in params){
						if(v === "id"){
							params1.id = params[v];
						}
						if(v === "groupId"){
							params1.groupId = params[v];
						}
						if( v == "no" && params[v] == "20"){
							isUrl = CONT_URL + '/role/modify.do';    //编辑角色页url
							params1={
		                        groupName :roleName,
		                        roleExplain : remark,
		                        roles: treeTransform.tree2ids(JSON.stringify(d.get_json()))
		                    };
						}
						else if(testIdParam[v] == "10"){
							isUrl = CONT_URL + '/role/addRoles.do';   //新建角色页url
							
							
							
							params1={
		                        groupName :roleName,
		                        roleExplain : remark,
		                        groupId : creatRoleId,
		                        roles: treeTransform.tree2ids(JSON.stringify(d.get_json()))
		                    };
		                    if(/(?=[\x21-\x7e]+)[^A-Za-z0-9]/.test(creatRoleId)){
		                    	alert('角色ID名不能包含特殊符号！');
								return;
		                    }
			                if(!/^(?!\d+$)[\da-zA-Z]*$/.test(creatRoleId) || creatRoleId == ''){
								alert('角色ID名不能为中文或纯数字！');
								return;
							}
			                if(!/^[\u4e00-\u9fa5\][\w]{0,}$/.test(creatRoleName) || creatRoleName == ''){
								alert('角色名称仅能由汉字、字母、数字和下划线组成！');
								return;
							}
						}
					}
					var powerArr = d.get_json();
					if(powerArr && powerArr.length == 0){
						alert("角色权限不能为空");
						location.href = location.href;
						return;
					};
					
					console.log(params1)
//					return;
                    $.ajax({
                    	url: isUrl,
                        data : params1,
                        type : 'post',
                        xhrFields: {
						    withCredentials: true
						},
                        success : function(data){
                        	if(data.responseCode == '000'){
                        		location.href = 'manager.html#/roleAdmin';
                        	}
                        	else if(data.responseCode == '017'){
                        		location.href = location.href;
                        	}
                        	else{
                        		alert(data.responseMsg)
                        	}
                        }
                    })
            });
        }
        })()
	
})