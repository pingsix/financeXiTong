webpackJsonp([5],{

/***/ 112:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var dependArr = [__webpack_require__(113).default.name];
	exports.default = {
	    module: angular.module('roleAdminCtr', dependArr).controller('roleAdminController', ['$scope', '$timeout', 'roleAdminService', '$state', controller]),
	    template: __webpack_require__(114)
	};

	function controller(_, $timeout, service, $state) {
	    var o,
	        cfg = {},
	        timer;
	    _.UserInfoList = [];
	    _.selectAllFlag = false;
	    _.pageNo = 1; //页数
	    _.pageSize = 10; //每页多少个
	    _.count = '';
	    _.selectOption = {
	        "type": "select",
	        "name": "Service",
	        "value": "10条",
	        "values": ["10条", "20条", "30条", "40条", "50条"]
	    };

	    _.manager = function (index) {
	        var params = {
	            "no": index
	        };
	        $state.go('manager.newRole', { "object": encodeURI(JSON.stringify(params)) });
	    };

	    _.editRole = function (item) {
	        var params = {
	            "no": 20,
	            "id": item.id,
	            "groupId": item.groupId
	        };
	        $state.go('manager.newRole', { "object": encodeURI(JSON.stringify(params)) });
	    };

	    _.admin = '';
	    /**
	            * 全选
	            * @param {Event} evt
	            */
	    _.checkBoxManage = false;
	    _.allChecked = function () {
	        _.UserInfoList.forEach(function (v) {
	            v['CheckboxFlag'] = _.checkBoxManage;
	        });
	    };
	    //删除
	    _.delAllAction = function () {
	        var idsArr = [],
	            cfg = {},
	            isIds = function () {
	            var arr = _.UserInfoList.slice(0);
	            arr.forEach(function (v, i, arr) {
	                var isArrJson = {};
	                if (v.CheckboxFlag) {
	                    isArrJson.id = v.id, isArrJson.groupId = v.groupId;
	                    idsArr.push(isArrJson);
	                }
	            });
	            return idsArr;
	        }();
	        if (idsArr.length) {
	            if (!confirm('确认删除？')) return;
	            cfg.role = idsArr;
	            service.query('/acc/role/del.do', cfg).then(function (data) {
	                o.laterQueryList();
	            }, function (reason) {
	                alert(reason.responseMsg);
	                o.laterQueryList();
	            });
	        }
	        //          else{
	        //              alert("请选择删除行！");
	        //          }
	    };
	    _.tableClick = function (evt) {
	        var ids2 = []; //全部
	        var listArr = _.UserInfoList.forEach(function (v, i, arr) {
	            if (v.CheckboxFlag) {
	                ids2.push(v.id);
	            }
	        });
	        //有选中状态
	        _.isActive2 = ids2.length ? 'delboxR-Active' : '';
	    };
	    //选择每页显示条数
	    _.selectChange = function (data) {
	        var num = parseInt(data.replace(/(\d+)\D/, '$1'));
	        _.pageSize = num;
	        _.selectOption.value = num + '条';
	        o.laterQueryList();
	        _.pageNo = 1;
	        o.laterQueryList();
	    };

	    /**
	     *  全选框和列表复选框交互
	     * 
	     */
	    _.watchChecked2 = function () {
	        var checked = [],
	            allcheckBox = [];
	        if (_.UserInfoList.length) {
	            for (var i = 0, checkBox = _.UserInfoList; i < checkBox.length; i++) {
	                if (!checkBox[i].beAccept) {
	                    allcheckBox.push(checkBox[i]);
	                }
	                if (checkBox[i].CheckboxFlag) {
	                    checked.push(checkBox[i]);
	                }
	            }
	            if (checked.length < allcheckBox.length) {
	                _.checkBoxManage = false;
	            } else {
	                _.checkBoxManage = true;
	            }
	        }
	    };
	    //获取列表
	    o = {
	        laterQueryList: function laterQueryList() {
	            var that = this;
	            if (timer) {
	                clearTimeout(timer);
	            }
	            timer = setTimeout(function () {
	                that.getUserInfoList();
	            }, 500);
	        },
	        getUserInfoList: function getUserInfoList() {
	            var cfg = {};
	            cfg.pageNo = _.pageNo;
	            cfg.pageSize = _.pageSize;
	            service.getUserInfoList(cfg).then(function (data) {
	                _.UserInfoList = data.result;
	                _.UserInfoList.forEach(function (v) {
	                    v['CheckboxFlag'] = _.selectAllFlag;
	                });
	                _.checkBoxManage = false;
	                if (data.result.length == 0 && _.pageNo !== 1) {
	                    _.pageNo = _.pageNo - 1;
	                    o.getUserInfoList();
	                }
	                _.checkBoxManage = false;
	                _.count = data.totalCount;
	                _.$broadcast('EVT_PAGE_CHANGE', { 'total': data.totalPages, 'current': _.pageNo });
	            }, function (reason) {
	                alert(reason.responseMsg);
	                location.href = '../view/login.html';
	            });
	        },
	        init: function init() {
	            this.getUserInfoList();
	        }
	    };

	    o.init();
	    //        监听page发回的事件
	    _.$on('EVT_PAGE_SELECTED', function (evt, data) {
	        _.pageNo = data.pageSelectedNum;
	        o.getUserInfoList();
	    });
	}

/***/ },

/***/ 113:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = angular.module('roleAdminSer', []).factory('roleAdminService', ['util', 'ajax', roleAdminService]);

	function roleAdminService(util, ajax) {
	    return {
	        parent: function parent(obj) {
	            console.log();
	        },
	        setSelectedLi: function setSelectedLi(current) {
	            var parent = util.parent(current, 'ul');
	            angular.element(parent).find('li').removeClass('selected');
	            angular.element(current).parent().addClass('selected');
	        },
	        //获取列表
	        getUserInfoList: function getUserInfoList(cfg) {
	            return ajax.post('/acc/role/getRole.do', cfg);
	        },
	        //通用
	        query: function query(url, cfg) {
	            return ajax.post(url, cfg);
	        },
	        //列表操作
	        //cfg = {id:item.id,status:item.status}
	        action: function action(cfg, fn) {
	            if (cfg.id) {
	                location.href = '../view/tree.html?id=' + cfg.id + '&roleName=' + cfg.roleName;
	            }
	        }
	    };
	}

/***/ },

/***/ 114:
/***/ function(module, exports) {

	module.exports = "<div class=\"main\">\r\n\t<div class=\"inner\">\r\n\t    <div class=\"content_wrap content_wrapRole\">\r\n\t        <div class=\"inner-header\">\r\n\t            <div class=\"inner-header-lf fl\">角色管理</div>\r\n\t\r\n\t            <div class=\"add_user\">\r\n\t                <a ng-click=\"manager(10)\">\r\n\t                    <span class=\"add\"></span>\r\n\t                    <span>新建角色</span>\r\n\t                </a>\r\n\t            </div>\r\n\t        </div>\r\n\t\r\n\t        <div class=\"inner-body\">\r\n\t            <div class=\"hdFixed\">\r\n\t                <div class=\"hd id\" id=\"tableHD\">\r\n\t                    <p class=\"contentR_shezhi\">\r\n\t                        <label ng-click=\"selectAll();tableClick($event)\">\r\n\t                            <input ng-click = \"allChecked()\" ng-checked = \"checkBoxManage\" ng-model = \"checkBoxManage\" type=\"checkbox\" class=\"c1\" id=\"selectAll\">\r\n\t                            <span class=\"all\">全选</span>\r\n\t                        </label>\r\n\t\r\n\t                    <span class=\"delboxR  {{isActive2}}\" ng-click=\"delAllAction()\">\r\n\t                        <span class=\"delR\"></span>\r\n\t                        <span>删除</span>\r\n\t                    </span>\r\n\t                    </p>\r\n\t                </div>\r\n\t            </div>\r\n\t\r\n\t            <div class=\"inner-table\" style=\"margin: 0 23px\">\r\n\t                <table class=\"table_role oddEvenColor\" ng-click=\"tableClick($event)\">\r\n\t                    <tr class=\"tr_header\">\r\n\t                        <td class=\"c2\"></td>\r\n\t                        <td class=\"role_name\">角色ID</td>\r\n\t                        <td class=\"role_name\">角色名称</td>\r\n\t                        <td class=\"info\">说明</td>\r\n\t                        <td class=\"cz\">操作</td>\r\n\t                    </tr>\r\n\t                    <tr ng-repeat=\"item in UserInfoList\">\r\n\t                        <td><input type=\"checkbox\" ng-change = \"watchChecked2()\" ng-model=\"item.CheckboxFlag\" ng-checked=\"item.CheckboxFlag\"></td>\r\n\t                        <td ng-bind=\"item.groupId\"></td>\r\n\t                        <td ng-bind=\"item.groupName\"></td>\r\n\t                        <td width=\"50%\" ng-bind=\"item.roleExplain\"></td>\r\n\t                        <td>\r\n\t                            <a href=\"javascript:void(0)\" ng-click = \"editRole(item)\">编辑</a>\r\n\t                        </td>\r\n\t                    </tr>\r\n\t                </table>\r\n\t                <div class=\"ft clearfix yeshu\">\r\n\t\t\t            <div class=\"fl ft-lf\">\r\n\t\t\t\t                共<span ng-bind=\"count\"></span>条 每页显示\r\n\t\t\t\t                <select ng-model=\"selectOption.value\" ng-change=\"selectChange(selectOption.value)\" ng-options=\"v for v in selectOption.values\"></select>\r\n\t\t\t\t            </div>\r\n\t\t\t\t            <div class=\"fr ft-rt\">\r\n\t\t\t\t                <div class=\"page\">\r\n\t\t\t\t                    <span page></span>\r\n\t\t\t\t                </div>\r\n\t\t\t\t            </div>\r\n\t\t       \t\t\t </div>\r\n\t            </div>\r\n\t            <div class=\"inner-footer\"></div>\r\n\t        </div>\r\n\t        <div class=\"inner-footer\"></div>\r\n\t    </div>\r\n\t</div>\r\n</div>"

/***/ }

});