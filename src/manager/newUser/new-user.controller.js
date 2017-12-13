
import $ from 'jquery';

var dependArr = [
	require('./new-user.service').default.name
]
export default {
	module :　angular.module('newUserCtr',dependArr).controller('newUserController',['$scope','$timeout','newUserService',controller]),
	template : require('./new-user.template.html')
}
    function controller(_,$timeout,service){
        var o,cfg = {};
        _.selectData = {
            type : 'select',
            name : 'select',
            value : "",
            values : []
        }
        _.number=200;
        _.selectDataChange = function(){
            //alert(_.selectData.value);
        }
        _.flag = false;
        //获取列表
        var o = {
            getUserInfoList : function(){
                var cfg = {};
                service.getUserInfoList(cfg).then(function(data){
	                _.selectData.values = data.result;
                },function(reason){
                	alert("角色拉取失败！")
                });
            },
            init : function(){
                this.getUserInfoList();
            }
        }
        o.init();
        
        _.showflag = true;
        _.taggleAll = function(){
        	if(_.showflag){
        		$("#roleid").removeClass("rolesWrapper");
        		_.showflag = false;
        	}else{
        		$("#roleid").addClass("rolesWrapper");
        		_.showflag = true;
        	}
        }
        
        _.tellTipShow = function(){
			_.inputTipContext = true;
		}
		_.tellTipHidden = function(){
			_.inputTipContext = false;
		}
        
        _.click = function(cfg){
            var idsArr = [];
            var idStr = (function(){
          		var arr = _.selectData.values.slice(0);
                arr.forEach(function(v,i,arr){
	           		var isArrJson = {};
                    if(v.checked){
                    	isArrJson.groupId = v.groupId;
                    	isArrJson.groupName = v.groupName;
                    	isArrJson.id = v.id;
                        idsArr.push(isArrJson);
                    }
                })
                return idsArr.length ? idsArr : alert("请选择角色！");
            })()
            if(idsArr.length==0){
                return
            }
            service.formSubmit({
                groups : idStr,
                userId: _.username||"",
                userName: _.realName||"",
                spare1: _.remark||"",
                email: _.userMail || "",
                tel : _.userTel || ""
            })
        }
        _.back = function(){
            location.href = '#/manager/user';
        }
        _.yanzheng = function(cfg){
        	return;
            service.formSubmit01({
                username: _.username||""
            },function(){
                _.flag = true;
            })
        }
        _.usernameKeyup = function(event){
            service.usernameKeyup(_.username);
        }
        _.realNameKeyup = function(event){
            service.realNameKeyup(_.realName);
        }
        _.userMailKeyup = function(event){
            service.userMailKeyup(_.userMail);
        }
        _.userTelKeyup = function(event){
            service.userTelKeyup(_.userTel);
        }
        _.remarkKeyup = function(event){
            service.remarkKeyup(_.remark,function(num){
                _.number = num;
            });
        }
    }
   
