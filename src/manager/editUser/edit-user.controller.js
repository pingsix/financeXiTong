
import $ from 'jquery';

var dependArr = [
	require('./edit-user.service').default.name
]
export default {
	module : angular.module('editUserCtrl',dependArr).controller('editUserController',['$scope','editUserService','$stateParams','util',controller]),
	template : require('./edit-user.template.html')
}
	
    function controller(_,service,$stateParams,util){
        var o,cfg = {}, jq=angular.element;
        _.username = "";
        _.realName="";
        _.email="";
        _.phone="";
        _.remark="";
        _.userPwd = "";
        _.id = $stateParams.id || 0;
        _.userList = [];

        _.verifyStatusArr = [];  // 验证状态
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
        
        _.tellTipShow = function(){
			_.inputTipContext = true;
		}
		_.tellTipHidden = function(){
			_.inputTipContext = false;
		}

        _.dd = true;
        //获取列表
        o = {
            getUserInfoList : function(){
                var cfg = {};
                cfg.id = _.id;
                var	url = '/acc/reviewuser/edit.do';
                service.query(url,cfg).then(function(data){
                    _.userList = data.result.groups;
                    var user = data.result;
                    _.username = user.userId;
                    _.realName = user.userName;
                    _.remark = user.spare1;
                    _.email = user.email;
                    _.phone = user.tel;
                    
					
                    _.$watch("selectData.values",function(){
	                    _.selectData.values.forEach(function(v,i){
	                    	for(var i = 0; i<  _.userList.length; i++){
	                    	 	if(_.userList[i].groupId == v.groupId){
	                    	 		v.checked = true;
	                    	 	}
	                    	}
	                    })
                    })
                },function(reason){
                	alert(reason.responseMsg)
                	if(reason.responseCode == '006'){
                		location.href = "#/manager/user";  
                	}
                });
            },
            getRoleList : function(){
                var cfg = {};
                service.getRoleList(cfg).then(function(data){
                    _.selectData.value = data.result[0].id;
                    _.selectData.values = data.result;
                },function(reason){
                	console.log('获取角色' + data.responseMsg)
                });
            },
            init : function(){
                this.getRoleList();
                this.getUserInfoList();  
            }
        }
        o.init();

        _.test = function(index){
            if(localStorage.getItem('userType') != 2){
                return;
            }
            var arr = _.selectData.values.slice(0);
            arr.forEach(function(v,i,arr){
                    v.checked = false;
                })
            arr[index]['checked'] = true
        }
        
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

        //编辑用户
        _.click = function(cfg){
            var idsArr = [];
            var idStr = (function(){
                var arr = _.selectData.values.slice(0);
                arr.forEach(function(v,i,arr){
                    var isArrJson = {};
                    if(v.checked){
                    	isArrJson.groupId = v.groupId
                    	isArrJson.groupName = v.groupName
                    	isArrJson.id = v.id
                        idsArr.push(isArrJson);
                    }
                })
                return idsArr.length ? idsArr : "";
            })()
            if(idsArr.length == 0){
                alert("请选择角色！")
                return;
             }
            if(!/[0]/.test(_.verifyStatusArr.join(''))){
                service.formSubmit({
                    groups : idStr,
                    id:_.id,
                    email:_.email,
                    userName:_.realName,
                    userId:_.username,
                    spare1:_.remark,
                    tel:_.phone,
                    
                });
            }else{
                return;
            }
            
        }
        _.back = function(){
            location.href="#/manager/user";
        }
        _.realNameKeyup = function(event){
            service.realNameKeyup(_.realName);
        }
        _.remarkKeyup = function(event){
            service.remarkKeyup(_.remark,function(num){
                _.number=num;
            });
        }

        // 邮箱格式验证
        _.mailVerify = function(){
            var emailDom = util.getById('email'),
                regEmail = new RegExp("^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$","g");
            if(!_.email){
                _.mailTip = '邮箱不能为空';
                _.verifyStatusArr[0] = 0;
                emailDom.focus();
                jq(emailDom).addClass('red-border');
                return;
            };
            if(/^\s*$/.test(_.email)){
                _.mailTip = '';
                _.verifyStatusArr[0] = 1;
                jq(emailDom).removeClass('red-border');
                return;
            };
            if(!regEmail.test(_.email)){
                _.mailTip = '邮箱格式错误';
                _.verifyStatusArr[0] = 0;
                jq(emailDom).addClass('red-border');
                emailDom.focus();
                return;
            }else{
                _.mailTip = '';
                _.verifyStatusArr[0] = 1;
                jq(emailDom).removeClass('red-border');
            }
        }

        // 手机号码验证
        _.cellVerify = function(){
            var phoneDom = util.getById('phone');
            if(/^\s*$/.test(_.phone)){
                _.cellTip = '';
                _.verifyStatusArr[1] = 1;
                jq(phoneDom).removeClass('red-border');
                return;
            };
            if(!/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/.test(_.phone)){
                _.cellTip = '手机格式错误';
                _.verifyStatusArr[1] = 0;
                jq(phoneDom).addClass('red-border');
                phoneDom.focus();
            }else{
                _.cellTip = '';
                _.verifyStatusArr[1] = 1;
                jq(phoneDom).removeClass('red-border');
            }
        }


    }

