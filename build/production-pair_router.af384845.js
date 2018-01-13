webpackJsonp([19],{

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

/***/ 176:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _jquery = __webpack_require__(109);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _dialog_mask = __webpack_require__(108);

	var _dialog_mask2 = _interopRequireDefault(_dialog_mask);

	__webpack_require__(177);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var dependArr = [__webpack_require__(180).default.name];
	exports.default = {
	    module: angular.module('pairCtrl', dependArr).controller('pairController', ['$scope', 'pairService', '$state', '$timeout', controller]),
	    template: __webpack_require__(181)
	};


	function controller(_, service, $state, $timeout) {
	    'use strict';

	    var o,
	        cfg = {},
	        timer;

	    //  if($state.params && $state.params.object && typeof $state.params.object === 'string'){
	    //     try{_.statusParamInfo = JSON.parse(decodeURI($state.params.object));}catch(e){};
	    // }		

	    _.selectOption = {
	        "type": "select",
	        "name": "Service",
	        "value": "10条",
	        "values": ["10条", "20条", "30条", "40条", "50条"]
	    };

	    var queryParam = function queryParam() {
	        return {
	            status: '',
	            configStatus: '',
	            keyWord: '',
	            pageNo: 1,
	            pageSize: 10,
	            productionCode: '',
	            name: '',
	            accPartnerCode: '',
	            // partnerName : '',
	            fundSharing: '',
	            assetSharing: '',
	            productionName: '',
	            accPartnerName: '',
	            // brSharing : '',
	            // estimateLoan : '',
	            collNode: '',
	            penalty: ''
	        };
	    };

	    //查询参数
	    _.production = queryParam();

	    _.productions = queryParam();

	    _.fundShare = function (name, list) {

	        list.forEach(function (item) {

	            if (item.partnerCode == name) {
	                _.production.fundSharing = item.fundSharing;
	                _.production.accPartnerName = item.partnerName;
	            }
	        });
	    };

	    _.dian = function (item, event) {
	        if (item.con == "－") {
	            item.con = "＋";
	        } else {
	            item.con = "－";
	        }

	        if (item.imgsIcon) {
	            item.imgsIcon = false;
	        } else {
	            item.imgsIcon = true;
	            var cfg = { productionCode: item.productionCode };
	            service.getPairList(cfg).then(function (data) {
	                item.pairLists = data.accpartnerlist;
	            }, function (data) {

	                alert(data.responseMsg);
	            });
	        }
	    };

	    // _.checkStatus = _.statusParamInfo.status == 2 ? false : true;

	    var isArray = Array.isArray;
	    /**
	     * 选择每页显示条数
	     * @param {JSON} data
	     */
	    _.selectChange = function (data) {
	        var num = parseInt(data.replace(/(\d+)\D/, '$1'));
	        _.productions.pageSize = num;
	        _.selectOption.value = num + '条';
	        _.productions.pageNo = 1;
	        o.laterQueryList();
	    };

	    //查询
	    _.searchStart = function () {
	        o.laterQueryList();
	    };
	    function resetProduction() {
	        for (var i in _.production) {
	            _.production[i] = '';
	        }
	    }
	    _.clearSearch = function () {
	        _.productions = queryParam();
	        _.selectOption.value = _.productions.pageSize + '\u6761';
	        o.laterQueryList();
	    };
	    //如果是编辑补全基本信息
	    function fullProduction(obj1, obj2) {
	        for (var i in obj2) {
	            obj1[i] = obj2[i];
	        }
	        return obj1;
	    }
	    // _.handleTitle = function(item){
	    // 	if(item.status === '2'){
	    // 		return '查看';
	    // 	}else{
	    // 		return '配置';
	    // 	}
	    // }
	    //浮点数计算精度
	    function accAdd(arg1, arg2) {
	        var r1, r2, m;
	        try {
	            r1 = arg1.toString().split(".")[1].length;
	        } catch (e) {
	            r1 = 0;
	        };
	        try {
	            r2 = arg2.toString().split(".")[1].length;
	        } catch (e) {
	            r2 = 0;
	        };
	        m = Math.pow(10, Math.max(r1, r2));
	        return (arg1 * m + arg2 * m) / m;
	    }
	    _.viewDetail = function (item) {
	        var param = {
	            "productionCode": item.productionCode,
	            // "name" : item.productionName,
	            "productionName": item.productionName,
	            "partner": item.partner,
	            "partnerCode": item.partnerCode,
	            'status': item.status
	        };
	        var paramss = encodeURI(JSON.stringify(param));
	        _.statusParamInfo = JSON.parse(decodeURI(paramss));

	        // $state.go('configuration.pairOrg',{"object":encodeURI(JSON.stringify(param))})
	    };
	    function validateParam(data) {
	        //等于0可以
	        var ignorePropVal = ['fundSharing', 'assetSharing', 'brSharing', 'collNode'];

	        var validateVal = saveParam(data);

	        //              totalRatio = 1,
	        var isIntType = /^[0-9]*$/;
	        var isAllFill = Object.keys(validateVal).every(function (v) {

	            for (var i = 0, ii = ignorePropVal.length; i < ii; i++) {
	                if (ignorePropVal[i] == v && validateVal[v] == '0') return true;
	            }
	            return typeof validateVal[v] == 'undefined' || validateVal[v] == 0 ? false : true;
	        });
	        //是否填全信息
	        // if(!isAllFill){
	        //     alert('信息填写不全，请检查信息！');
	        //     return false;
	        // }
	        //分成比例
	        //          if(accAdd(accAdd(data.fundSharing,data.assetSharing),data.brSharing) !== totalRatio){
	        //              data.fundSharing = data.assetSharing = data.brSharing = '';
	        //              alert('分成比例信息填写有误，请重新填写！');
	        //              return false;
	        //          }
	        // if(!isIntType.test(data.estimateLoan)){
	        //  data.estimateLoan = '';
	        //  alert('预计放款额必须为正整数！');
	        //  return false;
	        // }
	        if (!isIntType.test(data.collNode)) {
	            data.collNode = '';
	            alert('催收节点必须为正整数！');
	            return false;
	        }
	        return true;
	    }

	    /**
	     * 田中选择列表数据
	     * @param {Array} item
	     * @param {Object} paddingContent
	     */
	    function unshiftDefault(item, paddingContent) {
	        if (isArray(item)) {
	            item.unshift(paddingContent);
	        }
	        return item;
	    }

	    function saveParam(item) {
	        var saveParam = {
	            lasPartnerCode: _.statusParamInfo.partnerCode,
	            productionCode: _.statusParamInfo.code,

	            accPartnerCode: item.partnerName,
	            fundSharing: item.fundSharing,
	            assetSharing: item.assetSharing,
	            // brSharing : item.brSharing,
	            // estimateLoan : item.estimateLoan,
	            collNode: item.collNode
	        };
	        if (_.editFlag) {
	            saveParam.id = item.id;
	        };
	        return saveParam;
	    }

	    _.productionStatusList = [{ id: '0', value: '待生效' }, { id: '1', value: '生效' }, { id: '2', value: '结束' }];
	    function paddingData(data) {
	        var productionStatusList = [{ id: '0', value: '待生效' }, { id: '1', value: '生效' }, { id: '2', value: '结束' }],
	            configStatusList = [{ id: '0', value: '否' }, { id: '1', value: '是' }];
	        return {
	            productionStatusList: unshiftDefault(productionStatusList, {
	                id: '',
	                value: '请选择'
	            }),
	            configStatusList: unshiftDefault(configStatusList, {
	                id: '',
	                value: '请选择'
	            })
	        };
	    }

	    // 删除
	    _.deletePair = function (id, item) {
	        if (confirm("你确定删除吗？")) {
	            var param = {
	                id: id
	            };
	            service.delete(param).then(function (data) {

	                item.imgsIcon = true;
	                var cfg = { productionCode: item.productionCode };
	                service.getPairList(cfg).then(function (data) {
	                    item.pairLists = data.accpartnerlist;
	                    if (item.pairLists.length == 0) {
	                        item.addShow = false;
	                        item.imgsIcon = false;
	                        item.configStatus = "0";
	                    }
	                }, function (data) {
	                    alert(data.responseMsg);
	                });
	            }, function (reason) {
	                alert(reason.responseMsg);
	            });
	        } else {}
	    };

	    //编辑
	    _.openPair = function () {
	        var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	        var ite = arguments[1];


	        //新建/编辑默认项
	        getSelectInfo(item);
	        _.dialogShow = true;
	        _dialog_mask2.default.show({ height: _.getClientHeight() });
	        item ? render(item, _.statusParamInfo) : render(_.statusParamInfo);
	    };

	    _.savePair = function () {
	        if (!validateParam(_.production)) return;

	        service.save(_.production).then(function (data) {
	            // service.save(saveParam(_.production)).then(function(data){
	            alert(data.responseMsg);
	            _.dialogShow = false;
	            _dialog_mask2.default.hidden();
	            // o.getUserInfoList();

	            var cfg = { productionCode: _.production.productionCode };
	            service.getPairList(cfg).then(function (data) {

	                _.pairList.forEach(function (item) {
	                    if (item.productionCode == _.production.productionCode) {
	                        item.imgsIcon = true;
	                        item.pairLists = data.accpartnerlist;
	                        item.addShow = true;
	                        item.con = "－";
	                        item.configStatus = "1";
	                    }
	                });
	            }, function (data) {
	                alert(data.responseMsg + '66');
	            });
	        }, function (reason) {
	            alert(reason.responseMsg);
	        });
	    };

	    _.closePair = function () {
	        _.dialogShow = false;
	        _dialog_mask2.default.hidden();
	    };

	    /**
	     * 有第二个值为走编辑
	     */
	    function render(item, addInfo) {
	        _.editFlag = addInfo ? true : false;
	        //重置production所有字段值
	        resetProduction();
	        item = addInfo ? fullProduction(item, addInfo) : item;

	        for (var i in item) {
	            if (!_.production[i]) _.production[i] = item[i];
	        }
	        _.production.accPartnerCode = addInfo ? item.accPartnerCode : '';
	    }

	    /**
	     * 资金方下拉列表
	     * @param {Object} item
	     */
	    function getSelectInfo() {
	        var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { partnerCode: _.statusParamInfo.partnerCode, productionCode: _.statusParamInfo.code };


	        function getSelectList() {
	            item = item.accPartnerCode ? { partnerCode: item.partnerCode, accPartnerCode: item.accPartnerCode, productionCode: item.productionCode } : item;

	            service.getAccSideList(item).then(function (data) {

	                var bankrollParList = [];
	                if (Array.isArray(data.bankrollParList)) {
	                    bankrollParList = data.bankrollParList.slice();
	                    bankrollParList.unshift({
	                        partnerCode: "",
	                        partnerName: "请选择"
	                    });
	                }
	                _.accSideList = bankrollParList;
	            }, function (reason) {
	                alert(reason.responseMsg);
	            });
	        }
	        $timeout(getSelectList, 50);
	    }
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
	            var param = JSON.parse(JSON.stringify(_.productions));
	            for (var item in param) {
	                if (item == 'isFirst') continue;
	                if (!param[item]) delete param[item];
	            }

	            service.getProductionaccpartnerList(param).then(function (data) {
	                if (data.page.result) _.pairList = data.page.result || [];

	                _.pairList.forEach(function (item) {
	                    item.imgsIcon = false;
	                    item.addShow = false;
	                    if (item.configStatus == "1") {
	                        item.addShow = true;
	                        item.con = "＋";
	                    } else {
	                        item.addShow = false;
	                    }

	                    for (var i = 0; i < _.productionStatusList.length; i++) {
	                        if (_.productionStatusList[i].id == item.status) {
	                            item.status = _.productionStatusList[i].value;
	                        }
	                    }
	                    // _.productionStatusList.forEach(function(i){
	                    //     if (item.status === i.id) {
	                    //         item.status = i.value;
	                    //     }
	                    // })
	                });

	                _.baseData = paddingData(data);
	                //页码问题
	                if (data.page.result.length == 0 && _.productions.pageNo !== 1) {
	                    _.productions.pageNo = _.productions.pageNo - 1;
	                    o.getUserInfoList();
	                }
	                _.count = data.page.totalCount;
	                _.showPage = 'visible';
	                _.currentPage = data.page.pageNo;
	                //多余3000条或等于0条不能导出
	                _.allExportFlag = data.page.totalCount && data.page.totalCount;
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
	        _.productions.pageNo = data.pageSelectedNum;
	        o.getUserInfoList();
	        _.productions.pageNo = 1; //默认值
	    });
	}

/***/ },

/***/ 177:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(178);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(16)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(178, function() {
				var newContent = __webpack_require__(178);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 178:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)();
	// imports


	// module
	exports.push([module.id, ".pair-dialog{\r\n    width: 700px;\r\n    height: 400px;\r\n    position: fixed;\r\n    margin: -200px -350px 0 0;\r\n    top: 380px;\r\n    right: 50%;\r\n    z-index: 1200;\r\n    background: #efefef;\r\n}\r\n.pair-dialog-title{\r\n\theight: 50px;\r\n    line-height: 50px;\r\n    text-indent: 23px;\r\n    font-weight: 700;\r\n}\r\n.pair-title{\r\n\twidth: 114px; \r\n\ttext-align: right;\r\n}\r\n.pair-wrap tr{\r\n\theight: 50px;\r\n}\r\n.pair-wrap input{\r\n\twidth: 184px;\r\n}\r\n.pair-button{\r\n\tborder: none;\r\n    border-radius: 5px;\r\n    display: inline-block;\r\n    font-family: microsoft yahei;\r\n    font-size: 14px;\r\n    color: #ffffff;\r\n    padding: 10px 37px;\r\n    cursor: pointer;\r\n    background: #d8524a;\r\n    margin: 0 20px;\r\n}\r\n.handle-btn{\r\n\ttext-align: center;\r\n    margin: 20px 0;\r\n}\r\n.producitonInfo{\r\n\tbackground: #f2f2f2;\r\n\tpadding: 0 6px;\r\n\tborder: 1px solid #ccc;\r\n}\r\n.pair-edit-readonly{\r\n\tbackground: #ccc;\r\n\tborder: 1px solid #bbb;\r\n}\r\n.br-blank{\r\n\ttext-align: center;\r\n\tbackground: #efefef;\r\n\tborder: 1px solid #efefef;\r\n}\r\n.pair-edit-select{\r\n\twidth: 184px;\r\n\theight: 24px;\r\n}\r\n.arrow_right{\r\n\tbackground:url(" + __webpack_require__(179) + ") no-repeat right 18px;\r\n\tbackground-size: 85% 16px;\r\n}\r\n\r\n.table-th {\r\n    width:100%;\r\n    height: 30px;\r\n    margin:0;\r\n    padding:0;\r\n    text-align:center;\r\n    // border: 1px solid #ccc;\r\n}\r\n.table-th h5 {\r\n    float: left;\r\n    font-weight: 700;\r\n    width: 19%;\r\n    height: 36px;\r\n    line-height: 36px;\r\n    text-align: center;\r\n    background-color: #f6f6f6;\r\n     margin:0;\r\n    padding:0;\r\n     border-right: 1px solid #fff;\r\n\r\n}\r\n.table-th .hOne {\r\n    width: 22%;\r\n}\r\n\r\n.table-tbody {\r\n   width: 100%;\r\n   margin:0;\r\n    padding:0;\r\n}\r\n.table-tbody:nth-child(2n) p{\r\n    background-color: #F7F7F7;\r\n}\r\n.table-tbody:nth-child(2n+1) p{\r\n    background-color: #fff;\r\n}\r\n.capital-tbody:nth-child(2n+1) p{\r\n    background-color: #F0F0F0;\r\n}\r\n.capital-tbody:nth-child(2n) p{\r\n    background-color: #F7F7F7;\r\n}\r\n\r\n.table-tbody:hover .ps p{\r\n    background-color: #dee9f9;\r\n}\r\n\r\n.table-tbody p{\r\n    float: left;\r\n    width: 19%;\r\n    height: 34px;\r\n    margin:0;\r\n    padding:0;\r\n    line-height: 34px;\r\n     border-right: 1px solid #fff;\r\n    text-align: center;\r\n}\r\n.table-tbody .hOne {\r\n    width: 22%;\r\n}\r\n.capital-tbody p{\r\n    float: left;\r\n    width: 14%;\r\n    height: 30px;\r\n    margin:0;\r\n    padding:0;\r\n    line-height: 30px;\r\n     border-right: 1px solid #fff;\r\n    text-align: center;\r\n}\r\n\r\n.clearFix:after {\r\n    height: 0px;\r\n    display: block;\r\n    line-height: 0px;\r\n    clear: both;\r\n    content: '';\r\n}\r\n\r\n.capital {\r\n  width: 95%;\r\n  margin: 16px 50px;\r\n  height: 30px;\r\n\r\n}\r\n\r\n.capital .capital-th, .capital-tbody{\r\n    width: 95%;\r\n    height: 30px;\r\n    margin:0;\r\n    padding:0;\r\n    text-align:center;\r\n}\r\n.capital .capital-th h5 {\r\n    float: left;\r\n    font-weight: 700;\r\n    width: 14%;\r\n    height: 32px;\r\n    line-height: 32px;\r\n    text-align: center;\r\n    background-color: #eee;\r\n     margin:0;\r\n    padding:0;\r\n     border-right: 1px solid #fff;\r\n\r\n}\r\n\r\n.imgIcon {\r\n   position: absolute;\r\n   left: 14px; \r\n   top:8px;\r\n   width: 16px; \r\n   height: 16px;\r\n   line-height:16px;\r\n   text-align:center;\r\n   border: 2px solid #000;\r\n   border-radius: 3px;\r\n   font-size: 18px;\r\n   font-weight: 700;\r\n   color: #000;\r\n}\r\n.imgIcon:hover {\r\n    cursor: pointer;\r\n}\r\n", ""]);

	// exports


/***/ },

/***/ 179:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "/images/arrow_right.png";

/***/ },

/***/ 180:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = angular.module('pairSer', []).factory('pairService', ['util', 'ajax', service]);


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
	        upService: function upService() {
	            return ajax.post();
	        },
	        downLoadFile: function downLoadFile() {
	            return ajax.post();
	        },
	        freezeCtrl: function freezeCtrl() {
	            return ajax.post();
	        },
	        getProductionaccpartnerList: function getProductionaccpartnerList(cfg) {
	            return ajax.post("/acc/productionaccpartner/list.do", cfg);
	        },
	        delete: function _delete(cfg) {
	            return ajax.post("/acc/productionaccpartner/deleteProductionAccPartner.do", cfg);
	        },
	        save: function save(cfg) {
	            return ajax.post('/acc/productionaccpartner/save.do', cfg);
	        },
	        getPairList: function getPairList(cfg) {
	            return ajax.post("/acc/productionaccpartner/accpartnerlist.do", cfg);
	        },
	        getAccSideList: function getAccSideList(cfg) {
	            return ajax.post("/acc/productionaccpartner/bankrollParList.do", cfg);
	        }
	    };
	}

/***/ },

/***/ 181:
/***/ function(module, exports) {

	module.exports = "<div class=\"main\">\r\n\t<loding-mask></loding-mask>\r\n\t<div class=\"inner\" ng-style=\"{'min-height':isShowReportDialog ? '5000px':'auto'}\">\r\n\t    <div class=\"inner-header clearfix\">\r\n\t        <div class=\"inner-header-lf fl\">机构配对</div>\r\n\t        <!--<div class=\"inner-header-rt fr\" style=\"min-width:220px\">-->\r\n\t            <!--<a  ui-sref =\"configuration.newOrganic\" class=\"btn1 fr importA\">新建机构</a>-->\r\n\t        <!--</div>-->\r\n\t    </div>\r\n\t    <div class=\"inner-body\">\r\n\t        <div class=\"inner-select\">\r\n\t            <table style=\"width: 100%;\">\r\n\t            \t<tr>\r\n\t                    <td class=\"tl-r\">产品状态：</td>\r\n\t                    <td>\r\n\t                        <select class=\"select-global\" ng-model=\"productions.status\" ng-options = \"option.id as option.value for option in baseData.productionStatusList\"></select>\r\n\t                    </td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t                \t<td class=\"tl-r\">配置状态：</td>\r\n\t                    <td>\r\n\t                        <select class=\"select-global\" ng-model=\"productions.configStatus\" ng-options = \"option.id as option.value for option in baseData.configStatusList\"></select>\r\n\t                    </td>\r\n\t                </tr>\r\n\t               <!--  <tr>\r\n\t                    <td class=\"tl-r\"> 关键字：</td>\r\n\t                    <td class=\"fl search\">\r\n\t                        <input type=\"text\"  placeholder=\"产品编码\" ng-model=\"production.keyWord\" id=\"search\"/>\r\n\t                    </td>\r\n\t                </tr> -->\r\n\t                <!-- <tr> -->\r\n\t\t\t\t\t\t<td class=\"tl-r\"></td>\r\n\t\t\t\t\t\t<td class=\"fl search\">\r\n\t\t\t\t\t\t\t<div class=\"search-start\" ng-click=\"searchStart()\">查 询</div>\r\n\t\t\t\t\t\t\t<div class=\"search-start\" ng-click=\"clearSearch()\">清 空</div>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t</tr>\r\n\t            </table>\r\n\t            <div class=\"inner-table\">\r\n\t                    <div class=\"hdFixed\">\r\n\t                    </div>\r\n\t                    <div class=\"bd\">\r\n\t                        <!-- <table class=\"table_user oddEvenColor\" border=\"1\" borderColor=\"#fff\" ng-click=\"tableClick($event)\"> -->\r\n\t                        \t<div class=\"table_user oddEvenColor\" border=\"1\" borderColor=\"#fff\" ng-click=\"tableClick($event)\" style=\"width: 1164px;\"></div>\r\n\t                            <div class=\"table-th\" >\r\n\t                                <h5 class=\"hOne\">\r\n\t                                \t产品名称\r\n\t                                \t<!--<div class=\"sortWrap\">\r\n\t                                \t\t<div class=\"sortTimeTop\" ng-click = 'sortTime({sortKey:\"update_time\",order:\"asc\"})'></div>\r\n\t                                \t\t<div class=\"sortTimeBottom\" ng-click = 'sortTime({sortKey:\"update_time\",order:\"desc\"})'></div>\r\n\t                                \t</div>-->\r\n\t                                </h5>\r\n\t                                <h5>产品编码</h5>\r\n\t                                <!-- <th>关联资金方</th> -->\r\n\t                                <h5>产品状态</h5>\r\n\t                            \t  <h5>配置状态</h5>\r\n\t                            \t  <!-- <h5>违约金</h5> -->\r\n\t                                <h5>操作</h5>\r\n\t                            </div>\r\n\t                            <div  class=\"table-tbody\" ng-repeat=\"item in pairList\">\r\n\t                               <div class=\"clearFix ps\">\r\n\t                               \t\t<p  style=\"position: relative;\" class=\"hOne\">\r\n\t                               \t\t\t<!-- imgsIcon -->\r\n\t                               \t\t\t<span \r\n\r\n\t                               \t\t\tclass=\"imgIcon\"\r\n\t                               \t\t  ng-click=\"dian(item,$event)\"\r\n\t                               \t\t  ng-if=\"item.addShow\"\r\n\t                               \t\t  >\r\n\t                               \t\t\t\t{{item.con}}\r\n\t                               \t\t\t</span>\r\n                                   {{item.productionName}}\r\n\t                                </p>\r\n\t                                <p  ng-bind=\"item.productionCode\"></p>\r\n\t                                <!--<p width=\"15%\" ng-bind=\"item.productionCode\"></p> -->\r\n\t                                <p  ng-bind=\"item.status\"></p>\r\n\t                                \r\n\t                                <p  ng-bind=\"item.configStatus|configStatus\"></p>\r\n\t                                <!-- <p  ng-bind=\"item.penalty\"></p> -->\r\n\t                                <p>\r\n\t                                \t<!-- <a href=\"javascript:void(0)\" ng-click = \"viewDetail(item)\" ng-bind = \"handleTitle(item)\">配置</a> -->\r\n\t                                \t <a \r\n\t                                \t  href=\"javascript:void(0)\"  \r\n                                      ng-mouseover=\"viewDetail(item)\"\r\n\t                                \t  ng-click = \"openPair()\">\r\n\t                                \t 新增配对</a>\r\n\t                                </p>\r\n\t                               \t</div>\r\n\t                               <div class=\"capital\" ng-if=\"item.imgsIcon\">\r\n\t                               \t<div class=\"capital-th\">\r\n\t                               \t\t<h5>资金方名称</h5>\r\n\t                               \t\t<h5>资金方编码</h5>\r\n\t                               \t\t<h5>资金成本</h5>\r\n\t                               \t\t<h5>水象产品利率</h5>\r\n\t                               \t\t<h5>催收节点</h5>\r\n\t                               \t\t<h5>违约金</h5>\r\n\t                               \t\t<h5>操作</h5>\r\n\t                               \t</div>\r\n\t                               \t<div class=\"capital-tbody\" ng-repeat=\"itemo in  item.pairLists\">\r\n\t                               \t <p  ng-bind=\"itemo.accPartnerName\"></p>\r\n\t                               \t <p  ng-bind=\"itemo.accPartnerCode\"></p>\r\n\t                                 <p  ng-bind=\"itemo.fundSharing\"></p>\r\n\t                                 <!--<p width=\"15%\" ng-bind=\"item.productionCode\"></p> -->\r\n\t                                 <p  ng-bind=\"itemo.assetSharing\"></p>\r\n\r\n\t                                 <p  ng-bind=\"itemo.collNode\"></p>\r\n\t                                 <p  ng-bind=\"itemo.penalty\"></p>\r\n\t                                 <p>\r\n\t                                \t<!-- <a href=\"javascript:void(0)\" ng-click = \"viewDetail(item)\" ng-bind = \"handleTitle(item)\">配置</a> -->\r\n\t                                \t<!--  <a \r\n\t                                \t  href=\"javascript:void(0)\"  \r\n\t                                \t  ng-click = \"openPair()\">\r\n\t                                \t 停用</a> -->\r\n\t                                \t <a href=\"javascript:void(0)\"\r\n                                      ng-click=\"deletePair(itemo.id,item)\"\r\n\t                                \t >删除</a>\r\n\t                                \t <a href=\"javascript:void(0)\"\r\n                                       ng-mouseover=\"viewDetail(item)\"\r\n\t                                \t  ng-click = \"openPair(itemo,item)\">编辑</a>\r\n\t                                 </p>\t\r\n\t                               \t</div>\r\n\t                               </div>\r\n\t                            </div>\r\n\t                        </div>\r\n\t                    </div>\r\n\r\n\r\n\t                <div class=\"ft clearfix yeshu\" ng-style=\"{visibility:showPage}\">\r\n\t\t\t            <div class=\"fl ft-lf\">\r\n\t\t\t                                共 <span ng-bind=\"count\"></span>条 每页显示\r\n\t\t\t                <select ng-model=\"selectOption.value\" ng-change=\"selectChange(selectOption.value)\" ng-options=\"v for v in selectOption.values\">\r\n\t\t\t                </select>\r\n\t\t\t                </div>\r\n\t\t\t                <div class=\"fr ft-rt\">\r\n\t\t\t                    <div class=\"page clearfix\">\r\n\t\t\t                        <span page></span>\r\n\t\t\t                    </div>\r\n\t\t\t                </div>\r\n\t\t\t    </div>\r\n\t\t\t</div>\r\n\t    </div>\r\n\t    <div class=\"inner-footer\"></div>\r\n\t    <div class=\"pair-dialog\" ng-if = \"dialogShow\">\r\n\t    \t<div class=\"pair-dialog-title\">配对配置</div>\r\n\t    \t<table class = \"pair-wrap\">\r\n\t    \t\t<tr>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class=\"pair-title\">产品名称：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input class=\"pair-edit-readonly\" type=\"text\"  maxlength=\"50\" ng-model = \"production.productionName\" readonly=\"readonly\" />\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td><div style=\"width: 50px;\"></div></td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class=\"pair-title\">产品编码：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input class=\"pair-edit-readonly\" type=\"text\"  maxlength=\"50\" ng-model = \"production.productionCode\" readonly=\"readonly\" />\r\n\t    \t\t\t</td>\r\n\t    \t\t</tr>\r\n\t    \t\t<tr>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class=\"pair-title\">关联资金方：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<select class=\"pair-edit-select\" ng-model = \"production.accPartnerCode\" \r\n\t    \t\t\t\tng-change=fundShare(production.accPartnerCode,accSideList)\r\n\t    \t\t\t\tng-options = \"option.partnerCode as option.partnerName for option in accSideList\"></select>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td class=\"arrow_right\"></td>\r\n\t    \t\t\t\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class=\"pair-title\">资金成本:</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<!-- oninput=\"if(value.length>4)value=value.slice(0,6)\" -->\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input  class=\"pair-edit-readonly\" \r\n\t    \t\t\t\t type=\"number\"  ng-model = \"production.fundSharing\"\r\n\t    \t\t\t\t readonly=\"readonly\" />\r\n\t    \t\t\t</td>\r\n\t    \t\t</tr>\r\n\t    \t\t<tr>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class=\"pair-title\">资产方：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input class=\"pair-edit-readonly\" type=\"text\"  ng-model = \"production.partner\" readonly=\"readonly\"/>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td class=\"arrow_right\"></td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class=\"pair-title\">产品综合利率:</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input type=\"number\"  oninput=\"if(value.length>4)value=value.slice(0,6)\" ng-model = \"production.assetSharing\" />\r\n\t    \t\t\t</td>\r\n\t    \t\t</tr>\r\n\t    \t\t<tr>\r\n\t    \t\t\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class=\"pair-title\">催收节点：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input type=\"text\" maxlength=\"50\" ng-model = \"production.collNode\" />\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td><div style=\"width: 50px;\"></div></td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class=\"pair-title\">违约金：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input type=\"text\" maxlength=\"50\" ng-model = \"production.penalty\" />\r\n\t    \t\t\t</td>\r\n\t    \t\t</tr>\r\n\t    \t</table>\r\n\t    \t<div class=\"handle-btn\">\r\n\t    \t\t<button class=\"pair-button\" ng-click = \"savePair()\">确定</button>\r\n\t    \t\t<button class=\"pair-button\" ng-click = \"closePair()\">返回</button>\r\n\t    \t</div>\r\n\t    </div>\r\n\t</div>\r\n</div>\r\n\t\r\n\t\t\r\n"

/***/ }

});