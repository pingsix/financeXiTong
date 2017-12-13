

export default angular
	.module('newOrganicSer',[])
	.factory('newOrganicService',['util','ajax',service])

function service(util,ajax){
	return {
		getBaseData : function(){
			return ajax.post('/acc/accountpartner/new.do');
		},
		getEditBaseData : function(){
			return ajax.post('/acc/accountpartner/edit.do');
		},
		update : function(param){
			return ajax.post('/acc/accountpartner/saveProductionPartner.do', param);
		},
		upDatePro : function(param){
			return ajax.post('/acc/accountpartner/updateProductionPartner.do',param);
		},
		get : function(param){
			return ajax.post("/acc/accountpartner/getList.do",param);
		},
		creatCertificate : function(cfg){
			return ajax.post('/acc/accountpartner/buildCerPfxName.do',cfg)
		}
	}
}
