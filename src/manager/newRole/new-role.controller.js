/**
 * @author hontianyem
 * last 2016/12/27modify
 */
import $ from "jquery";

import source from '../../tools/utils/menuResources';

//import jstree from 'jstree';
import jstree from '@bairong/pro_jstree';

import treeTransform from "../../tools/widgets/oTree/treeTransform";

function controller($scope,service,$state,$stateParams){
    var onParams = JSON.parse(decodeURI($state.params.object));
    if(onParams.no && onParams.no == "10") $scope.roleShowId = true;

    function redactRole(){
        if(onParams.id){
        	$scope.title = "编辑角色";
            service.query({id:onParams.id}).then(function(data){
		        var current =  typeof data.result !== 'undefined' && typeof data.result.roles !== 'undefined' ? JSON.parse(data.result.roles) : source;
		        
		        if(typeof current[0] == 'string') current = treeTransform.ids2tree(current,source);
				render(current,source);
				
				$scope.roleName = data.result.groupName;
				$scope.remark = data.result.roleExplain;
				$scope.isEdit = true;
            },
            function(reason){
            	location.href="./login.html";
            })
	    }else{
	        render(source,source);
	        $scope.title = "新建角色";
	        $scope.roleName = "";
	    }
    }
	redactRole();


    function render(current,source){
        source = jstree.resetSource(source); 
        current = jstree.resetCurrent(current);
        source = jstree.mix(source,current);
			
        var selectNodes = [],d;
        $('#dtree').jstree(jstree.config(source));
        d = $('#dtree').jstree(true);
        $('#dtree').bind('loaded.jstree',function(e){
            d.open_all();
        })
        $('#btnSave').bind('click',function(e){
            if(!service.verifySbumit($scope,d)) return;
            e.preventDefault();
            e.stopPropagation();
            d.open_all();
            selectNodes = d.get_selected();
            d.delete_node(selectNodes);
                
            saveEmitter(d);
        });
    }
        
        
    function saveEmitter(d){
        var isUrl,
            params1 = {};
		if(typeof onParams.no !== 'undefined' && onParams.no == '10'){
			isUrl = '/acc/role/addRoles.do';   
			params1 = {
				groupId : $scope.roleId,
				groupName : $scope.roleName,
				roleExplain : $scope.remark,
				roles : treeTransform.tree2ids(JSON.stringify(d.get_json()))
			}
		}else{
			isUrl = '/acc/role/modify.do';    
			params1={
				id : onParams.id,
				roupId : onParams.groupId,
			    groupName :$scope.roleName,
			    roleExplain : $scope.remark,
			    roles: treeTransform.tree2ids(JSON.stringify(d.get_json()))
			};
		}
		service.saveRole(isUrl,params1)
    }
}

var dependArr = [
	require('./new-role.service').default.name
]

export default {
	module : angular.module('newRoleCtrl',dependArr).controller('newRoleCtroller',['$scope','newRoleService','$state','$stateParams',controller]),
	template : require('./new-role.template.html')
}	
