webpackJsonp([11],{140:function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function controller(_,service,$timeout,$state,util,$q){function unshiftOption(arrList,shiftOption){return Array.isArray(arrList)&&arrList.unshift(shiftOption),arrList}function paddingData(data){var presentStatusList=[{id:"正常",value:"正常"},{id:"逾期",value:"逾期"},{id:"已结清",value:"已结清"},{id:"一次结清",value:"一次结清"},{id:"取消借款",value:"取消借款"}],loanStatusList=[{id:"待放款",value:"待放款"},{id:"提交失败",value:"提交失败"},{id:"放款成功",value:"放款成功"},{id:"放款失败",value:"放款失败"}];return{productionList:unshiftOption(data.productionList,{productionCode:"",productionName:"请选择"}),presentStatusList:unshiftOption(presentStatusList,{id:"",value:"请选择"}),loanStatusList:unshiftOption(loanStatusList,{id:"",value:"请选择"})}}function triggerDownloadBtn(){var isExistCheckData=_.loanMenInfo.some(function(item){return!!item.CheckboxFlag});return isExistCheckData}function triggerCheckAllBtn(){var isExistCheckData=_.loanMenInfo.every(function(item){return!!item.CheckboxFlag});_.checkBoxManage=isExistCheckData}function deleteEmptyData(data){if(data){for(var item in data)"00"!==data[item]&&""!==data[item]||delete data[item];return data}}var o,timer;_.count="",_.downloadBtn=!1,_.checkBoxManage=!1,_.loanMenInfo=[],_.selectOption={type:"select",name:"Service",value:"10条",values:["10条","20条","30条","40条","50条"]};var queryParam=function(){return{order:"desc",orderBy:"create_time",createTimeStart:util.getLatelyDay(2),createTimeEnd:"",updateTimeStart:"",updateTimeEnd:"",productionCode:"",presentStatus:"",loanStatus:"",keyWord:"",pageSize:10,pageNo:1}};_.query=queryParam(),_.selectChange=function(data){var num=parseInt(data.replace(/(\d+)\D/,"$1"));_.query.pageSize=num,_.selectOption.value=num+"条",_.query.pageNo=1,o.laterQueryList()},_.getCreateStartDate=function(startTime){_.getDate("#inpCreateStart",function(starTime){_.query.createTimeStart=starTime,_.$apply()})},_.getCreateEndDate=function(){_.getDate("#inpCreateEnd",function(endTime){_.query.createTimeEnd=endTime,_.$apply()})},_.getStartDate=function(){_.getDate("#inpstart",function(starTime){_.query.updateTimeStart=starTime,_.$apply()})},_.getEndDate=function(){_.getDate("#inpend",function(endTime){_.query.updateTimeEnd=endTime,_.$apply()})},_.searchStart=function(){o.laterQueryList()},_.clearSearch=function(){_.query=queryParam(),o.laterQueryList()};var isFirst=function(){var count=1,isFirst=!0;return function(){return count>1&&(isFirst=!1),count+=1,isFirst}}();_.allChecked=function(){_.checkBoxManage=!_.checkBoxManage,_.loanMenInfo.length<1||(_.loanMenInfo.forEach(function(v){v.CheckboxFlag=_.checkBoxManage}),_.downloadBtn=triggerDownloadBtn())},_.watchListChecked=function(){_.downloadBtn=triggerDownloadBtn(),triggerCheckAllBtn()},_.viewDetail=function(item){var params={requestId:item.requestId,name:"loanInfo"};window.open("#/financial/viewDetail/"+encodeURI(JSON.stringify(params)))},_.exprotFile=function(){var idsArr=[],exportCfg={},isIds=function(){var arr=_.loanMenInfo.slice(0);return arr.forEach(function(v){v.CheckboxFlag&&idsArr.push(v.id)}),idsArr}();exportCfg.idList=isIds,service.exprotFile(exportCfg)},_.exprotFileAll=function(){return _.count>3e3?void alert("全量导出不能超过3000条!"):0==_.count?void alert("全量导出不能导出0条!"):(delete _.downFileFilter.pageSize,delete _.downFileFilter.pageNo,void service.exprotFile(_.downFileFilter))},_.sortTime=function(sorts){_.query.order=sorts.order,_.query.orderBy=sorts.sortKey},o={laterQueryList:function(){var that=this;timer&&clearTimeout(timer),timer=setTimeout(function(){that.getUserInfoList()},200)},getUserInfoList:function(config){var cfg=JSON.parse(JSON.stringify(_.query));cfg.isFirst=isFirst(),_.downFileFilter=deleteEmptyData(cfg),service.getLoanMenInfoList(_.query).then(function(data){_.baseSelectData=paddingData(data),_.downloadBtn=_.checkBoxManage=!1,_.loanMenInfo=data.page.result?data.page.result:[],_.loanMenInfo.forEach(function(v){v.CheckboxFlag=!1}),console.log(_.loanMenInfo),0==data.page.result.length&&1!==_.query.pageNo&&(_.query.pageNo=_.query.pageNo-1,o.getUserInfoList()),_.count=data.page.totalCount,_.showPage="visible",_.currentPage=data.page.pageNo,_.isDisabled=_.count<3e3&&_.count>0,_.$broadcast("EVT_PAGE_CHANGE",{total:data.page.totalPages,current:_.currentPage})},function(data){alert(data.responseMsg)})},init:function(){this.getUserInfoList(),_.lodingMask=!0}},o.init(),_.$on("EVT_PAGE_SELECTED",function(evt,data){_.query.pageNo=data.pageSelectedNum,o.getUserInfoList(),_.query.pageNo=1})}Object.defineProperty(exports,"__esModule",{value:!0});var _jquery=__webpack_require__(109),dependArr=(_interopRequireDefault(_jquery),[__webpack_require__(141).default.name]);exports.default={module:angular.module("loanMenInfoCtrl",dependArr).controller("loanMenInfoController",["$scope","loanMenInfoService","$timeout","$state","util","$q",controller]),template:__webpack_require__(142)}},141:function(module,exports){"use strict";function service(util,ajax){return{getLoanMenInfoList:function(cfg){return ajax.post("/acc/productionloan/selectLoan.do",cfg)},exprotFile:function(cfg){if("idList"in cfg){if(!cfg.idList.length)return void alert("请选择要导出的案件");location.href="/acc/productionloan/downloadExcel.do?idList="+cfg.idList}else if(util.isEmptyObject(cfg)){var param="";for(var params in cfg)param+=params+"="+cfg[params]+"&";var url="/acc/productionloan/downloadExcel.do?"+param;url=url.slice(0,-1),location.href=url}}}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=angular.module("loanMenInfoSer",[]).factory("loanMenInfoService",["util","ajax","validator",service])},142:function(module,exports){module.exports='<div class="main">\r\n\t<loding-mask></loding-mask>\r\n\t<div class="inner" ng-style="{\'min-height\':isShowReportDialog ? \'5000px\':\'auto\'}">\r\n\t    <div class="inner-header clearfix">\r\n\t        <div class="inner-header-lf fl">借款人财务信息</div>\r\n\t    </div>\r\n\t    <div class="inner-body">\r\n\t        <div class="inner-select">\r\n\t            <table style="width: 100%;">\r\n\t                <tr>\r\n\t                    <td class="tl-r">数据创建时间范围：<input type="hidden" id="timeDefaut"></td>\r\n\t                    <td style="width: 500px;">\r\n\t                    \t<input id="inpCreateStart" class="datainp inp1 fl calendar" ng-model = \'query.createTimeStart\' ng-click = "getCreateStartDate(query.createTimeStart)" type="text" placeholder="开始日期" value=""  readonly>\r\n\t                        <span class="fl" style="line-height:27px;padding:0 6px;">至</span>\r\n\t\t\t\t\t\t    <input id="inpCreateEnd" class="datainp inp1 fl calendar" ng-model = \'query.createTimeEnd\' ng-click = "getCreateEndDate(query.createTimeEnd)" type="text" placeholder="结束日期" readonly>\r\n\t                    </td>\r\n\t                \t<td class="tl-r">数据更新时间范围：<input type="hidden" id="timeDefaut"></td>\r\n\t                    <td>\r\n\t                    \t<input id="inpstart" class="datainp inp1 fl calendar" ng-model = \'query.updateTimeStart\' ng-click = "getStartDate(query.updateTimeStart)" type="text" placeholder="开始日期" value=""  readonly>\r\n\t                        <span class="fl" style="line-height:27px;padding:0 6px;">至</span>\r\n\t\t\t\t\t\t    <input id="inpend" class="datainp inp1 fl calendar" ng-model = \'query.updateTimeEnd\' ng-click = "getEndDate(query.updateTimeEnd)" type="text" placeholder="结束日期" readonly>\r\n\t                    </td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t                    <td class="tl-r">产品：</td>\r\n\t                    <td>\r\n\t                    \t<select class="select-global" ng-model = "query.productionCode" ng-options = "option.productionCode as option.productionName for option in baseSelectData.productionList"></select>\r\n\t                    </td>\r\n\t                </tr>\r\n\t                  <tr>\r\n\t                    <td class="tl-r">资金方:</td>\r\n\t                    <td>\r\n\t                    \t<select class="select-global" ng-model = "query.productionCode" ng-options = "option.productionCode as option.productionName for option in baseSelectData.productionList"></select>\r\n\t                    </td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t                    <td class="tl-r">当前状态：</td>\r\n\t                    <td>\r\n\t                    \t<select class="select-global" ng-model = "query.presentStatus" ng-options = "option.id as option.value for option in baseSelectData.presentStatusList"></select>\r\n\t                    </td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t                <td class="tl-r">放款状态：</td>\r\n\t                    <td>\r\n\t                    \t<select class="select-global" ng-model = "query.loanStatus" ng-options = "option.id as option.value for option in baseSelectData.loanStatusList"></select>\r\n\t                    </td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t                    <td class="tl-r"> 关键字：</td>\r\n\t                    <td class="fl search">\r\n\t                        <input type="text" placeholder="姓名/案件号/身份证号" ng-model="query.keyWord" id="search"/>\r\n\t                    </td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t\t\t\t\t\t<td class="tl-r"></td>\r\n\t\t\t\t\t\t<td class="fl search">\r\n\t\t\t\t\t\t\t<div class="search-start" behavior ng-click="searchStart()">查 询</div>\r\n\t\t\t\t\t\t\t<div class="search-start" behavior ng-click="clearSearch()">清 空</div>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t</tr>\r\n\t            </table>\r\n\t                </div>\r\n\t                <div class="inner-table">\r\n\t                    <div class="hdFixed">\r\n\t                        <div class="hd clearfix id" id="tableHD">\r\n\t                            <label class="checkAll-wrap" ng-click="selectAll($event);tableClick($event)">\r\n\t\t\t\t\t\t\t\t\t<input type="checkbox" id="selectAll" class="checkAll-checkbox" ng-click = "allChecked()" ng-checked = "checkBoxManage"/>\r\n\t\t\t\t\t\t\t\t\t<span style="-webkit-user-select: none;">全选</span>\r\n\t                            </label>\r\n\t                            <span>\r\n\t                            \t<download-btn name = "全量导出" lock = "isDisabled" ng-click = "exprotFileAll()" class="fr"/>\r\n\t                            </span>\r\n\t                            <span>\r\n\t                            \t<download-btn name = "导出" lock = "downloadBtn" ng-click = "exprotFile()" class="fr"/>\r\n\t                            </span>\r\n\t                        </div>\r\n\t                    </div>\r\n\t                    <div class="bd">\r\n\t                        <table class="table_user oddEvenColor" border="1" borderColor="#fff" ng-click="tableClick($event)">\r\n\t                            <tr>\r\n\t                                <th width="39"></th>\r\n\t                            \t<th>案件号</th>\r\n\t                                <th>产品</th>\r\n\t                                <th>资金方</th>\r\n\t                                <th>\r\n\t                                \t数据更新时间\r\n\t                                \t<div class="sortWrap">\r\n\t                                \t\t<div class="sortTimeTop" ng-click = \'sortTime({sortKey:"update_time",order:"asc"})\'></div>\r\n\t                                \t\t<div class="sortTimeBottom" ng-click = \'sortTime({sortKey:"update_time",order:"desc"})\'></div>\r\n\t                                \t</div>\r\n\t                                </th>\r\n\t                                <th>放款金额</th>\r\n\t                                <th>姓名</th>\r\n\t                                <th>身份证号</th>\r\n\t                                <th>当前状态</th>\r\n\t                                <!-- <th>操作状态</th> -->\r\n\t                                <th>放款状态</th>\r\n\t                                \r\n\t                            </tr>\r\n\t                            <tr ng-repeat="item in loanMenInfo">\r\n\t                            \t<td><input type="checkbox" ng-model="item.CheckboxFlag" ng-click = "watchListChecked()" ng-change = "watchChecked2()" ng-disabled = "item.beAccept" ng-checked="item.CheckboxFlag"/></td>\r\n\t                                <td ng-bind="item.requestId"></td>\r\n\t                                <td ng-bind="item.productionName"></td>\r\n\t                                <td ng-bind="item.updateTime.time|timeFilter"></td>\r\n\t                                <td ng-bind="item.loanAmount"></td>\r\n\t                                <td ng-bind="item.applicantName"></td>\r\n\t                                <td ng-bind="item.cardId"></td>\r\n\t                                <td ng-bind="item.presentStatus"></td>\r\n\t                                <!-- <td ng-bind="item.operationStatus"></td> -->\r\n\t                                 <td><a href="javascript:void(0)" target="_blank" ng-click = "viewDetail(item)">查看</a></td>\r\n\t                                <td ng-bind="item.loanStatus"></td>\r\n\t                               \r\n\t                            </tr>\r\n\t                        </table>\r\n\t                    </div>\r\n\t                <div class="ft clearfix yeshu" ng-style="{visibility:showPage}">\r\n\t\t\t            <div class="fl ft-lf"> 共 <span ng-bind="count"></span>条 每页显示\r\n\t\t\t                <select ng-model="selectOption.value" ng-change="selectChange(selectOption.value)" ng-options="v for v in selectOption.values"></select>\r\n\t\t\t            </div>\r\n\t\t\t            <div class="fr ft-rt">\r\n\t\t\t                <div class="page clearfix">\r\n\t\t\t                <span page></span>\r\n\t\t\t            </div>\r\n\t\t\t        </div>\r\n\t\t\t    </div>\r\n\t\t\t</div>\r\n\t    </div>\r\n\t</div>\r\n</div>\r\n'}});