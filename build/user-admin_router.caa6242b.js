webpackJsonp([4],{

/***/ 107:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _dialog_mask = __webpack_require__(108);

	var _dialog_mask2 = _interopRequireDefault(_dialog_mask);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var dependArr = [__webpack_require__(110).default.name]; /**
	                                                                 * @author hontianyem
	                                                                 */

	exports.default = {
	    module: angular.module('userAdminCtrl', dependArr).controller('managerNewUserController', ['$scope', '$timeout', 'userAdminService', '$state', controller]),
	    template: __webpack_require__(111)
	};


	function controller(_, $timeout, service, $state) {
	    var o,
	        cfg = {},
	        timer;
	    _.startDate = ''; //开始时间
	    _.endDate = ''; //结束时间
	    _.createUserId = ''; //录入人
	    _.status = ''; //名单状态               0未审核   2已审
	    _.type = ''; //录入方式               1单笔录入  2批量录入
	    _.key = ''; //姓名/邮箱/手机号/身份证号
	    _.pageNo = 1; //页数
	    _.pageSize = 10; //每页多少个
	    _.count = '';
	    _.selectOption = {
	        "type": "select",
	        "name": "Service",
	        "value": "10条",
	        "values": ["10条", "20条", "30条", "40条", "50条"]
	    };

	    _.editUser = function (id) {
	        $state.go('manager.editUser', { "id": id });
	    };

	    _.admin = '';

	    _.UserInfoList = [];
	    _.selectAllFlag = false;
	    /*超级管理员不能新建用户*/
	    _.isSuperAdmin = localStorage.getItem('userType') == 2 ? true : false;
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
	                    isArrJson.id = v.id, isArrJson.userId = v.userId;
	                    idsArr.push(isArrJson);
	                }
	            });
	            return idsArr;
	        }();
	        if (idsArr.length) {
	            if (!confirm('确认删除？')) return;
	            cfg.queries = idsArr;
	            service.query('/acc/reviewuser/del.do', cfg).then(function (data) {
	                o.laterQueryList();
	            }, function (reason) {
	                if (reason.status !== 200) {
	                    alert(reason.message);
	                    return;
	                }
	                alert(reason.responseMsg);
	            });
	        }
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

	    _.deblocking = function (item) {
	        service.deblock({ id: item.id }).then(function (data) {
	            o.laterQueryList();
	            alert('该用户已解除锁定');
	        }, function (reason) {
	            alert(reason.responseMsg);
	        });
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

	    _.emitPassword = function (id) {
	        if (!id) return;
	        _dialog_mask2.default.show();
	        service.emitPaw(id).then(function (data) {}, function (reason) {
	            if (reason.responseCode == '020') {
	                alert('发送邮件失败');
	                _dialog_mask2.default.hidden();
	            } else if (reason.responseCode == '021') {
	                alert('发送邮件成功');
	                _dialog_mask2.default.hidden();
	            } else {
	                console.log(reason.responseMsg);
	                _dialog_mask2.default.hidden();
	            }
	        });
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
	            var cfg = {
	                pageSize: _.pageSize, //条数
	                pageNo: _.pageNo //页数
	            };
	            service.getUserInfoList(cfg).then(function (data) {
	                _.UserInfoList = data.result;
	                if (!_.UserInfoList) {
	                    return;
	                }
	                _.UserInfoList.forEach(function (v, i, arr) {
	                    v['CheckboxFlag'] = _.selectAllFlag;
	                });
	                _.checkBoxManage = false;
	                if (data.result.length == 0 && _.pageNo !== 1) {
	                    _.pageNo = _.pageNo - 1;
	                    o.getUserInfoList();
	                }
	                _.selectAllFlag = false;
	                _.count = data.totalCount;
	                _.$broadcast('EVT_PAGE_CHANGE', { 'total': data.totalPages, 'current': _.pageNo });
	            }, function (reason) {
	                console.log(reason.responseMsg);
	                //              	location.href='../view/login.html';
	            });
	        },
	        init: function init() {
	            this.getUserInfoList();
	        }
	    };

	    o.init();
	    //监听page发回的事件
	    _.$on('EVT_PAGE_SELECTED', function (evt, data) {
	        _.pageNo = data.pageSelectedNum;
	        o.getUserInfoList();
	    });
	}

/***/ },

/***/ 108:
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(109)

	/**
	  * mask遮罩
	  */
	var mask = {
		crrentHeight : 0,
		defaultStyle : function(){
			return {
				height : "auto",
				zIndex : 1000,
				display: 'block',
				opacity: 0.7,
				background : '#000',
				position :'absolute',
				top : 0,
				right : 0,
				bottom :0,
				left : 0,
			}
		},
		creatMask : function(pn,cg){
			if(!pn) {
				throw new Error('parent element is null ! plase creat element  fill secend param(only id)');
			};
			var wrapName,maskElm; 
			wrapName = $("#" + pn);
			maskElm = document.createElement('div');
			maskElm.id = 'maskDialog';
			wrapName.append(maskElm);
			
			var maskConfig = cg || Object.keys(cg).length || this.defaultStyle();
			this.maskAddStyle(maskConfig);
		},
		addStyle : function(styleList){
			var elm = $("#maskDialog");
			if(!$("#maskDialog").size()){
				throw new Error('the id#maskDialog is no defined');
				return
			}
			elm.css(styleList);
		},
		maskAddStyle : function(maskConfig){
			if(!maskConfig || !Object.keys(maskConfig).length) {
				this.addStyle(this.defaultStyle());
				return;
			};
			var initStyle = this.defaultStyle();
			var styleList = {};
			
			for(var k in initStyle){
				if(!maskConfig[k]){
					styleList[k] = initStyle[k];
				}
				else{
					styleList[k] = maskConfig[k];
				}
			}
			styleList.height = this.isLessClient(styleList.height);
			this.addStyle(styleList);
		},
		isLessClient : function(setHeight){
			var clientHeight = document.documentElement.clientHeight;
			if(setHeight < clientHeight){
				this.crrentHeight = clientHeight;
				return clientHeight;
			}
			this.crrentHeight = setHeight;
			return setHeight;
		},
		getHeight : function(){
			return this.crrentHeight;
		}
	}

	/**
	 * 没有id为maskDialog的元素，先创建一个父元素把名字填入第二个参数,第一个为样式列表Json
	 */
	const maskCtrl = {
		show : function(config,pushElmName){
			if(!document.getElementById("maskDialog")){
				mask.creatMask(pushElmName,config);
			}
			else{
				mask.maskAddStyle(config);
			}
		},
		hidden : function(){
			var recoverHeight = document.documentElement.clientHeight;
			mask.maskAddStyle({display:"none",height:recoverHeight});
		},
		getHeight : function(){
			return mask.getHeight();
		}
	}

	module.exports = maskCtrl;
	//if(typeof exports === 'object' && typeof module === 'object'){
	//	
	//}
	//else{
	//	export default maskCtrl;
	//}



/***/ },

/***/ 110:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = angular.module('UserAdminSer', []).factory('userAdminService', ['util', 'ajax', userAdminService]);

	function userAdminService(util, ajax) {
	    return {
	        setSelectedLi: function setSelectedLi(current) {
	            var parent = util.parent(current, 'ul');
	            angular.element(parent).find('li').removeClass('selected');
	            angular.element(current).parent().addClass('selected');
	        },
	        //获取列表
	        getUserInfoList: function getUserInfoList(cfg) {
	            return ajax.post('/acc/reviewuser/getUser.do', cfg);
	        },
	        //通用
	        query: function query(url, cfg) {
	            return ajax.post(url, cfg);
	        },
	        emitPaw: function emitPaw(id) {
	            return ajax.post('/acc/reviewuser/sendRandomPwd.do', { uid: id });
	        },
	        deblock: function deblock(cfg) {
	            return ajax.post('/acc/reviewuser/userUnlock.do', cfg);
	        }
	    };
	}

/***/ },

/***/ 111:
/***/ function(module, exports) {

	module.exports = "<div class=\"main\">\r\n\t<div class=\"inner\">\r\n\t    <div class=\"inner-header\">\r\n\t        <div class=\"inner-header-lf fl\">用户管理</div>\r\n\t\r\n\t        <div class=\"add_user\" ng-if=\"!isSuperAdmin\">\r\n\t            <a ui-sref =\"manager.newUser\">\r\n\t                <span class=\"add\"></span>\r\n\t                <span>新建用户</span>\r\n\t            </a>\r\n\t        </div>\r\n\t    </div>\r\n\t    <div class=\"inner-body\">\r\n\t        <div class=\"hdFixed\">\r\n\t            <div class=\"hd id\" id=\"tableHD\">\r\n\t                <p class=\"contentR_shezhi contentR_shezhi01\">\r\n\t                    <label ng-click=\"selectAll();tableClick($event)\">\r\n\t                        <input ng-click = \"allChecked()\" ng-checked = \"checkBoxManage\" ng-model = \"checkBoxManage\" type=\"checkbox\" class=\"c1\" id=\"selectAll\">\r\n\t                        <span class=\"all\">全选</span>\r\n\t                    </label>\r\n\t\r\n\t                    <span class=\"delboxR {{isActive2}}\" ng-click=\"delAllAction()\">\r\n\t                        <span class=\"delR\"></span>\r\n\t                        <span>删除</span>\r\n\t                    </span>\r\n\t                </p>\r\n\t            </div>\r\n\t        </div>\r\n\t\r\n\t        <div  class=\"inner-table\" style=\"margin: 0 23px\">\r\n\t            <table class=\"table_user oddEvenColor\" ng-click=\"tableClick($event)\">\r\n\t                <tr class=\"tr_header\">\r\n\t                    <td class=\"c2\"></td>\r\n\t                    <td>账号</td>\r\n\t                    <td>姓名</td>\r\n\t                    <td style=\"width:34%\">角色名称</td>\r\n\t                    <td>创建时间</td>\r\n\t                    <td>备注</td>\r\n\t                    <td style=\"width:100px\">账户锁定</td>\r\n\t                    <td style=\"width: 15%;\">操作</td>\r\n\t                    \r\n\t                </tr>\r\n\t                <tr ng-repeat=\"item in UserInfoList\">\r\n\t                    <td><input type=\"checkbox\"  ng-change = \"watchChecked2()\" ng-model=\"item.CheckboxFlag\" ng-checked=\"item.CheckboxFlag\">\r\n\t                    </td>\r\n\t                    <td ng-bind=\"item.userId\"></td>\r\n\t                    <td ng-bind=\"item.userName\"></td>\r\n\t                    <td>                    \r\n\t                    \t<span ng-repeat = \"i in item.groups\" >\r\n\t                    \t\t{{i.groupName}}&nbsp;&nbsp;&nbsp;\r\n\t                    \t</span>\r\n\t                    <td ng-bind=\"item.createTime.time|timeFilter\">\r\n\t                    </td>\r\n\t                    <td ng-bind=\"item.spare1\"></td>\r\n\t                    <td><a href=\"javascript:void(0)\" ng-click = \"deblocking(item)\" style=\"color: #81abe9;\" ng-bind = \"item.isLocked|deblockFilter\"></a>\r\n\t                    </td>\r\n\t                    <td>\r\n\t                        <a class=\"mlr5\" href=\"javascript:void(0)\" ng-click = \"editUser(item.id)\">编辑</a>\r\n\t                        <a class=\"mlr5\" ng-click = \"emitPassword(item.id)\" href=\"javascript:void(0)\">生成随机密码</a>\r\n\t                    </td>\r\n\t                </tr>\r\n\t            </table>\r\n\t        </div>\r\n\t\r\n\t        <div class=\"ft clearfix yeshu\">\r\n\t            <div class=\"fl ft-lf\">\r\n\t                共<span ng-bind=\"count\"></span>条 每页显示\r\n\t                <select ng-model=\"selectOption.value\" ng-change=\"selectChange(selectOption.value)\" ng-options=\"v for v in selectOption.values\"></select>\r\n\t            </div>\r\n\t            <div class=\"fr ft-rt\">\r\n\t                <div class=\"page\">\r\n\t                    <span page></span>\r\n\t                </div>\r\n\t            </div>\r\n\t        </div>\r\n\t    </div>\r\n\t    <div class=\"inner-footer\"></div>\r\n\t</div>\r\n\t<div id=\"report-template-mask\" ng-style=\"{display:isShowReportDialog ? 'block' : 'none'}\"></div>\r\n</div>\r\n"

/***/ }

});