

export default angular
	.module('handleHeadSer',[])
	.factory('handleHeadService',['ajax','util','validator',service])

function service(ajax,util,validator){
    var jq = angular.element;
	return {
            formSubmit : function(cfg){
            	if(!cfg.oldPassword){
	                alert('请填写原密码!');
	                util.getById('oldPassword').focus();
	                return;
	            }
            	var param = {
            		id:cfg.id,
                	userId: cfg.userId,
            		password : cfg.oldPassword,
            	}
            	ajax.post('/acc/reviewuser/verification.do',param).then(function(data){
            		if(data.result){
            			emitModify();
            		}else{
            			alert('与原密码不符！');
            			util.getById('oldPassword').focus();
            		}
            	},function(reason){
            		alert(reason.responseMsg);
            	})
            	
            	function emitModify(){
	                if(validator.isEmpty(cfg.password)){
	                    jq(util.getById('newPassword')).addClass('red-border');
	                    alert('请填写新密码');
	                    util.getById('newPassword').focus();
	                    return;
	                }
	                delete cfg.oldPassword;
	                ajax.post('/acc/reviewuser/modify.do',cfg).then(function(data){
	                    alert("修改密码成功,请重新登录！");
	                    location.href="./login.html";
	                },function(reason){
	                	alert(reason.responseMsg)
	                })
	            }
            },
            newPasswordKeyup : function(text){
                if(!validator.isEmpty(text)){
                    jq(util.getById('newPassword')).removeClass('red-border');
                }
            },
            confPasswordKeyup : function(text){
                if(!validator.isEmpty(text)){
                    jq(util.getById('confPassword')).removeClass('red-border');
                }
            }
        };
	
}

