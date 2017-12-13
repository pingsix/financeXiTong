
export default angular
	.module('loanCollectInfoSer',[])
	.factory('loanCollectInfo.service',['util','ajax',service]);


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
            getCollectList : function(cfg){
                return ajax.post("/acc/productiondatasummary/selectSummary.do",cfg);
            },
		};
	}
