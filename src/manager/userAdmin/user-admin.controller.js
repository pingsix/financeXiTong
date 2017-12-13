/**
 * @author hontianyem
 */

import mask from '@bairong/dialog_mask';

var dependArr = [
	require('./user-admin.service').default.name
]
export default {
	module : angular.module('userAdminCtrl',dependArr).controller('managerNewUserController',['$scope','$timeout','userAdminService','$state',controller]),
	template : require('./user-admin.template.html')
}
	
    function controller(_,$timeout,service,$state){
        var o,cfg = {},timer;
        _.startDate = '';         //开始时间
        _.endDate = '';           //结束时间
        _.createUserId = '';      //录入人
        _.status = '';            //名单状态               0未审核   2已审
        _.type = '';              //录入方式               1单笔录入  2批量录入
        _.key = '';               //姓名/邮箱/手机号/身份证号
        _.pageNo = 1;            //页数
        _.pageSize = 10;          //每页多少个
        _.count = '';
        _.selectOption = {
            "type" : "select",
            "name" : "Service",
            "value" : "10条",
            "values" : ["10条","20条","30条","40条","50条"]
        };
		
		
		_.editUser = function(id){
			$state.go('manager.editUser',{"id" : id})
		}
		
        _.admin='';

        _.UserInfoList = [];
        _.selectAllFlag = false;
        /*超级管理员不能新建用户*/
        _.isSuperAdmin = localStorage.getItem('userType') == 2 ? true : false;
        //选择每页显示条数
        _.selectChange = function(data){
            var num = parseInt(data.replace(/(\d+)\D/,'$1'));
            _.pageSize = num;
            _.selectOption.value = num + '条';
            o.laterQueryList();
            _.pageNo = 1;
            o.laterQueryList();
        }
        /**
          * 全选
          * @param {Event} evt
          */
        _.checkBoxManage = false;
        _.allChecked = function(){
            _.UserInfoList.forEach(function(v){
                v['CheckboxFlag'] = _.checkBoxManage;
            })
        }
        //删除
        _.delAllAction = function(){
			var idsArr = [],
 				cfg = {},
	            isIds = (function(){
		        		var arr = _.UserInfoList.slice(0);
		                arr.forEach(function(v,i,arr){
			           		var isArrJson = {};
		                    if(v.CheckboxFlag){
		                    	isArrJson.id = v.id,
		                    	isArrJson.userId = v.userId
		                        idsArr.push(isArrJson);
		                    }
		                })
		                return idsArr;
		       		})();
            if(idsArr.length){
                if(!confirm('确认删除？')) return;
				cfg.queries = idsArr;
                service.query('/acc/reviewuser/del.do',cfg).then(function(data){
                    o.laterQueryList();
                },function(reason){
                	if(reason.status !== 200){
                		alert(reason.message)
                		return;
                	}
                    alert(reason.responseMsg)
                })
            }
        }
        _.tableClick = function(evt){
            var ids2 = [];//全部
            var listArr = _.UserInfoList.forEach(function(v,i,arr){
                if(v.CheckboxFlag){
                    ids2.push(v.id);
                }
            });
            //有选中状态
            _.isActive2 = ids2.length ? 'delboxR-Active' : '';
        }
        
        _.deblocking = function(item){
        	service.deblock({id : item.id}).then(function(data){
        		o.laterQueryList();
        		alert('该用户已解除锁定');
        	},function(reason){
        		alert(reason.responseMsg);
        	})
        }
        
        
        /**
         *  全选框和列表复选框交互
         * 
         */
		 _.watchChecked2 = function(){
        	var checked = [],
        		allcheckBox = [];
	        if(_.UserInfoList.length){
	        	for(var i = 0,checkBox = _.UserInfoList ; i< checkBox.length;i++){
	        		if(!checkBox[i].beAccept){
	        			allcheckBox.push(checkBox[i])
	        		}
	        		if(checkBox[i].CheckboxFlag){
	        			checked.push(checkBox[i])
	        		}
	        	}
	        	if(checked.length < allcheckBox.length){
	        		_.checkBoxManage = false;
	        	}else{
	        		_.checkBoxManage = true;
	        	}
	        }
        }
		 
		_.emitPassword = function(id){
			if(!id) return;
			mask.show();
			service.emitPaw(id).then(function(data){},function(reason){
				if(reason.responseCode == '020'){
					alert('发送邮件失败');
					mask.hidden();
				}
				else if(reason.responseCode == '021'){
					alert('发送邮件成功');
					mask.hidden();
				}
				else{
					console.log(reason.responseMsg)
					mask.hidden();
				}
			})
		}
		 
        //获取列表
        o = {
            laterQueryList : function(){
                var that = this;
                if(timer){
                    clearTimeout(timer);
                }
                timer = setTimeout(function(){
                    that.getUserInfoList();
                },500);
            },
            getUserInfoList : function(){
                var cfg = {
                    pageSize : _.pageSize,               //条数
                    pageNo : _.pageNo                   //页数
                };
                service.getUserInfoList(cfg).then(function(data){
                    _.UserInfoList = data.result;
                    if(!_.UserInfoList) {
                        return;
                    }
                    _.UserInfoList.forEach(function(v,i,arr){
                        v['CheckboxFlag'] = _.selectAllFlag;
                    })
                    _.checkBoxManage = false;
                    if(data.result.length == 0 && _.pageNo !== 1){
                    	_.pageNo = _.pageNo - 1;
                    	o.getUserInfoList();
                    }
                    _.selectAllFlag = false;
                    _.count = data.totalCount;
                    _.$broadcast('EVT_PAGE_CHANGE',{'total':data.totalPages,'current':_.pageNo});
                },function(reason){
                	console.log(reason.responseMsg)
//              	location.href='../view/login.html';
                });
            },
            init : function(){
                this.getUserInfoList();
            }
        }

        o.init();
        //监听page发回的事件
        _.$on('EVT_PAGE_SELECTED',function(evt,data){
            _.pageNo = data.pageSelectedNum;
            o.getUserInfoList();
        })
    }

