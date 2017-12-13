var dependArr = [
		require('./role-admin.service').default.name
	]
export default {
	module : angular.module('roleAdminCtr',dependArr).controller('roleAdminController',['$scope','$timeout','roleAdminService','$state',controller]),
	template : require('./role-admin.template.html')
}
    function controller(_,$timeout,service,$state){
        var o,cfg = {},timer;
        _.UserInfoList = [];
        _.selectAllFlag = false;
        _.pageNo = 1;            //页数
        _.pageSize = 10;          //每页多少个
        _.count = '';
        _.selectOption = {
            "type" : "select",
            "name" : "Service",
            "value" : "10条",
            "values" : ["10条","20条","30条","40条","50条"]
        };
        
        
        _.manager = function(index){
        	var params = {
        		"no" : index
        	}
        	$state.go('manager.newRole',{"object" :　encodeURI(JSON.stringify(params))})
        }
        
        
		_.editRole = function(item){
			var params = {
				"no" : 20,
				"id" : item.id,
				"groupId" : item.groupId
			}
			$state.go('manager.newRole',{"object" :　encodeURI(JSON.stringify(params))})
		}
		
		
        _.admin='';
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
		                    	isArrJson.groupId = v.groupId
		                        idsArr.push(isArrJson);
		                    }
		                })
		                return idsArr;
		       			})();
            if(idsArr.length){
                if(!confirm('确认删除？')) return;
                cfg.role = idsArr;
                service.query('/acc/role/del.do',cfg).then(function(data){
                    o.laterQueryList();
                },function(reason){
                	alert(reason.responseMsg);
                	o.laterQueryList();
                })
            }
//          else{
//              alert("请选择删除行！");
//          }
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
                var cfg = {};
                cfg.pageNo = _.pageNo;
                cfg.pageSize = _.pageSize;
                service.getUserInfoList(cfg).then(function(data){
                    _.UserInfoList = data.result;
                    _.UserInfoList.forEach(function(v){
                    	v['CheckboxFlag'] = _.selectAllFlag;
                    })
                    _.checkBoxManage = false;
                    if(data.result.length == 0 && _.pageNo !== 1){
                    	_.pageNo = _.pageNo - 1;
                    	o.getUserInfoList();
                    }
                    _.checkBoxManage = false;
                    _.count = data.totalCount;	
                    _.$broadcast('EVT_PAGE_CHANGE',{'total':data.totalPages,'current':_.pageNo});
                },function(reason){
                	alert(reason.responseMsg)
                	location.href='../view/login.html';
                });
            },
            init : function(){
                this.getUserInfoList();
            }
        }

        o.init();
//        监听page发回的事件
          _.$on('EVT_PAGE_SELECTED',function(evt,data){
              _.pageNo = data.pageSelectedNum;
              o.getUserInfoList();
          
          })
    }
   
