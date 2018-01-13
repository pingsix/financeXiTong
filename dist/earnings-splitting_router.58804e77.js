webpackJsonp([10],{136:function(module,exports,__webpack_require__){"use strict";function controller(_,service,$state){function unshiftDefault(item,paddingContent){return isArray(item)&&item.unshift(paddingContent),item}function paddingData(data){return{organize1:unshiftDefault(data.partnerList,{partnerName:"请选择",partnerCode:""}),productionList:unshiftDefault(data.productionList,{productionName:"请选择",productionCode:""})}}function handleSourceData(data){var partnerList=[],accPartnerList=[];return isArray(data.partner)&&data.partner.forEach(function(item){var obj1={},obj2={};for(var i in item)/acc/.test(i)?obj1[i]=item[i]:obj2[i]=item[i];partnerList.push(obj2),accPartnerList.push(obj1)}),data.partnerList=partnerList,data.accPartnerList=accPartnerList,data}var o,timer,cfg={};_.selectBaseData2={};var isArray=Array.isArray,queryParam=function(){return{partnerCode:"",accPartnerCode:"",productionCode:"",keyWord:""}};_.query=queryParam(),_.selectOption={type:"select",name:"Service",value:"10条",values:["10条","20条","30条","40条","50条"]},_.searchStart=function(){o.laterQueryList()},_.clearSearch=function(){_.query=queryParam(),o.laterQueryList()},_.exportAll=function(){return _.listBaseData.length<1?void alert("没有可导出的数据！"):void service.downLoadFile(cfg)},_.getSelectFlList=function(code){console.log(code),code&&(_.query.accPartnerCode="",service.getSelectList({partnerCode:code}).then(function(data){data.accPartner.unshift({accPartnerName:"请选择",accPartnerCode:""}),_.selectBaseData2.organize2=data.accPartner},function(reason){alert(reason.responseMsg)}))},o={laterQueryList:function(){timer&&clearTimeout(timer),timer=setTimeout(function(){o.getUserInfoList()},200)},getUserInfoList:function(config){var cfg2=JSON.parse(JSON.stringify(_.query));for(var item in cfg2)cfg2[item]||delete cfg2[item];cfg=cfg2,service.getSplittingList(_.query).then(function(data){_.selectBaseData=paddingData(handleSourceData(data)),_.listBaseData=data.page.result,_.exportAllLock=0!=_.listBaseData.length},function(data){alert(data.responseMsg)})},init:function(){this.getUserInfoList()}},o.init()}Object.defineProperty(exports,"__esModule",{value:!0});var dependArr=[__webpack_require__(137).default.name];exports.default={module:angular.module("splittingCtrl",dependArr).controller("splittingController",["$scope","splittingService","$state",controller]),template:__webpack_require__(138)}},137:function(module,exports){"use strict";function service(util,ajax){return{downLoadFile:function(cfg){var param="";for(var params in cfg)param+=params+"="+cfg[params]+"&";var url="/acc/productionsummarypro/downloadExcel.do?"+param;url=url.slice(0,-1),location.href=url},getSplittingList:function(cfg){return ajax.post("/acc/productionsummarypro/selectDetail.do",cfg)},getSelectList:function(cfg){return ajax.post("/acc/productionsummarypro/selectAccPartner.do",cfg)}}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=angular.module("splittingSer",[]).factory("splittingService",["util","ajax",service])},138:function(module,exports){module.exports='<div class="main">\r\n\t<loding-mask></loding-mask>\r\n\t<div class="inner" ng-style="{\'min-height\':isShowReportDialog ? \'5000px\':\'auto\'}">\r\n\t    <div class="inner-header clearfix">\r\n\t        <div class="inner-header-lf fl">分润情况</div>\r\n\t    </div>\r\n\t    <div class="inner-body">\r\n\t        <div class="inner-select">\r\n\t            <table style="width: 100%;">\r\n\t                <tr>\r\n\t                    <td class="tl-r"> 资金方: </td>\r\n\t                    <td>\r\n\t                        <select class="select-global" ng-model="query.partnerCode" ng-change = "getSelectFlList(query.partnerCode)" ng-options = "option.partnerCode as option.partnerName for option in selectBaseData.organize1"></select>\r\n\t                    </td>\r\n\t                 <!--    <td class="tl-r">Ⅱ类合作机构：</td>\r\n\t                    <td>\r\n\t                        <select class="select-global" ng-model="query.accPartnerCode" ng-options = "option.accPartnerCode as option.accPartnerName for option in selectBaseData2.organize2"></select>\r\n\t                    </td> -->\r\n\t                    <td class="tl-r">产品：</td>\r\n\t                    <td>\r\n\t                        <select class="select-global" ng-model="query.productionCode" ng-options = "option.productionCode as option.productionName for option in selectBaseData.productionList"></select>\r\n\t                    </td>\r\n\t                </tr>\r\n\t               <!--  <tr>\r\n\t                    <td class="tl-r"> 关键字：</td>\r\n\t                    <td class="fl search">\r\n\t                        <input type="text"  placeholder="产品" ng-model="query.keyWord" id="search"/>\r\n\t                    </td>\r\n\t                </tr> -->\r\n\t                <tr>\r\n\t\t\t\t\t\t<td class="tl-r"></td>\r\n\t\t\t\t\t\t<td class="fl search">\r\n\t\t\t\t\t\t\t<div class="search-start" ng-click="searchStart()">查 询</div>\r\n\t\t\t\t\t\t\t<div class="search-start" ng-click="clearSearch()">清 空</div>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t</tr>\r\n\t            </table>\r\n\t            <div class="inner-table">\r\n\t                    <div class="hdFixed">\r\n\t                    </div>\r\n\t                    <div class="bd">\r\n\t                    \t<div style="margin: 20px 0 40px;">\r\n\t                    \t\t<div class="listHeadToolsBar">\r\n\t                    \t\t\t<span class="title">渠道总收益</span>\r\n\t                    \t\t\t<download-btn name = "导出" lock = "true" ng-click = "exportAll()" class="fr"/>\r\n\t                    \t\t</div>\r\n\t                    \t\t<table class="table_user oddEvenColor" border="1" borderColor="#fff">\r\n\t                    \t\t\t<tr>\r\n\t                    \t\t\t\t<td>资金方</td>\r\n\t                    \t\t\t\t<td>产品名称</td>\r\n\t                    \t\t\t\t<td>放款总金额</td>\r\n\t                    \t\t\t\t<td>放款总人数</td>\r\n\t                    \t\t\t\t<td>服务费收益</td>\r\n\t                    \t\t\t\t<td>资金方收益</td>\r\n\t                    \t\t\t\t<td>资金成本</td>\r\n\t                    \t\t\t\t<td>实际服务费收益</td>\r\n\t                    \t\t\t</tr>\r\n\t                    \t\t\t<tr ng-repeat = "item in listBaseData">\r\n\t                    \t\t\t\t<td ng-bind="item.productionName"></td>\r\n\t                    \t\t\t\t<td ng-bind="item.loanAmountTot"></td>\r\n\t                    \t\t\t\t<td ng-bind="item.loanNumTot"></td>\r\n\t                    \t\t\t\t<td ng-bind="item.serviceFeeBrTot"></td>\r\n\t                    \t\t\t\t<td ng-bind="item.serviceFeeZcTot"></td>\r\n\t                    \t\t\t\t<td ng-bind="item.serviceFeeZjTot"></td>\r\n\t                    \t\t\t\t<td ng-bind="item.fundSharing"></td>\r\n\t                    \t\t\t\t<td ng-bind="item.repaidServiceFeeBr"></td>\r\n\t                    \t\t\t</tr>\r\n\t                    \t\t</table>\r\n\t                    \t</div>\r\n\t                    \t\r\n\t                    </div>\r\n\t                <div class="ft clearfix" ng-style="{visibility:showPage}">\r\n\t\t\t        </div>\r\n\t\t\t    </div>\r\n\t\t\t</div>\r\n\t    </div>\r\n\t\t<div class="inner-footer"></div>\r\n\t</div>\r\n</div>\r\n\t\r\n\t\t\r\n'}});