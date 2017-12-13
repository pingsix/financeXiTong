
export default angular 
	.module('editUserSer',[])
    .factory('editUserService',['util','ajax','validator',editUserService]);
    function editUserService(util,ajax,validator){
        var doc = document,
            jq = angular.element;

        return {
            //获取角色列表
            getRoleList : function(cfg){
                return ajax.post('/acc/reviewuser/getRole.do',cfg);
            },
            //通用
            query : function(url,cfg){
                return ajax.post(url,cfg);
            },

            //编辑
            formSubmit : function(cfg){
                var that = this;
                if(validator.isEmpty(cfg.userName)){
                    jq(util.getById('realName')).addClass('red-border');
                    util.getById('realName').focus();
                    return;
                }
				if(validator.isEmpty(cfg.email)){
                    jq(util.getById('email')).addClass('red-border');
                    util.getById('email').focus();
                    return;
                }
                ajax.post('/acc/reviewuser/modify.do',cfg).then(function(data){
                    location.href="#/manager/user";
                },function(reason){
                	location.href="login.html";
                })
            },
            realNameKeyup : function(text){
                if(!validator.isEmpty(text)){
                    jq(util.getById('realName')).removeClass('red-border');
                }
            },
            remarkKeyup : function(text,fn){
                if(!validator.isEmpty(text)){
                    jq(util.getById('remark')).removeClass('red-border');
                    var newNum=text.length;
                    var number=200-newNum;
                    console.log(number);
                    fn&&fn(number);
                    if(number<0){
                        event.returnValue = false;
                    }
                }
            }
        };
    }

