webpackJsonp([11],{

/***/ 140:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _jquery = __webpack_require__(109);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var dependArr = [__webpack_require__(141).default.name];
	exports.default = {
	    module: angular.module('loanMenInfoCtrl', dependArr).controller('loanMenInfoController', ['$scope', 'loanMenInfoService', '$timeout', '$state', 'util', '$q', controller]),
	    template: __webpack_require__(142)
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
	        var presentStatusList = [{ id: '0', value: '正常' }, { id: '1', value: '逾期' }, { id: '2', value: '已结清' }, { id: '3', value: '一次结清' }, { id: '4', value: '取消借款' }],
	            loanStatusList = [{ id: '5', value: '待放款' }, { id: '6', value: '提交失败' },
	        // {id :　'7'　, value :　'待放款'},
	        { id: '8', value: '放款成功' }, { id: '9', value: '放款失败' }];
	        return {
	            productionList: unshiftOption(data.productionList, {
	                productionCode: '',
	                productionName: '请选择'
	            }),
	            accpartnerList: unshiftOption(data.accpartnerList, {
	                partnerCode: '',
	                partnerName: '请选择'
	            }),
	            presentStatusList: unshiftOption(presentStatusList, {
	                id: '',
	                value: '请选择'
	            }),
	            // accpartnerList :  unshiftOption(data.accpartnerList,{
	            //     partnerCode :　'',
	            //     partnerName:　'请选择'
	            // }),
	            loanStatusList: unshiftOption(loanStatusList, {
	                id: '',
	                value: '请选择'
	            })
	        };
	    }

	    var queryParam = function queryParam() {
	        return {
	            order: 'desc',
	            orderBy: 'create_time',
	            createTimeStart: '',
	            createTimeEnd: '',
	            updateTimeStart: '',
	            updateTimeEnd: '',
	            productionCode: '',
	            partnerCode: '',
	            presentStatus: '',
	            loanStatus: '',
	            keyWord: '',
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
	            _.query.createTimeStart = starTime;
	            _.$apply();
	        });
	    };
	    /**
	      * 进件结束时间
	      * @param {Event} evt
	      */
	    _.getCreateEndDate = function () {
	        _.getDate("#inpCreateEnd", function (endTime) {
	            _.query.createTimeEnd = endTime;
	            _.$apply();
	        });
	    };

	    /**
	      * 更新开始时间
	      * @param {Event} evt
	      */
	    _.getStartDate = function () {
	        _.getDate("#inpstart", function (starTime) {
	            _.query.updateTimeStart = starTime;
	            _.$apply();
	        });
	    };

	    /**
	      * 更新结束时间
	      * @param {Event} evt
	      */
	    _.getEndDate = function () {
	        _.getDate("#inpend", function (endTime) {
	            _.query.updateTimeEnd = endTime;
	            _.$apply();
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
	      * 全选
	      * @param {Event} evt
	      */
	    _.allChecked = function () {
	        _.checkBoxManage = !_.checkBoxManage;

	        if (_.loanMenInfo.length < 1) return;
	        _.loanMenInfo.forEach(function (v) {
	            v['CheckboxFlag'] = _.checkBoxManage;
	        });
	        _.downloadBtn = triggerDownloadBtn();
	    };

	    _.watchListChecked = function () {
	        _.downloadBtn = triggerDownloadBtn();
	        triggerCheckAllBtn();
	    };

	    function triggerDownloadBtn() {
	        var isExistCheckData = _.loanMenInfo.some(function (item) {
	            return item.CheckboxFlag ? true : false;
	        });
	        return isExistCheckData;
	    }

	    function triggerCheckAllBtn() {
	        var isExistCheckData = _.loanMenInfo.every(function (item) {
	            return item.CheckboxFlag ? true : false;
	        });
	        _.checkBoxManage = isExistCheckData;
	    }

	    /**
	     * 操作 查看详情
	     * @param {Object} item
	     */
	    _.viewDetail = function (item) {
	        var params = {
	            'requestId': item.requestId,
	            'name': 'loanInfo'
	        };
	        window.open('#/financial/viewDetail/' + encodeURI(JSON.stringify(params)));
	        //          $state.go('financial.viewDetail',{"object" :　encodeURI(JSON.stringify(params))})
	    };

	    /**
	     * 导出
	     * @param {Object} preOrAll
	     */
	    _.exprotFile = function () {
	        var idsArr = [],
	            exportCfg = {},
	            isIds = function () {
	            var arr = _.loanMenInfo.slice(0);
	            arr.forEach(function (v) {
	                if (v.CheckboxFlag) {
	                    idsArr.push(v.id);
	                }
	            });
	            return idsArr;
	        }();
	        exportCfg.idList = isIds;
	        service.exprotFile(exportCfg);
	    };

	    _.exprotFileAll = function () {
	        if (_.count > 3000) {
	            alert('全量导出不能超过3000条!');
	            return;
	        } else if (_.count == 0) {
	            alert('全量导出不能导出0条!');
	            return;
	        }
	        delete _.downFileFilter['pageSize'];
	        delete _.downFileFilter['pageNo'];
	        service.exprotFile(_.downFileFilter);
	    };

	    /**
	     * 时间排序
	     * @param {Object} sorts
	     */
	    _.sortTime = function (sorts) {
	        _.query.order = sorts.order;
	        _.query.orderBy = sorts.sortKey;
	    };

	    /**
	     * 监听筛选条件变化 自动查询
	     */
	    //      _.$watch('query',function(oldVal,newVal){
	    //          if(oldVal === newVal) return;
	    //          o.getUserInfoList();
	    //      },true)

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
	            // console.log('999');
	            // console.log(_.query);
	            //全量导出
	            cfg.isFirst = isFirst(), _.downFileFilter = deleteEmptyData(cfg);
	            service.getLoanMenInfoList(_.query).then(function (data) {

	                _.baseSelectData = paddingData(data);

	                _.downloadBtn = _.checkBoxManage = false;

	                _.loanMenInfo = data.page.result ? data.page.result : [];

	                // 当前状态
	                // console.log('09090');
	                // console.log(_.loanMenInfo);

	                _.loanMenInfo.forEach(function (v) {
	                    _.baseSelectData.presentStatusList.forEach(function (item) {
	                        if (item.id === v.presentStatus && v.presentStatus !== "") {
	                            v.presentStatus = item.value;
	                        }
	                    });
	                    // 放款状态
	                    _.baseSelectData.loanStatusList.forEach(function (item) {
	                        if (item.id == v.loanStatus) {
	                            // if (!v.loanStatus) {
	                            v.loanStatus = item.value;
	                            // }
	                        }
	                    });
	                    v['CheckboxFlag'] = false;
	                });

	                // 放款状态
	                // _.loanMenInfo.forEach(function(v){
	                //    _.baseSelectData.loanStatusList.forEach(function(item){
	                //       if (item.id == v.loanStatus) {
	                //          v.loanStatus = item.value;
	                //       }
	                //    })
	                //      // v['CheckboxFlag'] = false;
	                //  })

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

/***/ 141:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * 
	 */
	exports.default = angular.module('loanMenInfoSer', []).factory('loanMenInfoService', ['util', 'ajax', 'validator', service]);


	function service(util, ajax) {
	  return {
	    /**
	    * 获取待审列表
	    * @param {JSON} cfg
	    */
	    getLoanMenInfoList: function getLoanMenInfoList(cfg) {
	      return ajax.post("/acc/productionloan/selectLoan.do", cfg);
	    },
	    /**
	    * 通用 查询
	    * @param {JSON} cfg
	    */
	    exprotFile: function exprotFile(cfg) {
	      //导出
	      if ('idList' in cfg) {
	        if (!cfg.idList.length) {
	          alert('请选择要导出的案件');
	          return;
	        }
	        location.href = '/acc/productionloan/downloadExcel.do?idList=' + cfg.idList;
	      }
	      //导出全部  筛选后的
	      else {
	          if (util.isEmptyObject(cfg)) {
	            var param = '';
	            for (var params in cfg) {
	              param += params + '=' + cfg[params] + '&';
	            }
	            var url = '/acc/productionloan/downloadExcel.do?' + param;
	            url = url.slice(0, -1);
	            location.href = url;
	          }
	        }
	    }
	  };
	}

/***/ },

/***/ 142:
/***/ function(module, exports) {

	module.exports = "<div class=\"main\">\r\n\t<loding-mask></loding-mask>\r\n\t<div class=\"inner\" ng-style=\"{'min-height':isShowReportDialog ? '5000px':'auto'}\">\r\n\t    <div class=\"inner-header clearfix\">\r\n\t        <div class=\"inner-header-lf fl\">借款人财务信息</div>\r\n\t    </div>\r\n\t    <div class=\"inner-body\">\r\n\t        <div class=\"inner-select\">\r\n\t            <table style=\"width: 100%;\">\r\n\t                <tr>\r\n\t                    <td class=\"tl-r\">数据创建时间范围：<input type=\"hidden\" id=\"timeDefaut\"></td>\r\n\t                    <td style=\"width: 500px;\">\r\n\t                    \t<input id=\"inpCreateStart\" class=\"datainp inp1 fl calendar\" ng-model = 'query.createTimeStart' ng-click = \"getCreateStartDate(query.createTimeStart)\" type=\"text\" placeholder=\"开始日期\" value=\"\"  readonly>\r\n\t                        <span class=\"fl\" style=\"line-height:27px;padding:0 6px;\">至</span>\r\n\t\t\t\t\t\t    <input id=\"inpCreateEnd\" class=\"datainp inp1 fl calendar\" ng-model = 'query.createTimeEnd' ng-click = \"getCreateEndDate(query.createTimeEnd)\" type=\"text\" placeholder=\"结束日期\" readonly>\r\n\t                    </td>\r\n\t                \t<td class=\"tl-r\">数据更新时间范围：<input type=\"hidden\" id=\"timeDefaut\"></td>\r\n\t                    <td>\r\n\t                    \t<input id=\"inpstart\" class=\"datainp inp1 fl calendar\" ng-model = 'query.updateTimeStart' ng-click = \"getStartDate(query.updateTimeStart)\" type=\"text\" placeholder=\"开始日期\" value=\"\"  readonly>\r\n\t                        <span class=\"fl\" style=\"line-height:27px;padding:0 6px;\">至</span>\r\n\t\t\t\t\t\t    <input id=\"inpend\" class=\"datainp inp1 fl calendar\" ng-model = 'query.updateTimeEnd' ng-click = \"getEndDate(query.updateTimeEnd)\" type=\"text\" placeholder=\"结束日期\" readonly>\r\n\t                    </td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t                    <td class=\"tl-r\">产品：</td>\r\n\t                    <td>\r\n\t                    \t<select class=\"select-global\" ng-model = \"query.productionCode\" ng-options = \"option.productionCode as option.productionName for option in baseSelectData.productionList\"></select>\r\n\t                    </td>\r\n                      <td class=\"tl-r\">资金方:</td>\r\n\t                  \t<td>\r\n\r\n\t                  \t\t<select class=\"select-global\" \r\n\t                  \t\tng-model = \"query.partnerCode\"\r\n\t                  \t\tng-options = \"option.partnerCode as option.partnerName for option in baseSelectData.accpartnerList\" ></select>\r\n\t                  \t</td>\r\n\t                  </tr>\r\n\t                 <!--  <tr>\r\n\t                  \t\r\n\t                  </tr> -->\r\n\t                  <tr>\r\n\t                    <td class=\"tl-r\">当前状态：</td>\r\n\t                    <td>\r\n\t                    \t<select class=\"select-global\" ng-model = \"query.presentStatus\" ng-options = \"option.id as option.value for option in baseSelectData.presentStatusList\"></select>\r\n\t                    </td>\r\n\t                    <td class=\"tl-r\">放款状态：</td>\r\n\t                    <td>\r\n\t                    \t<select class=\"select-global\" ng-model = \"query.loanStatus\" ng-options = \"option.id as option.value for option in baseSelectData.loanStatusList\"></select>\r\n\t                    </td>\r\n\t                </tr>\r\n\t                <!-- <tr>\r\n\t              \r\n\t                </tr> -->\r\n\t                <tr>\r\n\t                    <td class=\"tl-r\"> 关键字：</td>\r\n\t                    <td class=\"fl search\">\r\n\t                        <input type=\"text\" placeholder=\"姓名/案件号/身份证号\" ng-model=\"query.keyWord\" id=\"search\"/>\r\n\t                    </td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t\t\t\t\t\t<td class=\"tl-r\"></td>\r\n\t\t\t\t\t\t<td class=\"fl search\">\r\n\t\t\t\t\t\t\t<div class=\"search-start\" behavior ng-click=\"searchStart()\">查 询</div>\r\n\t\t\t\t\t\t\t<div class=\"search-start\" behavior ng-click=\"clearSearch()\">清 空</div>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t</tr>\r\n\t            </table>\r\n\t                </div>\r\n\t                <div class=\"inner-table\">\r\n\t                    <div class=\"hdFixed\">\r\n\t                        <div class=\"hd clearfix id\" id=\"tableHD\">\r\n\t                            <label class=\"checkAll-wrap\" ng-click=\"selectAll($event);tableClick($event)\">\r\n\t\t\t\t\t\t\t\t\t<input type=\"checkbox\" id=\"selectAll\" class=\"checkAll-checkbox\" ng-click = \"allChecked()\" ng-checked = \"checkBoxManage\"/>\r\n\t\t\t\t\t\t\t\t\t<span style=\"-webkit-user-select: none;\">全选</span>\r\n\t                            </label>\r\n\t                            <!-- <span>\r\n\t                            \t<download-btn name = \"全量导出\" lock = \"isDisabled\" ng-click = \"exprotFileAll()\" class=\"fr\"/>\r\n\t                            </span> -->\r\n\t                            <span>\r\n\t                            \t<download-btn name = \"导出\" lock = \"downloadBtn\" ng-click = \"exprotFile()\" class=\"fr\"/>\r\n\t                            </span>\r\n\t                        </div>\r\n\t                    </div>\r\n\t                    <div class=\"bd\">\r\n\t                        <table class=\"table_user oddEvenColor\" border=\"1\" borderColor=\"#fff\" ng-click=\"tableClick($event)\">\r\n\t                            <tr>\r\n\t                                <th width=\"39\"></th>\r\n\t                            \t<th>案件号</th>\r\n\t                                <th>产品</th>\r\n\t                                <th>资金方</th>\r\n\t                                <th>\r\n\t                                \t数据更新时间\r\n\t                                \t<div class=\"sortWrap\">\r\n\t                                \t\t<div class=\"sortTimeTop\" ng-click = 'sortTime({sortKey:\"update_time\",order:\"asc\"})'></div>\r\n\t                                \t\t<div class=\"sortTimeBottom\" ng-click = 'sortTime({sortKey:\"update_time\",order:\"desc\"})'></div>\r\n\t                                \t</div>\r\n\t                                </th>\r\n\t                                <th>放款金额</th>\r\n\t                                <th>姓名</th>\r\n\t                                <th>身份证号</th>\r\n\t                                <th>当前状态</th> \r\n\t                                <th>放款状态</th>\r\n\t                                <th>操作</th>\r\n\t                            </tr>\r\n\t                            <tr ng-repeat=\"item in loanMenInfo\">\r\n\t                            \t<td><input type=\"checkbox\" ng-model=\"item.CheckboxFlag\" ng-click = \"watchListChecked()\" ng-change = \"watchChecked2()\" ng-disabled = \"item.beAccept\" ng-checked=\"item.CheckboxFlag\"/></td>\r\n\t                                <td ng-bind=\"item.requestId\"></td>\r\n\t                                <td ng-bind=\"item.productionName\"></td>\r\n\t                                <!-- <td ng-bind=\"item.applicantName\"></td> -->\r\n\t                                <td ng-bind=\"item.partnerName\"></td>\r\n\t                                 <td ng-bind=\"item.updateTime.time|timeFilter\"></td>\r\n\t                                <td ng-bind=\"item.loanAmount\"></td>\r\n\t                              \r\n\t                                <td ng-bind=\"item.applicantName\"></td>\r\n\t                                \r\n\t                                <td ng-bind=\"item.cardId\"></td>\r\n\t                                <td ng-bind=\"item.presentStatus\"></td>\r\n\t                                 \r\n\t                                <td ng-bind=\"item.loanStatus\"></td>\r\n\t                                <td><a href=\"javascript:void(0)\" target=\"_blank\" ng-click = \"viewDetail(item)\">查看</a></td>\r\n\t                               \r\n\t                            </tr>\r\n\t                        </table>\r\n\t                    </div>\r\n\t                <div class=\"ft clearfix yeshu\" ng-style=\"{visibility:showPage}\">\r\n\t\t\t            <div class=\"fl ft-lf\"> 共 <span ng-bind=\"count\"></span>条 每页显示\r\n\t\t\t                <select ng-model=\"selectOption.value\" ng-change=\"selectChange(selectOption.value)\" ng-options=\"v for v in selectOption.values\"></select>\r\n\t\t\t            </div>\r\n\t\t\t            <div class=\"fr ft-rt\">\r\n\t\t\t                <div class=\"page clearfix\">\r\n\t\t\t                <span page></span>\r\n\t\t\t            </div>\r\n\t\t\t        </div>\r\n\t\t\t    </div>\r\n\t\t\t</div>\r\n\t    </div>\r\n\t</div>\r\n</div>\r\n"

/***/ }

});