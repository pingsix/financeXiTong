webpackJsonp([16],{

/***/ 155:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jquery = __webpack_require__(109);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var dependArr = [__webpack_require__(156).default.name];
	exports.default = {
	  module: angular.module('rewardingCtrl', dependArr).controller('rewardingController', ['$scope', 'rewardingService', '$timeout', '$state', 'util', '$q', controller]),
	  template: __webpack_require__(157)
	};


	function controller(_, service, $timeout, $state, util, $q) {
	  'use strict';

	  var o, timer;
	  _.count = '';
	  _.downloadBtn = false;

	  _.checkBoxManage = false;
	  _.loanMenInfo = [];
	  _.selectOption = {
	    "type": "select",
	    "name": "Service",
	    "value": "10条",
	    "values": ["10条", "20条", "30条", "40条", "50条"]
	  };

	  _.statusLists = [{
	    code: "-1", value: '未申请放款'
	  }, {
	    code: "0", value: '正常'
	  }, {
	    code: "1", value: '逾期'
	  }, {
	    code: "2", value: '已结清'
	  }, {
	    code: "3", value: '一次结清'
	  }, {
	    code: "4", value: '取消借款'
	  }, {
	    code: "5", value: '待放款'
	  }, {
	    code: "6", value: '提交失败'
	  }, {
	    code: "7", value: '待还款'
	  }, {
	    code: "8", value: '放款成功'
	  }, {
	    code: "9", value: '放款失败'
	  }];

	  /**
	  * 过滤列表添加默认选项
	  * @param {Object} arrList
	  * @param {Object} shiftOption
	  */
	  function unshiftOption(arrList, shiftOption) {
	    if (Array.isArray(arrList)) {
	      arrList.unshift(shiftOption);
	    }
	    return arrList;
	  }

	  function paddingData(data) {
	    return {
	      productionList: unshiftOption(data.productionList, {
	        productionCode: '',
	        productionName: '请选择'
	      })
	    };
	  }

	  var queryParam = function queryParam() {
	    return {
	      // repaymentDate : util.getLatelyDay(0,"noExtend"),
	      repaymentDate: '',
	      createTimeEnd: '',
	      productionCode: '',
	      pageSize: 10,
	      pageNo: 1
	    };
	  };

	  //查询参数
	  _.query = queryParam();

	  /**
	   * 选择每页显示条数
	   * @param {JSON} data
	   */
	  _.selectChange = function (data) {
	    var num = parseInt(data.replace(/(\d+)\D/, '$1'));
	    _.query.pageSize = num;
	    _.selectOption.value = num + '条';
	    _.query.pageNo = 1;
	    o.laterQueryList();
	  };

	  /**
	    * 进件开始时间
	    * @param {Event} evt
	    */
	  _.getCreateStartDate = function (startTime) {

	    _.getDate("#inpCreateStart", function (starTime) {
	      _.query.repaymentDate = starTime;

	      _.$apply();
	    }, function (startObj) {
	      startObj.format = 'YYYY-MM-DD';
	      delete startObj['maxDate'];
	      //	        	startObj["minDate"] = $.nowDate(0);
	    });
	  };

	  /**
	          * 进件结束时间
	          * @param {Event} evt
	          */
	  _.getCreateEndDat = function (endTime) {
	    _.getDate("#inpCreateEn", function (endTime) {
	      // endTime =  endTime.split('-').slice(0,3);
	      _.query.createTimeEnd = endTime;

	      _.$apply();
	    }, function (startObj) {
	      startObj.format = 'YYYY-MM-DD';
	      delete startObj['maxDate'];
	      //              startObj["minDate"] = $.nowDate(0);
	    });
	  };
	  //查询
	  _.searchStart = function () {
	    o.laterQueryList();
	  };

	  _.clearSearch = function () {
	    _.query = queryParam();
	    o.laterQueryList();
	  };

	  /**
	   * 传后端第一次操作flag
	   */
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

	  /**
	   * 导出
	   * @param {Object} preOrAll
	   */
	  _.exprotFile = function () {
	    if (_.count > 3000) {
	      alert('全量导出不能超过3000条!');
	      return;
	    } else if (_.count == 0) {
	      return alert('没有可导出的数据!');
	    }
	    delete _.downFileFilter['pageSize'];
	    delete _.downFileFilter['pageNo'];
	    delete _.downFileFilter['isFirst'];
	    // return;
	    service.exprotFile(_.query);
	    // service.exprotFile( _.downFileFilter);
	  };

	  function deleteEmptyData(data) {
	    if (!data) return;
	    for (var item in data) {
	      if (data[item] === '00' || data[item] === '') {
	        delete data[item];
	      }
	    }
	    return data;
	  }

	  /**
	   * 渲染列表
	   */
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
	      var cfg = JSON.parse(JSON.stringify(_.query));
	      //全量导出
	      cfg.isFirst = isFirst(), _.downFileFilter = deleteEmptyData(cfg);
	      service.getLoanMenInfoList(_.query).then(function (data) {
	        _.baseSelectData = paddingData(data);
	        _.downloadBtn = _.checkBoxManage = false;

	        _.loanMenInfo = data.page.result ? data.page.result : [];

	        _.loanMenInfo.forEach(function (v) {
	          v['CheckboxFlag'] = false;
	          _.statusLists.forEach(function (item) {
	            if (v.status == item.code) {
	              v.status = item.value;
	            }
	          });
	        });

	        //页码问题
	        if (data.page.result.length == 0 && _.query.pageNo !== 1) {
	          _.query.pageNo = _.query.pageNo - 1;
	          o.getUserInfoList();
	        }

	        _.count = data.page.totalCount;
	        _.showPage = 'visible';
	        _.currentPage = data.page.pageNo;

	        //多余3000条或等于0条不能导出
	        _.isDisabled = _.count < 3000 && _.count > 0 ? true : false;

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
	    _.query.pageNo = data.pageSelectedNum;
	    o.getUserInfoList();
	    _.query.pageNo = 1;
	  });
	}

/***/ },

/***/ 156:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	/**
	 * 
	 */
	exports.default = angular.module('rewardingSer', []).factory('rewardingService', ['util', 'ajax', 'validator', service]);


	function service(util, ajax) {
		return {
			/**
	  * 获取待审列表
	  * @param {JSON} cfg
	  */
			getLoanMenInfoList: function getLoanMenInfoList(cfg) {
				return ajax.post("/acc/productionloan/repayment.do", cfg);
			},
			/**
	  * 通用 查询
	  * @param {JSON} cfg
	  */
			exprotFile: function exprotFile(cfg) {
				if (util.isEmptyObject(cfg)) {
					var param = '';
					for (var params in cfg) {
						param += params + '=' + cfg[params] + '&';
					}
					var url = '/acc/productionloan/downloadRepayment.do?' + param;
					url = url.slice(0, -1);
					location.href = url;
				}
				//				return ajax.post("/acc/productionloan/downloadRepayment.do",cfg).then(function(data){
				//					console.log(32,data)
				//					location.href = data;
				//				});
			}
		};
	}

/***/ },

/***/ 157:
/***/ function(module, exports) {

	module.exports = "<div class=\"main\">\r\n\t<loding-mask></loding-mask>\r\n\t<div class=\"inner\" ng-style=\"{'min-height':isShowReportDialog ? '5000px':'auto'}\">\r\n\t    <div class=\"inner-header clearfix\">\r\n\t        <div class=\"inner-header-lf fl\">应回款报表</div>\r\n\t  \r\n\t    </div>\r\n\t    <div class=\"inner-body\">\r\n\t        <div class=\"inner-select\">\r\n\t            <table style=\"width: 100%;\">\r\n\t                <tr>\r\n\t                    <td class=\"tl-r\">应回款日期：<input type=\"hidden\" id=\"timeDefaut\"></td>\r\n\t                    <td style=\"width: 500px;\">\r\n\t                    \t<input id=\"inpCreateStart\" class=\"datainp inp1 fl calendar\" ng-model = 'query.repaymentDate' ng-click = \"getCreateStartDate(query.repaymentDate)\" type=\"text\"  placeholder=\"开始日期\" readonly>\r\n\t                    \t<span class=\"fl\" style=\"line-height:27px;padding:0 6px;\">至</span>\r\n\r\n\t                    <!-- \t <input id=\"inpCreateEn\" class=\"datainp inp1 fl calendar\" ng-model = 'query.createTimeEnd' ng-click = \"getCreateEndDat(query.createTimeEnd)\" type=\"text\" placeholder=\"结束日期\" readonly> -->\r\n\r\n\t\t\t\t\t\t           <input id=\"inpCreateEn\" class=\"datainp inp1 fl calendar\" ng-model = 'query.createTimeEnd' ng-click = \"getCreateEndDat(query.createTimeEnd)\" type=\"text\"  placeholder=\"结束日期\" readonly>\r\n\t                    </td>\r\n\t                \t  <td></td>\r\n\t                    <td>\r\n\t                    </td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t                    <td class=\"tl-r\">产品：</td>\r\n\t                    <td>\r\n\t                    \t<select class=\"select-global\" ng-model = \"query.productionCode\" ng-options = \"option.productionCode as option.productionName for option in baseSelectData.productionList\"></select>\r\n\t                    </td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t\t\t\t\t\t<td class=\"tl-r\"></td>\r\n\t\t\t\t\t\t<td class=\"fl search\">\r\n\t\t\t\t\t\t\t<div class=\"search-start\" behavior ng-click=\"searchStart()\">查 询</div>\r\n\t\t\t\t\t\t\t<div class=\"search-start\" behavior ng-click=\"clearSearch()\">清 空</div>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t</tr>\r\n\t            </table>\r\n\t                </div>\r\n\t                <div class=\"inner-table\">\r\n\t                    <div class=\"hdFixed\">\r\n\t                        <div class=\"hd clearfix id\" id=\"tableHD\">\r\n\t                            <download-btn name = \"导出\" lock = \"isDisabled\" ng-click = \"exprotFile()\" class=\"fr\"/>\r\n\t                        </div>\r\n\t                    </div>\r\n\t                    <div class=\"bd\">\r\n\t                        <table class=\"table_user oddEvenColor\" border=\"1\" borderColor=\"#fff\" ng-click=\"tableClick($event)\">\r\n\t                            <tr>\r\n\t                              <th width=\"39\">序号</th>\r\n\t                            \t<th>案件号</th>\r\n\t                            \t<th>产品</th>\r\n\t                              <th>姓名</th>\r\n\t                              <th>期数</th>\r\n\t                              <th>应还时间</th>\r\n\t                              <th>应还本金</th>\r\n\t                              <th>应还利息</th>\r\n\t                              <th>应还总金额</th>\r\n\t                              <th>还款状态</th>\r\n\t                            </tr>\r\n\t                            <tr ng-repeat=\"item in loanMenInfo\">\r\n\t                            \t<td ng-bind=\"$index + 1\"></td>\r\n\t                                <td ng-bind=\"item.requestId\"></td>\r\n\t                                <td ng-bind=\"item.productionName\"></td>\r\n\t                                <td ng-bind=\"item.applicantName\"></td>\r\n\t                                <td ng-bind=\"item.billPeriods\"></td>\r\n\t                                <td ng-bind=\"item.repaidDeadline.time|timeDateFilter\"></td>\r\n\t                                <td ng-bind=\"item.presentPri\"></td>\r\n\t                                <td ng-bind=\"item.presentInt\"></td>\r\n\t                                <td ng-bind=\"(item.presentPri + item.presentInt + item.presentServiceFeeBr) | number:2\"></td>\r\n\t                                <td ng-bind=\"item.status\"></td>\r\n\t                            </tr>\r\n\t                        </table>\r\n\t                    </div>\r\n\t                <div class=\"ft clearfix yeshu\" ng-style=\"{visibility:showPage}\">\r\n\t\t\t            <div class=\"fl ft-lf\"> 共 <span ng-bind=\"count\"></span>条 每页显示\r\n\t\t\t                <select ng-model=\"selectOption.value\" ng-change=\"selectChange(selectOption.value)\" ng-options=\"v for v in selectOption.values\"></select>\r\n\t\t\t            </div>\r\n\t\t\t            <div class=\"fr ft-rt\">\r\n\t\t\t                <div class=\"page clearfix\">\r\n\t\t\t                <span page></span>\r\n\t\t\t            </div>\r\n\t\t\t        </div>\r\n\t\t\t    </div>\r\n\t\t\t</div>\r\n\t    </div>\r\n\t</div>\r\n</div>\r\n"

/***/ }

});