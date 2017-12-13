
export default angular
	.module('UserAdminSer',[])
	.factory('userAdminService',['util','ajax',userAdminService]);
    function userAdminService(util,ajax){
        return {
            setSelectedLi : function(current){
                var parent = util.parent(current,'ul');
                angular.element(parent).find('li').removeClass('selected');
                angular.element(current).parent().addClass('selected');
            },
            //获取列表
            getUserInfoList : function(cfg){
                return ajax.post('/acc/reviewuser/getUser.do',cfg);
            },
            //通用
            query : function(url,cfg){
                return ajax.post(url,cfg);
            },
            emitPaw : function(id){
            	return ajax.post('/acc/reviewuser/sendRandomPwd.do',{uid:id});
            },
            deblock : function(cfg){
            	return ajax.post('/acc/reviewuser/userUnlock.do',cfg);
            }
        };
    }
   
