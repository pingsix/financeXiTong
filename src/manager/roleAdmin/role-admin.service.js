


export default angular
	.module('roleAdminSer',[])
	.factory('roleAdminService',['util','ajax',roleAdminService]);
    function roleAdminService(util,ajax){
        return {
            parent : function(obj){
                console.log()
            },
            setSelectedLi : function(current){
                var parent = util.parent(current,'ul');
                angular.element(parent).find('li').removeClass('selected');
                angular.element(current).parent().addClass('selected');
            },
            //获取列表
            getUserInfoList : function(cfg){
                return ajax.post('/acc/role/getRole.do',cfg);
            },
            //通用
            query : function(url,cfg){
                return ajax.post(url,cfg);
            },
            //列表操作
            //cfg = {id:item.id,status:item.status}
            action : function(cfg,fn){
                if(cfg.id){
                    location.href='../view/tree.html?id=' + cfg.id + '&roleName=' + cfg.roleName;
                }
            }
        };
    }
    
