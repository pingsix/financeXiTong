

export default angular
	.module('pairSer',[])
	.factory('pairService',['util','ajax',service])

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
        upService : function(){
        	return ajax.post();
        },
        downLoadFile : function(){
        	return ajax.post();
        },
        freezeCtrl : function(){
        	return ajax.post();
        },
        getProductionaccpartnerList : function(cfg){
        	return ajax.post("/acc/productionaccpartner/list.do",cfg);
        },
        delete : function(cfg) {
            return ajax.post("/acc/productionaccpartner/deleteProductionAccPartner.do",cfg);
        },
        save : function(cfg){
            return ajax.post('/acc/productionaccpartner/save.do',cfg);
        },
        getPairList : function(cfg){
            return ajax.post("/acc/productionaccpartner/accpartnerlist.do",cfg);
        },
        getAccSideList : function(cfg){
            return ajax.post("/acc/productionaccpartner/bankrollParList.do",cfg);
        }
	}
}
