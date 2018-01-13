/**
 * 
 */
export default angular
	.module('loanMenInfoSer',[])
	.factory('viewDetailService',['util','ajax','validator',service]);
	
	function service(util,ajax){
		return {
            setSelectedLi : function(current){
                var parent = util.parent(current,'ul');
                    angular.element(parent).find('li').removeClass('selected');
                    angular.element(current).parent().addClass('selected');
            },
            getDate : function(val,fn){
                fn && fn(val);
            },
            /**
	          * 获取待审列表
	          * @param {JSON} cfg
	          */
            getViewDetailData : function(cfg){
                return ajax.post("/acc/borrowerInformation/selectBorrower.do",cfg);
            },
            //打电话
            callUp : function(cfg){
            	console.log(cfg)
                return ajax.post('/acc/garfield/call.do',cfg);
            },
          //代扣
            overReceivableFlag : function(cfg){
            	return ajax.post('/acc/productioncollection/save.do',cfg);
            },
            //结束催收
            emitInfo : function(cfg){
            	return ajax.post('/acc/productioncollectionend/save.do',cfg);
            },
            //查询当前是否有催收中的状态
			checkStatus : function(){
				var flag = {status:'',msg:''};
				ajax.post('/acc/productioncollection/getConnectionComing.do',cfg).then(function(data){
				},function(reason){
					if(reason.responseCode === '019'){
						flag.status = false;
						flag.msg = reason.responseMsg;
					}
				})
				return flag;
			},
			editPeriodsInfo : function(cfg){
				return ajax.post('/acc/borrowerInformation/modify.do',cfg);
			},
			editPeriodsRecord : function(cfg){
				return ajax.post('/acc/productionLoanManual/getModifyRecords.do',cfg);
			}
			
		};
}
