webpackJsonp([14],{

/***/ 152:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jquery = __webpack_require__(109);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var dependArr = [__webpack_require__(153).default.name];
	exports.default = {
	  module: angular.module('overdueCtrl', dependArr).controller('overdueController', ['$scope', 'overdueService', '$timeout', 'util', '$state', controller]),
	  template: __webpack_require__(154)
	};


	function controller(_, service, $timeout, util, $state) {
	  'use strict';

	  var o,
	      cfg = {},
	      timer,
	      isAllProList = 1;

	  _.pageNo = 1; //页数
	  _.pageSize = 10; //每页多少个
	  _.count = '';
	  _.loanMenInfo = [];
	  _.allExportFlag = false;

	  _.selectOption = {
	    "type": "select",
	    "name": "Service",
	    "value": "10条",
	    "values": ["10条", "20条", "30条", "40条", "50条"]
	  };

	  _.query = {
	    order: 'desc',
	    orderBy: 'create_time',
	    presOverdueDateStart: util.getLatelyDay(2, 'noExtend'),
	    presOverdueDateEnd: '',
	    productionCode: '',
	    partnerCode: '',
	    keyWord: ''
	  };

	  /**
	   * 选择每页显示条数
	   * @param {JSON} data
	   */
	  _.selectChange = function (data) {
	    var num = parseInt(data.replace(/(\d+)\D/, '$1'));
	    _.pageSize = num;
	    _.selectOption.value = num + '条';
	    _.pageNo = 1;
	    o.laterQueryList();
	  };

	  /**
	    * 进件开始时间
	    * @param {Event} evt
	    */
	  _.getDate("#inpstart", function (starTime) {
	    _.query.presOverdueDateStart = starTime;
	    _.$apply();
	  });

	  /**
	    * 进件结束时间
	    * @param {Event} evt
	    */
	  _.getDate("#inpend", function (endTime) {
	    _.query.presOverdueDateEnd = endTime;
	    _.$apply();
	  });

	  var isFirst = function () {
	    var count = 1;
	    var isFirst = true;
	    return function () {
	      if (count > 1) {
	        isFirst = false;
	      }
	      count += 1;
	      return isFirst;
	    };
	  }();

	  /*
	   * 导出
	   */
	  _.fileExport = function (preOrAll) {
	    if (_.count > 3000) {
	      alert('全量导出不能超过3000条！');
	      return;
	    } else if (_.count == 0) {
	      alert('全量导出不能导出0条！');
	      return;
	    }
	    var exportCfg = JSON.parse(JSON.stringify(_.downFileFilter));
	    for (var i in exportCfg) {
	      if (!exportCfg[i]) {
	        delete exportCfg[i];
	      }
	      if (i == 'pageSize') {
	        delete exportCfg['pageSize'];
	      }
	      if (i == 'pageNo') {
	        delete exportCfg['pageNo'];
	      }
	    }
	    service.exportsFile(exportCfg);
	  };

	  /**
	          * 时间排序
	          */
	  _.sortTime = function (sorts) {
	    _.query.order = sorts.order;
	    _.query.orderBy = sorts.sortKey;
	  };

	  /**
	   * 传送金额 
	   */
	  _.viewDetail = function (item) {
	    var param = {
	      requestId: item.requestId,
	      name: 'overdue'
	    };
	    _.$emit('transformM', {
	      money: item.presentDueSum
	    });

	    $state.go('financial.viewDetail', { 'object': encodeURI(JSON.stringify(param)) });
	  };

	  //过滤列表添加默认选项
	  function unshiftOption(arrList, shiftOption) {
	    if (Array.isArray(arrList)) {
	      arrList.unshift(shiftOption);
	    }
	    return arrList;
	  }

	  function paddingData(data) {
	    return {
	      productionList: unshiftOption(data.productionList.slice(), {
	        productionCode: '',
	        productionName: '请选择'
	      }),
	      partnerList: unshiftOption(data.productionList.slice(), {
	        partnerCode: '',
	        partner: '请选择'
	      })
	    };
	  }

	  _.$watch('query', function (oldVal, newVal) {
	    if (oldVal === newVal) return;
	    o.getUserInfoList();
	  }, true);

	  //获取列表
	  o = {
	    laterQueryList: function laterQueryList() {
	      var that = this;
	      if (timer) {
	        clearTimeout(timer);
	      }
	      timer = setTimeout(function () {
	        that.getUserInfoList();
	      }, 200);
	    },
	    getUserInfoList: function getUserInfoList(config) {
	      var cfg = config || {
	        pageSize: _.pageSize,
	        pageNo: _.pageNo,
	        isFirst: isFirst(),
	        productionCode: _.query.productionCode,
	        presOverdueDateStart: _.query.presOverdueDateStart,
	        presOverdueDateEnd: _.query.presOverdueDateEnd,
	        partner: _.query.partnerCode,
	        keyWord: _.query.keyWord,
	        order: _.query.order,
	        orderBy: _.query.orderBy
	      };
	      for (var item in cfg) {
	        if (cfg[item] === '00' || cfg[item] === '') {
	          delete cfg[item];
	        }
	      }
	      _.downFileFilter = cfg; //全量导出
	      service.getOverDueList(cfg).then(function (data) {
	        _.baseSelectData = paddingData(data);
	        _.loanMenInfo = data.page.result;
	        _.loanMenInfo.forEach(function (item, index) {
	          if (item == null) _.loanMenInfo.splice(index, 1);
	        });

	        if (data.page.result.length == 0 && _.pageNo !== 1) {
	          _.pageNo = _.pageNo - 1;
	          o.getUserInfoList();
	        }
	        _.count = data.page.totalCount;
	        _.showPage = 'visible';
	        _.currentPage = data.page.pageNo;

	        //多余3000条或等于0条不能导出
	        _.allExportFlag = _.count > 3000 || _.count == 0 ? false : true;

	        _.$broadcast('EVT_PAGE_CHANGE', { 'total': data.page.totalPages, 'current': _.currentPage });
	      }, function (data) {
	        alert(data.responseMsg);
	      });
	    },
	    init: function init() {
	      this.getUserInfoList();
	      _.lodingMask = true;
	    }
	  };
	  o.init();
	  //监听page发回的事件
	  _.$on('EVT_PAGE_SELECTED', function (evt, data) {
	    _.pageNo = data.pageSelectedNum;
	    o.getUserInfoList();
	    _.pageNo = 1; //默认值
	  });
	}

/***/ },

/***/ 153:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	/**
	 * 
	 */
	exports.default = angular.module('overdueSer', []).factory('overdueService', ['util', 'ajax', 'validator', service]);


	function service(util, ajax) {
		return {
			setSelectedLi: function setSelectedLi(current) {
				var parent = util.parent(current, 'ul');
				angular.element(parent).find('li').removeClass('selected');
				angular.element(current).parent().addClass('selected');
			},
			getDate: function getDate(val, fn) {
				fn && fn(val);
			},
			/**
	  * 获取待审列表
	  * @param {JSON} cfg
	  */
			getOverDueList: function getOverDueList(cfg) {
				return ajax.post("/acc/productionpresentstatus/selectDetail.do", cfg);
			},
			/**
	  * 通用 查询
	  * @param {JSON} cfg
	  */
			exportsFile: function exportsFile(cfg) {
				var preliminaryTime = function preliminaryTime(obj) {
					if (typeof obj === 'undefined' || obj === null || typeof obj !== 'string') return obj;
					var newStr = '',
					    addStr = '+00:00:00',
					    strArr = [];

					strArr = obj.split("&");
					strArr.forEach(function (v, index, arr) {
						if (/time|date/ig.test(v) && v.indexOf('=') !== -1 && v.split('=')[1] !== '' && v.split('=')[1].indexOf("+") == -1 && v.split('=')[1].indexOf('-') !== -1 && v.split('=')[1].split('-').length === 3 && v.split('=')[1].split('-')[0].length === 4 && v.split('=')[1].split('-')[1].length <= 2 && v.split('=')[1].split('-')[2].length <= 2) {
							arr[index] = v + addStr;
						}
					});
					newStr = strArr.join('&');
					return newStr;
				};

				if (util.isEmptyObject(cfg)) {
					var param = '';
					for (var params in cfg) {
						param += params + '=' + cfg[params] + '&';
					}
					param = preliminaryTime(param).slice(0, -1);
					var url = '/acc/productionpresentstatus/downloadExcel.do?' + param;
					location.href = url;
				}
			}
		};
	}

/***/ },

/***/ 154:
/***/ function(module, exports) {

	module.exports = "<div class=\"main\">\r\n\t<loding-mask></loding-mask>\r\n\t<div class=\"inner\" ng-style=\"{'min-height':isShowReportDialog ? '5000px':'auto'}\">\r\n\t    <div class=\"inner-header clearfix\">\r\n\t        <div class=\"inner-header-lf fl\">\r\n\t                       逾期用户信息\r\n\t        </div>\r\n\t    </div>\r\n\t    <div class=\"inner-body\">\r\n\t        <div class=\"inner-select\">\r\n\t            <table style=\"width: 100%;\">\r\n\t                <tr>\r\n\t                    <td class=\"tl-r\">当期逾期发生日期：<input type=\"hidden\" id=\"timeDefaut\"></td>\r\n\t                    <td>\r\n\t                    \t<input id=\"inpstart\" class=\"datainp inp1 fl calendar\" ng-model = 'query.presOverdueDateStart' type=\"text\" placeholder=\"开始日期\" value=\"\"  readonly>\r\n\t                        <span class=\"fl\" style=\"line-height:27px;padding:0 6px;\">至</span>\r\n\t\t\t\t\t\t    <input id=\"inpend\" class=\"datainp inp1 fl calendar\" ng-model = 'query.presOverdueDateEnd' type=\"text\" placeholder=\"结束日期\" readonly>\r\n\t                    </td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t                    <td class=\"tl-r\">产品：</td>\r\n\t                    <td>\r\n\t                    \t<select class=\"select-global\" ng-model = \"query.productionCode\" ng-options = \"option.productionCode as option.productionName for option in baseSelectData.productionList\"></select>\r\n\t                    </td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t                    <td class=\"tl-r\">合作机构：</td>\r\n\t                    <td>\r\n\t                    \t<select class=\"select-global\" ng-model = \"query.partnerCode\" ng-options = \"option.partnerCode as option.partner for option in baseSelectData.partnerList\"></select>\r\n\t                    </td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t                    <td class=\"tl-r\"> 关键字：</td>\r\n\t                    <td class=\"fl search\">\r\n\t                        <input type=\"text\" placeholder=\"姓名/案件号/身份证号\" ng-model=\"query.keyWord\" id=\"search\"/>\r\n\t                    </td>\r\n\t                </tr>\r\n\t            </table>\r\n\t                </div>\r\n\t                <div class=\"inner-table\">\r\n\t                    <div class=\"hdFixed\">\r\n\t                        <div class=\"hd clearfix id\" id=\"tableHD\">\r\n\t                        \t<download-btn name = \"全量导出\" lock = \"allExportFlag\" ng-click = \"fileExport()\" class=\"fr\"/>\r\n\t\t\t\t\t\t\t\t<!--<button ng-disabled = \"!allExportFlag\" ng-style = \"{color: allExportFlag ? 'rgb(233, 64, 51)' : 'rgb(167, 167, 167)'}\" ng-click=\"fileExport('allExport')\" class=\"fl btn2 btn2-export all-exprot\">全量导出</button>-->\r\n\t                        </div>\r\n\t                    </div>\r\n\t                    <div class=\"bd\">\r\n\t                        <table class=\"table_user oddEvenColor\" border=\"1\" borderColor=\"#fff\" ng-click=\"tableClick($event)\">\r\n\t                            <tr>\r\n\t                            \t<th>案件号</th>\r\n\t                                <th>合作机构</th>\r\n\t                                <th>产品</th>\r\n\t                                <th>\r\n\t                                \t当期逾期发生日期\r\n\t                                \t<div class=\"sortWrap\">\r\n\t                                \t\t<div class=\"sortTimeTop\" ng-click = 'sortTime({sortKey:\"update_time\",order:\"asc\"})'></div>\r\n\t                                \t\t<div class=\"sortTimeBottom\" ng-click = 'sortTime({sortKey:\"update_time\",order:\"desc\"})'></div>\r\n\t                                \t</div>\r\n\t                                </th>\r\n\t                                <th>当前应偿未偿总金额</th>\r\n\t                                <th>姓名</th>\r\n\t                                <th>身份证</th>\r\n\t                                <th>操作</th>\r\n\t                            </tr>\r\n\t                            <tr ng-repeat=\"item in loanMenInfo\">\r\n\t                                <td ng-bind=\"item.requestId\"></td>\r\n\t                                <td ng-bind=\"item.partner\"></td>\r\n\t                                <td ng-bind=\"item.productionName\"></td>\r\n\t                                <td ng-bind=\"item.presOverdueDate.time|timeDateFilter\"></td>\r\n\t                                <td ng-bind=\"item.presentDueSum\"></td>\r\n\t                                <td ng-bind=\"item.applicantName\"></td>\r\n\t                                <td ng-bind=\"item.cardId\"></td>\r\n\t                                <td><a href=\"javascript:void(0)\" ng-click = \"viewDetail(item)\" href=\"\">查看</a></td>\r\n\t                            </tr>\r\n\t                        </table>\r\n\t                    </div>\r\n\t                <div class=\"ft clearfix yeshu\" ng-style=\"{visibility:showPage}\">\r\n\t\t\t            <div class=\"fl ft-lf\">共 <span ng-bind=\"count\"></span>条 每页显示\r\n\t\t\t                <select ng-model=\"selectOption.value\" ng-change=\"selectChange(selectOption.value)\" ng-options=\"v for v in selectOption.values\"></select>\r\n\t\t\t            </div>\r\n\t\t\t            <div class=\"fr ft-rt\">\r\n\t\t\t                <div class=\"page clearfix\">\r\n\t\t\t                <span page></span>\r\n\t\t\t            </div>\r\n\t\t\t        </div>\r\n\t\t\t    </div>\r\n\t\t\t</div>\r\n\t    </div>\r\n\t    <div class=\"inner-footer\"></div>\r\n\t</div>\r\n</div>"

/***/ }

});