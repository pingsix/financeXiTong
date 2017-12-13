
import $ from 'jquery';

export default angular
	.module('newRoleSer',[])
	.factory('newRoleService',['util','ajax',roleAdminService]);
    function roleAdminService(util,ajax){
        return {
            query : function(cfg){
                return ajax.post('/acc/role/edit.do',cfg);
            },
            saveRole : function(url,cfg){
            	ajax.post(url,cfg).then(function(data){
            		location.href = '#/manager/role';
            	}
            	,function(reason){
            		alert(reason.responseMsg)
            	})
            },
            verifySbumit : function($scope,d){
            	var isWholeDel = d.get_json().every(function(v){
                	return v.state.selected ? true : false;
                })
            	function reRender(wrapUl){
					wrapUl.children('li').each(function(){
						console.log(26,$(this).attr('aria-selected'))
						$(this).attr('aria-selected',false)
						$(this).children('a').removeClass('jstree-clicked');
						$(this).children('div').eq(0).removeClass('jstree-wholerow-clicked');
						if($(this).children('ul').size()){
							reRender($(this).children('ul').eq(0))
						}
					})
				}
            	
            	if(!$scope.roleName){
                	alert("请输入角色名称！")
                    return false;
                }
            	if($scope.roleId && /(?=[\x21-\x7e]+)[^A-Za-z0-9]/.test($scope.roleId)){
			        alert('角色ID名不能包含特殊符号！');
			        reRender($("#dtree").children().eq(0))
					return false;
			    }
				if($scope.roleId && !/^(?!\d+$)[\da-zA-Z]*$/.test($scope.roleId) || $scope.roleId == ''){
					alert('角色ID名不能为中文或纯数字！');
					reRender($("#dtree").children().eq(0))
					return false;
				}
				if($scope.roleName && !/^[\u4e00-\u9fa5\][\w]{0,}$/.test($scope.roleName) || $scope.roleName == ''){
					alert('角色名称仅能由汉字、字母、数字和下划线组成！');
					reRender($("#dtree").children().eq(0))
					return false;
				}
				//--------有点毛病
				if(isWholeDel){
                	alert("角色权限不能为空");
					reRender($("#dtree").children().eq(0))
					return false;
                }
				//--------有点毛病
                return true;
            }
        };
    }
    
