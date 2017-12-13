webpackJsonp([9],{

/***/ 130:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	__webpack_require__(131);

	var dependArr = [__webpack_require__(133).default.name];
	exports.default = {
	    module: angular.module('handleHeadCtrl', dependArr).controller('handleHeadCtroller', ['$scope', 'handleHeadService', '$state', controller]),
	    template: __webpack_require__(134)
	};

	function controller(_, service, $state) {
	    _.stateParams = JSON.parse($state.params.object);
	    console.log(10, _.stateParams);
	    _.url = window.location.href;
	    if (_.url.indexOf('comingDay') !== -1) alert("你的密码已到期，请及时修改密码！");

	    _.userId = _.stateParams.userId;

	    _.click = function (cfg) {
	        if (!_.oldPassword || !_.newPassword) {
	            alert('请完整填写信息！');
	            return;
	        }
	        if (_.oldPassword === _.newPassword) {
	            alert('新密码不能和旧密码相同！');
	            return;
	        }
	        if (_.confPassword !== _.newPassword) {
	            alert('两次密码输入不一致！');
	            return;
	        }
	        service.formSubmit({
	            id: _.stateParams.id,
	            userId: _.stateParams.userId,
	            password: _.newPassword,
	            oldPassword: _.oldPassword
	        });
	    };
	    _.back = function () {
	        window.history.back();
	    };
	    _.newPasswordKeyup = function (event) {
	        service.newPasswordKeyup(_.newPassword);
	    };
	    _.confPasswordKeyup = function (event) {
	        service.confPasswordKeyup(_.confPassword);
	    };
	}

/***/ },

/***/ 131:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(132);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(16)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(132, function() {
				var newContent = __webpack_require__(132);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 132:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)();
	// imports


	// module
	exports.push([module.id, ".ml54{\r\n\tmargin-left: 54px;\r\n}\r\n.content_pwd .mt80{\r\n\tmargin-top: 80px;\r\n}\r\n.title-pwd{\r\n\tfont-size: 14px;\r\n    font-weight: bold;\r\n    color: #323236;\r\n    padding-left: 10px;\r\n    margin-top: 24px;\r\n\tmargin-bottom: 120px;\r\n}\r\n.content_pwd{\r\n\twidth: 100%;\r\n}\r\n.content_pwd p{\r\n\tpadding-left:40%;\r\n\tmargin: 20px;\r\n\theight: 24px;\r\n}\r\n.content_pwd p span,input{\r\n\theight: 22px;\r\n}\r\n.content_pwd p span{\r\n\twidth: 70px;\r\n\tdisplay: inline-block;\r\n\ttext-align: right;\r\n}\r\n.content_pwd p input{\r\n\tpadding: 1px 6px;\r\n}\r\n", ""]);

	// exports


/***/ },

/***/ 133:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = angular.module('handleHeadSer', []).factory('handleHeadService', ['ajax', 'util', 'validator', service]);


	function service(ajax, util, validator) {
	    var jq = angular.element;
	    return {
	        formSubmit: function formSubmit(cfg) {
	            if (!cfg.oldPassword) {
	                alert('请填写原密码!');
	                util.getById('oldPassword').focus();
	                return;
	            }
	            var param = {
	                id: cfg.id,
	                userId: cfg.userId,
	                password: cfg.oldPassword
	            };
	            ajax.post('/acc/reviewuser/verification.do', param).then(function (data) {
	                if (data.result) {
	                    emitModify();
	                } else {
	                    alert('与原密码不符！');
	                    util.getById('oldPassword').focus();
	                }
	            }, function (reason) {
	                alert(reason.responseMsg);
	            });

	            function emitModify() {
	                if (validator.isEmpty(cfg.password)) {
	                    jq(util.getById('newPassword')).addClass('red-border');
	                    alert('请填写新密码');
	                    util.getById('newPassword').focus();
	                    return;
	                }
	                delete cfg.oldPassword;
	                ajax.post('/acc/reviewuser/modify.do', cfg).then(function (data) {
	                    alert("修改密码成功,请重新登录！");
	                    location.href = "./login.html";
	                }, function (reason) {
	                    alert(reason.responseMsg);
	                });
	            }
	        },
	        newPasswordKeyup: function newPasswordKeyup(text) {
	            if (!validator.isEmpty(text)) {
	                jq(util.getById('newPassword')).removeClass('red-border');
	            }
	        },
	        confPasswordKeyup: function confPasswordKeyup(text) {
	            if (!validator.isEmpty(text)) {
	                jq(util.getById('confPassword')).removeClass('red-border');
	            }
	        }
	    };
	}

/***/ },

/***/ 134:
/***/ function(module, exports) {

	module.exports = "<div class=\"title-pwd\">修改密码</div>\r\n<div class=\"content_pwd\">\r\n    <p>\r\n        <span>账号：</span>\r\n        <input type=\"text\" disabled ng-model=\"userId\">\r\n    </p>\r\n    <p>\r\n        <span>原密码：</span>\r\n        <input type=\"password\" ng-model=\"oldPassword\" id=\"oldPassword\">\r\n    </p>\r\n    <p>\r\n        <span>新密码：</span>\r\n        <input type=\"password\" ng-model=\"newPassword\" id=\"newPassword\" maxlength=\"20\" ng-keyup=\"newPasswordKeyup(event)\">\r\n    </p>\r\n    <p>\r\n        <span>确认密码：</span>\r\n        <input type=\"password\" ng-model=\"confPassword\" id=\"confPassword\" maxlength=\"20\" ng-keyup=\"confPasswordKeyup(event)\">\r\n    </p>\r\n    <p class=\"btn mt80\">\r\n        <button class=\"save\" ng-click=\"click()\">修 改</button>\r\n        <button class=\"back ml54\" id=\"back\" ng-click=\"back()\">返 回</button>\r\n    </p>\r\n</div>"

/***/ }

});