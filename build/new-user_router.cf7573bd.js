webpackJsonp([6],{

/***/ 115:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _jquery = __webpack_require__(109);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var dependArr = [__webpack_require__(116).default.name];
	exports.default = {
	    module: angular.module('newUserCtr', dependArr).controller('newUserController', ['$scope', '$timeout', 'newUserService', controller]),
	    template: __webpack_require__(117)
	};

	function controller(_, $timeout, service) {
	    var o,
	        cfg = {};
	    _.selectData = {
	        type: 'select',
	        name: 'select',
	        value: "",
	        values: []
	    };
	    _.number = 200;
	    _.selectDataChange = function () {
	        //alert(_.selectData.value);
	    };
	    _.flag = false;
	    //获取列表
	    var o = {
	        getUserInfoList: function getUserInfoList() {
	            var cfg = {};
	            service.getUserInfoList(cfg).then(function (data) {
	                _.selectData.values = data.result;
	            }, function (reason) {
	                alert("角色拉取失败！");
	            });
	        },
	        init: function init() {
	            this.getUserInfoList();
	        }
	    };
	    o.init();

	    _.showflag = true;
	    _.taggleAll = function () {
	        if (_.showflag) {
	            (0, _jquery2.default)("#roleid").removeClass("rolesWrapper");
	            _.showflag = false;
	        } else {
	            (0, _jquery2.default)("#roleid").addClass("rolesWrapper");
	            _.showflag = true;
	        }
	    };

	    _.tellTipShow = function () {
	        _.inputTipContext = true;
	    };
	    _.tellTipHidden = function () {
	        _.inputTipContext = false;
	    };

	    _.click = function (cfg) {
	        var idsArr = [];
	        var idStr = function () {
	            var arr = _.selectData.values.slice(0);
	            arr.forEach(function (v, i, arr) {
	                var isArrJson = {};
	                if (v.checked) {
	                    isArrJson.groupId = v.groupId;
	                    isArrJson.groupName = v.groupName;
	                    isArrJson.id = v.id;
	                    idsArr.push(isArrJson);
	                }
	            });
	            return idsArr.length ? idsArr : alert("请选择角色！");
	        }();
	        if (idsArr.length == 0) {
	            return;
	        }
	        service.formSubmit({
	            groups: idStr,
	            userId: _.username || "",
	            userName: _.realName || "",
	            spare1: _.remark || "",
	            email: _.userMail || "",
	            tel: _.userTel || ""
	        });
	    };
	    _.back = function () {
	        location.href = '#/manager/user';
	    };
	    _.yanzheng = function (cfg) {
	        return;
	        service.formSubmit01({
	            username: _.username || ""
	        }, function () {
	            _.flag = true;
	        });
	    };
	    _.usernameKeyup = function (event) {
	        service.usernameKeyup(_.username);
	    };
	    _.realNameKeyup = function (event) {
	        service.realNameKeyup(_.realName);
	    };
	    _.userMailKeyup = function (event) {
	        service.userMailKeyup(_.userMail);
	    };
	    _.userTelKeyup = function (event) {
	        service.userTelKeyup(_.userTel);
	    };
	    _.remarkKeyup = function (event) {
	        service.remarkKeyup(_.remark, function (num) {
	            _.number = num;
	        });
	    };
	}

/***/ },

/***/ 116:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = angular.module('newUserSer', []).factory('newUserService', ['util', 'ajax', 'validator', newUserService]);

	function newUserService(util, ajax, validator) {
	    var doc = document,
	        jq = angular.element;
	    return {
	        //获取列表
	        getUserInfoList: function getUserInfoList(cfg) {
	            return ajax.post('/acc/reviewuser/new.do', cfg);
	        },
	        formSubmit: function formSubmit(cfg) {
	            var that = this;
	            if (cfg.userId == '') {
	                jq(util.getById('username1')).addClass('red-border');
	                util.getById('username1').focus();
	                alert('账号不能为空！');
	                return;
	            }
	            if (/(?=[\x21-\x7e]+)[^A-Za-z0-9]/.test(cfg.userId)) {
	                jq(util.getById('username1')).addClass('red-border');
	                util.getById('username1').focus();
	                alert('账户名不能包含特殊符号！');
	                return;
	            }
	            if (!/^(?!\d+$)[\da-zA-Z]*$/.test(cfg.userId)) {
	                jq(util.getById('username1')).addClass('red-border');
	                util.getById('username1').focus();
	                alert('账户名不能为中文或纯数字！');
	                return;
	            }
	            if (validator.isEmpty(cfg.userName)) {
	                jq(util.getById('realName')).addClass('red-border');
	                util.getById('realName').focus();
	                alert('用户名不能为空');
	                return;
	            }
	            var reg = /^[\u4E00-\u9FA5]{2,}$/g;
	            if (!reg.test(cfg.userName)) {
	                jq(util.getById('realName')).addClass('red-border');
	                util.getById('realName').focus();
	                alert("姓名长度不能少于2位，仅可以输入汉字");
	                return;
	            }
	            if (!cfg.email) {
	                jq(util.getById('userMail')).addClass('red-border');
	                util.getById('userMail').focus();
	                alert('邮箱不能为空');
	                return;
	            }
	            var regEmail = new RegExp("^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$", "g");
	            if (!validator.isEmpty(cfg.email)) {
	                if (!regEmail.test(cfg.email)) {
	                    jq(util.getById('userMail')).addClass('red-border');
	                    util.getById('userMail').focus();
	                    alert('邮箱格式错误');
	                    return;
	                }
	            }
	            if (!validator.isEmpty(cfg.tel)) {
	                if (!/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/.test(cfg.tel)) {
	                    jq(util.getById('userTel')).addClass('red-border');
	                    util.getById('userTel').focus();
	                    alert('手机格式错误');
	                    return;
	                }
	            }

	            ajax.post('/acc/reviewuser/addUser.do', cfg).then(function (data) {
	                alert('随机密码已发送');
	                location.href = "#/manager/user";
	            });
	        },
	        formSubmit01: function formSubmit01(cfg, fn) {
	            var usernameDom = util.getById('username1'),
	                savaDom = util.getById('save');
	            if (validator.isEmpty(cfg.username)) {
	                jq(usernameDom).addClass('red-border');
	                savaDom.focus();
	                //alert("请输入账号")
	                return;
	            }
	        },
	        usernameKeyup: function usernameKeyup(text) {
	            if (!validator.isEmpty(text)) {
	                jq(util.getById('username1')).removeClass('red-border');
	            }
	        },
	        realNameKeyup: function realNameKeyup(text) {
	            if (!validator.isEmpty(text)) {
	                jq(util.getById('realName')).removeClass('red-border');
	            }
	        },
	        userMailKeyup: function userMailKeyup(text) {
	            if (!validator.isEmpty(text)) {
	                jq(util.getById('userMail')).removeClass('red-border');
	            }
	        },
	        userTelKeyup: function userTelKeyup(text) {
	            if (!validator.isEmpty(text)) {
	                jq(util.getById('userTel')).removeClass('red-border');
	            }
	        },
	        remarkKeyup: function remarkKeyup(text, fn) {
	            if (!validator.isEmpty(text)) {
	                //jq(util.getById('remark')).removeClass('red-border');
	                var newNum = text.length;
	                var number = 200 - newNum;
	                fn && fn(number);
	                if (number < 0) {
	                    event.returnValue = false;
	                }
	            }
	        }
	    };
	}

/***/ },

/***/ 117:
/***/ function(module, exports) {

	module.exports = "<div class=\"main\">\r\n\t<div class=\"inner\" style=\"border: 1px solid transparent\">\r\n\t    <div class=\"title\" style=\"margin-top: 24px\">新建用户</div>\r\n\t    <div class=\"content content_newUser\">\r\n\t       \t\t<div id=\"roleid\" class=\"rolesWrapper\" style=\"padding:0 20% 0 27%; position: relative;\">\r\n\t\t            <span class=\"fl\"><i class=\"not-null\">*</i>角色：</span>\r\n\t\t            <div class=\"fr lablesWrapper\">\r\n\t\t            \t<label ng-repeat=\"item in selectData.values\" class=\"lables\">\r\n\t\t                \t<input ng-model=\"item.checked\" ng-change = 'saveRoles()' name=\"roleName\" type=\"checkbox\" value=\"{{item.groupId}}\" >&nbsp;{{item.groupName}}\r\n\t\t           \t\t</label>\r\n\t\t            </div>\r\n\t\t            <div ng-click = \"taggleAll()\" class=\"showBtn\">&#9660;</div>\r\n\t\t        </div>\r\n\t\t        <div class=\"clearfl\"></div>\r\n\t\t        <p>\r\n\t\t            <span><i class=\"not-null\">*</i>账号：</span>\r\n\t\t            <input type=\"text\" id=\"username1\" ng-model=\"username\" maxlength=\"20\" ng-keyup=\"usernameKeyup(event)\" ng-blur=\"yanzheng()\">\r\n\t\t            <!-- <span class=\"yanzheng\" ng-click=\"yanzheng()\">验证账号</span> -->\r\n\t\t        </p>\r\n\t\t        <p>\r\n\t\t            <span><i class=\"not-null\">*</i>姓名：</span>\r\n\t\t            <input type=\"text\" id=\"realName\" ng-model=\"realName\" maxlength=\"20\" ng-keyup=\"realNameKeyup(event)\">\r\n\t\t        </p>\r\n\t\t        <p>\r\n\t\t            <span><i class=\"not-null\">*</i>邮箱：</span>\r\n\t\t            <input type=\"text\" id=\"userMail\" ng-model=\"userMail\" maxlength=\"50\" ng-keyup=\"userMailKeyup(event)\">\r\n\t\t        </p>\r\n\t\t        <p>\r\n\t\t            <span>固定号码：</span>\r\n\t\t            <input type=\"text\" id=\"userTel\" ng-model=\"userTel\" maxlength=\"18\" ng-keyup=\"userTelKeyup(event)\">\r\n\t\t            <i ng-mouseOver = \"tellTipShow()\" ng-mouseOut = \"tellTipHidden()\" class=\"inputTip\"></i>\r\n\t                <a ng-show = \"inputTipContext\" class=\"inputTipBlank\">例：010-12345678/13812345678</a>\r\n\t\t        </p>\r\n\t\t        <p class=\"text\" style=\"height: 180px;\">\r\n\t\t            <span class=\"beizhu\">备注：</span>\r\n\t\t            <textarea cols=\"50\" rows=\"8\" id=\"remark\" ng-model=\"remark\" ng-keyup=\"remarkKeyup(event)\" maxlength=\"200\"></textarea>\r\n\t\t            &nbsp;还能输入<span class=\"number\" id=\"number\" ng-bind=\"number\"></span>个字符\r\n\t\t        </p>\r\n\t\t        <p class=\"btn\">\r\n\t\t            <button class=\"btn6 btn7-disabled save\" ng-click=\"click()\" id=\"save\">保 存</button>\r\n\t\t            <button class=\"btn7 ml54\" id=\"back\" ng-click=\"back()\">返 回</button>\r\n\t\t        </p>\r\n\t    </div>\r\n\t    <div class=\"inner-footer\"></div>\r\n\t</div>\r\n</div>\r\n"

/***/ }

});