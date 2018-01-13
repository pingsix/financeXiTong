webpackJsonp([12],{

/***/ 143:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jquery = __webpack_require__(109);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var dependArr = [__webpack_require__(144).default.name];

	exports.default = {
	  module: angular.module('loanCollectInfoCtrl', dependArr).controller('loanCollectInfoController', ['$scope', 'loanCollectInfo.service', '$timeout', 'util', controller]),
	  template: __webpack_require__(145)
	};


	function controller(_, service, $timeout, util) {
	  'use strict';

	  var o,
	      cfg = {},
	      timer,
	      isAllProList = 1;

	  _.pageNo = 1; //页数
	  _.pageSize = 10; //每页多少个
	  _.count = '';
	  _.loanMenInfo = [];

	  _.selectOption = {
	    "type": "select",
	    "name": "Service",
	    "value": "10条",
	    "values": ["10条", "20条", "30条", "40条", "50条"]
	  };

	  _.query = {
	    order: 'desc',
	    orderBy: 'create_time',
	    presentDateStart: util.getLatelyDay(2, 'noExtend'),
	    presentDateEnd: '',
	    productionCode: '',
	    presentStatus: '',
	    loanStatus: '',
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
	    _.query.presentDateStart = starTime;
	    _.$apply();
	  });

	  /**
	    * 进件结束时间
	    * @param {Event} evt
	    */
	  _.getDate("#inpend", function (endTime) {
	    _.query.presentDateEnd = endTime;
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

	  //过滤列表添加默认选项
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
	        pageSize: _.pageSize, //条数
	        pageNo: _.pageNo, //页数
	        isFirst: isFirst(),
	        productionCode: _.query.productionCode, //产品名称
	        presentDateStart: _.query.presentDateStart, //数据更新时间
	        presentDateEnd: _.query.presentDateEnd };
	      for (var item in cfg) {
	        if (cfg[item] === '00' || cfg[item] === '') {
	          delete cfg[item];
	        }
	      }
	      service.getCollectList(cfg).then(function (data) {
	        //              	if(data.productionList && data.productionList.length && isAllProList === 1){
	        //              		isAllProList ++ ;
	        _.baseSelectData = paddingData(data);
	        //              	}

	        _.collectList = data.page.result;

	        if (data.page.result.length == 0 && _.pageNo !== 1) {
	          _.pageNo = _.pageNo - 1;
	          o.getUserInfoList();
	        }

	        _.count = data.page.totalCount;
	        _.showPage = 'visible';
	        _.currentPage = data.page.pageNo;
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

/***/ 144:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = angular.module('loanCollectInfoSer', []).factory('loanCollectInfo.service', ['util', 'ajax', service]);


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
	        getCollectList: function getCollectList(cfg) {
	            return ajax.post("/acc/productiondatasummary/selectSummary.do", cfg);
	        }
	    };
	}

/***/ },

/***/ 145:
/***/ function(module, exports) {

	module.exports = "<div class=\"main\">\r\n\t<loding-mask></loding-mask>\r\n\t<div class=\"inner\" ng-style=\"{'min-height':isShowReportDialog ? '5000px':'auto'}\">\r\n\t    <div class=\"inner-header clearfix\">\r\n\t        <div class=\"inner-header-lf fl\">\r\n\t                       账务汇总信息\r\n\t        </div>\r\n\t    </div>\r\n\t    <div class=\"inner-body\">\r\n\t        <div class=\"inner-select\">\r\n\t            <table style=\"width: 100%;\">\r\n\t                <tr>\r\n\t                    <td class=\"tl-r\">数据统计日期范围：<input type=\"hidden\" id=\"timeDefaut\"></td>\r\n\t                    <td>\r\n\t                    \t<input id=\"inpstart\" class=\"datainp inp1 fl calendar\" ng-model = 'query.presentDateStart' type=\"text\" placeholder=\"开始日期\" value=\"\"  readonly>\r\n\t                        <span class=\"fl\" style=\"line-height:27px;padding:0 6px;\">至</span>\r\n\t\t\t\t\t\t    <input id=\"inpend\" class=\"datainp inp1 fl calendar\" ng-model = 'query.presentDateEnd' type=\"text\" placeholder=\"结束日期\" readonly>\r\n\t                    </td>\r\n\t                </tr>\r\n\t                 <tr>\r\n\t                    <td class=\"tl-r\">产品：</td>\r\n\t                    <td>\r\n\t                    \t<select class=\"select-global\" ng-model = \"query.productionCode\" ng-options = \"option.productionCode as option.productionName for option in baseSelectData.productionList\"></select>\r\n\t                    </td>\r\n\t                </tr>\r\n\t            </table>\r\n\t                </div>\r\n\t                <div class=\"inner-table\">\r\n\t                    <div class=\"hdFixed\">\r\n\t                        <div class=\"hd clearfix id\" id=\"tableHD\">\r\n\t                        </div>\r\n\t                    </div>\r\n\t                    <div class=\"bd\">\r\n\t                        <table class=\"oddEvenColor\" border=\"1\" borderColor=\"#fff\" ng-click=\"tableClick($event)\">\r\n\t                            <tr>\r\n\t                            \t<th>产品</th>\r\n\t                                <th>数据统计日期</th>\r\n\t                                <th>放款笔数</th>\r\n\t                                <th>放款额</th>\r\n\t                                <th>回款额</th>\r\n\t                                <th>剩余本金余额</th>\r\n\t                                <th>逾期率</th>\r\n\t                                <th>风险准备金备偿率</th>\r\n\t                                <th>代偿占用率</th>\r\n\t                                <th>违约次数</th>\r\n\t                                <th>保证金划扣总金额</th>\r\n\t                                <th>百融充值入账金额</th>\r\n\t                                <th>当前剩余保证金</th>\r\n\t                            </tr>\r\n\t                            <tr ng-repeat=\"item in collectList\">\r\n\t                                <td ng-bind=\"item.productionName\"></td>\r\n\t                                <td ng-bind=\"item.presentDate.time|timeDateFilter\"></td>\r\n\t                                <td ng-bind=\"item.loanTotNum\"></td>\r\n\t                                <td ng-bind=\"item.loanTotMoney\"></td>\r\n\t                                <td ng-bind=\"item.repaidTotMoney\"></td>\r\n\t                                <td ng-bind=\"item.presentTotResPri\"></td>\r\n\t                                <td ng-bind=\"item.overdueRate\"></td>\r\n\t                                <td ng-bind=\"item.riskReserveRate\"></td>\r\n\t                                <td ng-bind=\"item.compensatoryRate\"></td>\r\n\t                                <td ng-bind=\"item.defaultNum\"></td>\r\n\t                                <td ng-bind=\"item.fineTotMoney\"></td>\r\n\t                                <td ng-bind=\"item.rechargeMoney\"></td>\r\n\t                                <td ng-bind=\"item.presentResFine\"></td>\r\n\t                            </tr>\r\n\t                        </table>\r\n\t                    </div>\r\n\t                <div class=\"ft clearfix yeshu\" ng-style=\"{visibility:showPage}\">\r\n\t\t\t            <div class=\"fl ft-lf\">\r\n\t\t\t                                共 <span ng-bind=\"count\"></span>条 每页显示\r\n\t\t\t                <select ng-model=\"selectOption.value\" ng-change=\"selectChange(selectOption.value)\" ng-options=\"v for v in selectOption.values\">\r\n\t\t\t                </select>\r\n\t\t\t                </div>\r\n\t\t\t                <div class=\"fr ft-rt\">\r\n\t\t\t                    <div class=\"page clearfix\">\r\n\t\t\t                        <span page></span>\r\n\t\t\t                    </div>\r\n\t\t\t        </div>\r\n\t\t\t    </div>\r\n\t\t\t</div>\r\n\t    </div>\r\n\t    <div class=\"inner-footer\"></div>\r\n\t</div>\r\n</div>"

/***/ }

});