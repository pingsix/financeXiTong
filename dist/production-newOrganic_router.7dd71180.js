webpackJsonp([18],{171:function(module,exports,__webpack_require__){"use strict";function controller($scope,service,$state,$stateParams){function render(data){switch($scope.renderAgent){case"upDate":$scope.upBtnFlag=!0,$scope.production=addProInfo(data,getEditBaseData);break;case"viewDetail":$scope.isView=!0,$scope.production=addProInfo(data,getEditBaseData)}}function addProInfo(getData,baseSelect){return baseSelect(function(data){$scope.base=data,console.log($scope.base),getData.partnerType&&Array.isArray(data.partnerTypeList)&&data.partnerTypeList.forEach(function(v){v.id===getData.partnerType&&(getData.partnerTypeName=v.typeName)}),getData.guarantee&&Array.isArray(data.guaranteeList)&&data.guaranteeList.forEach(function(v){v.repayId===getData.partnerType&&(getData.guaranteeName=v.value)}),getData.partnerAdmin&&Array.isArray(data.groups)&&data.groups.forEach(function(v){v.groupId===getData.partnerAdmin&&(getData.partnerAdminName=v.groupName)})}),getData}var stateparam,ctrlCount=0;$scope.base={},$scope.triggerPwd=!1,$scope.production={partner_code:"",groupId:"",repayId:""};try{$state.params&&$state.params.object&&"string"==typeof $state.params.object&&(stateparam=JSON.parse(decodeURI($state.params.object)))}catch(e){}$scope.showValid=!1;var getBaseData=function(fn){service.getBaseData().then(function(data){$scope.productionBaseData=data,!fn||"viewDetail"!==$scope.renderAgent&&"upDate"!==$scope.renderAgent?$scope.base=BaseDataTranslater.m2vm(data):fn(BaseDataTranslater.m2vm(data))})},getEditBaseData=function(fn){service.getEditBaseData().then(function(data){console.log("edit.do:",data),$scope.productionBaseData=data,!fn||"viewDetail"!==$scope.renderAgent&&"upDate"!==$scope.renderAgent?$scope.base=BaseDataTranslater.m2vm(data):fn(BaseDataTranslater.m2vm(data))})};$scope.timeFlag=function(timFlag){$scope.timFlag="","EFFECT"==timFlag?$scope.timFlag="EFFECT":"CLOSE"==timFlag&&($scope.timFlag="CLOSE")},$scope.save=function(isValid,isPristine){if(!isValid)return $scope.showValid=!0,void(document.body.scrollTop=0);if($scope.production.partner_code||($scope.production.partnerCode=$scope.productionBaseData.partner_code),stateparam&&stateparam.upDate){if(!isPristine&&confirm("您已对当前产品进行编辑，保存则生成新版本，是否继续？")){console.log("$scope.production保存",$scope.production),$scope.production.privatePfx&&delete $scope.production.privatePfx,$scope.production.publicCer&&delete $scope.production.publicCer;for(var i=0,groups=$scope.base.groups;i<groups.length;i++)groups[i].groupId==$scope.production.partnerAdmin&&($scope.production.partnerAdminName=groups[i].groupName);service.upDatePro($scope.production).then(function(data){location.href="#/configuration/production"})}}else console.log($scope.base.groups),service.update($scope.production).then(function(data){location.href="#/configuration/production"},function(reason){alert(reason.responseMsg)})},$scope.creatCertificate=function(){if($scope.production.partnerName){var cfg={partnerName:$scope.production.partnerName};ctrlCount||(ctrlCount+=1,service.creatCertificate(cfg).then(function(data){$scope.production.certName=data.public_cer,$scope.production.pfxName=data.private_pfx},function(reason){alert(reason.responseMsg)}))}},$scope.back=function(e){history.back()};var init=function(){$scope.renderAgent="";var cfg={};cfg={id:$stateParams.id,productionCode:$stateParams.productionCode,version:$stateParams.version};for(var screen in cfg)0!==cfg[screen]&&(""!==cfg[screen]&&void 0!==cfg[screen]||delete cfg[screen]);if(stateparam||getBaseData(),stateparam&&stateparam.upDate){$scope.renderAgent="upDate";var param={id:stateparam.id,pageNo:1,pageSize:10};service.get(param).then(function(data){data&&data.page&&data.page.result&&render(data.page.result[0])},function(reason){alert(reason.responseMsg)})}if(stateparam&&stateparam.isView){$scope.renderAgent="viewDetail";var param={id:stateparam.id,pageNo:1,pageSize:10};service.get(param).then(function(data){data&&data.page&&data.page.result&&render(data.page.result[0])},function(reason){alert(reason.responseMsg)})}};init()}Object.defineProperty(exports,"__esModule",{value:!0});"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj};__webpack_require__(172);var unshiftOption=function(array,option){return Array.isArray(array)||(array=[]),array.unshift(option),array},BaseDataTranslater={m2vm:function(data){var guaranteeList=[{repayId:"0",value:"无"},{repayId:"1",value:"有"}],guaranteeLists=[{repayId:"0",value:"等额本息"},{repayId:"1",value:"等本等息"}];return{guaranteeList:unshiftOption(guaranteeList,{value:"请选择"}),guaranteeLists:unshiftOption(guaranteeLists,{value:"请选择"}),partnerTypeList:unshiftOption([{id:"0",typeName:"Ⅱ类机构（资金方）"},{id:"1",typeName:"Ⅲ类机构（资金资产方）"}],{typeName:"请选择"}),groups:unshiftOption(data.groups,{groupName:"请选择"})}}},dependArr=[__webpack_require__(174).default.name];exports.default={module:angular.module("newOrganicCtrl",dependArr).controller("newOrganicController",["$scope","newOrganicService","$state","$stateParams",controller]),template:__webpack_require__(175)}},172:function(module,exports,__webpack_require__){var content=__webpack_require__(173);"string"==typeof content&&(content=[[module.id,content,""]]);var update=__webpack_require__(16)(content,{});content.locals&&(module.exports=content.locals),content.locals||module.hot.accept(173,function(){var newContent=__webpack_require__(173);"string"==typeof newContent&&(newContent=[[module.id,newContent,""]]),update(newContent)}),module.hot.dispose(function(){update()})},173:function(module,exports,__webpack_require__){exports=module.exports=__webpack_require__(11)(),exports.push([module.id,".ml54{margin-left:54px}.editform .content{background-color:#fff;padding-top:40px;border:1px solid #efefef}.editform .title{font-size:14px;font-weight:700;color:#323236;margin-bottom:12px;padding:24px 0 0 10px}.editform input{width:214px;height:28px;border:1px solid #c6c6c6;color:#424242;font-size:12px;font-family:microsoft yahei;padding-left:4px}.editform input[type=checkbox]{width:18px}.editform select{width:219px;height:30px;border:1px solid #c6c6c6;font-family:microsoft yahei;font-size:12px;color:#424242}.editform .short_input{width:97px}textarea{border:1px solid #c6c6c6;font-size:13px;color:#424242;font-family:microsoft yahei;overflow-y:scroll;resize:none;margin-left:5px;padding-left:4px;padding-top:3px}.editform .content .number{display:inline;font-size:12px;color:#424242;margin-right:0}.editform .formaction{margin:50px 0 60px;text-align:center}.editform .formaction button{border:none;border-radius:5px;display:inline-block;font-family:microsoft yahei;font-size:14px;color:#fff;padding:10px 37px;cursor:pointer}.back{background-color:#727272}.back:hover{background-color:#8a8383}.save{background-color:#d8524a}.save:hover{background-color:#f57b73}.editform .content p label{margin-right:10px}.editform .content .yanzheng{width:70px;font-size:13px;color:#a7a7a7;border:1px solid #ebebeb;border-radius:2px;text-align:center;margin-left:5px;cursor:pointer}.editform .content .yanzheng:hover{border:1px solid #d6d6d6}.editform .content .red-border{border:1px solid red}.editform table{width:90%;border:1px solid #fff;border-collapse:collapse;margin:0 auto}.editform table caption{font-size:18px;line-height:17px;padding:8px 0;margin:15px 0 0;font-weight:700}.editform table th{background:#f6f6f6;font-size:13px;line-height:17px;padding:8px 0}.editform table td{text-align:center;padding:5px;font:13px/20px microsoft yahei}.editform .oddEvenColor tr:nth-child(odd){background:#fafafa}.editform .oddEvenColor tr:nth-child(even){background:#fff}.editform .oddEvenColor tr:hover{background:#dee9f9}.editform .content .normalRadio{width:auto;height:auto}.col-list{display:flex}.col-list .col-item{flex:1}.query-item{padding-top:12px}.query-item .query-name{width:30%;display:inline-block;text-align:right;padding:0 3px 0 0;vertical-align:top;line-height:28px}.query-item i.warning{padding-right:3px;color:#ed948e}.query-item .query-value{width:68%;display:inline-block}.editform .form-invalid-msg{color:#ed948e;line-height:120%;padding:5px 0}.content .query-value{text-align:left;width:auto}.content .form-invalid-msg{margin:0;padding:10px 0}",""])},174:function(module,exports){"use strict";function service(util,ajax){return{getBaseData:function(){return ajax.post("/acc/accountpartner/new.do")},getEditBaseData:function(){return ajax.post("/acc/accountpartner/edit.do")},update:function(param){return ajax.post("/acc/accountpartner/saveProductionPartner.do",param)},upDatePro:function(param){return ajax.post("/acc/accountpartner/updateProductionPartner.do",param)},get:function(param){return ajax.post("/acc/accountpartner/getList.do",param)},creatCertificate:function(cfg){return ajax.post("/acc/accountpartner/buildCerPfxName.do",cfg)}}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=angular.module("newOrganicSer",[]).factory("newOrganicService",["util","ajax",service])},175:function(module,exports){module.exports='<div class="main">\r\n\t<div class="inner">\r\n\t    <div class="content_wrap editform">\r\n\t        <div class="title">新增资金方</div>\r\n\t        <div class="content">\r\n\t            <form name="mainform" novalidate>\r\n\t                <ul class="query-list">\r\n\t                    <li class="query-item col-list">\r\n\t                        <!-- <div class="col-item">\r\n\t                            <span class="query-name"><i class="warning">*</i>资金方:</span>\r\n\t                            <span class="query-value">\r\n\t                                <select ng-if = "!(isView || upBtnFlag)" name="partnerType" ng-model="production.partnerType" ng-class = "{readOnly : isView}" ng-readonly = "isView" ng-options="option.id as option.typeName for option in base.partnerTypeList" required></select>\r\n\t                                <input ng-if = "isView || upBtnFlag" type="text"  ng-model="production.partnerTypeName" ng-class = "{readOnly : isView || upBtnFlag}" ng-readonly = "isView||upBtnFlag"/>\r\n\t                                <p ng-show="(showValid || mainform.partnerType.$dirty) && mainform.partnerType.$error.required" class="form-invalid-msg">请选择此项</p>\r\n\t                            </span>\r\n\t                        </div> -->\r\n\t                        <div class="col-item">\r\n\t                            <span class="query-name"><i class="warning">*</i>机构名称:</span>\r\n\t                            <span class="query-value">\r\n\t                                <input type="text" name="partnerName" ng-model="production.partnerName" ng-blur = "creatCertificate()" ng-class = "{readOnly : upBtnFlag||isView}" ng-readonly = "upBtnFlag||isView" required maxlength="20" ng-pattern = "/^[\\u4e00-\\u9fa5\\][\\w]{0,}$/"/>\r\n\t                                <p ng-show="(showValid || mainform.partnerName.$dirty) && mainform.partnerName.$error.required" class="form-invalid-msg">请填写此项</p>\r\n\t                                <p ng-show="(showValid || mainform.partnerName.$dirty) && !mainform.partnerName.$error.required && mainform.partnerName.$error.pattern" class="form-invalid-msg">仅能由汉字、字母、数字和下划线组成</p>\r\n\t                            </span>\r\n\t                        </div>\r\n\t                        <div class="col-item">\r\n\t                            <span class="query-name"><i class="warning">*</i>保证金数额:</span>\r\n\t                            <span class="query-value">\r\n\t                                <input name="fineMoney" type="text" ng-model="production.fineMoney" maxlength="50" ng-class = "{readOnly : isView}" ng-readonly = "isView" required ng-pattern = \'/\\d/\'/>\r\n\t                                <p ng-show="(showValid || mainform.fineMoney.$dirty) && mainform.fineMoney.$error.required" class="form-invalid-msg">请填写此项</p>\r\n\t                                <p ng-show="(showValid || mainform.fineMoney.$dirty) && !mainform.fineMoney.$error.required && mainform.fineMoney.$error.pattern" class="form-invalid-msg">仅能填写数字</p>\r\n\t                            </span>\r\n\t                        </div>\r\n\t                    </li>\r\n\t                    <li class="query-item col-list">\r\n\t                    \t <div class="col-item">\r\n\t                            <span class="query-name"><i class="warning">*</i>资金成本:</span>\r\n\t                            <span class="query-value">\r\n\t                                <input type="text" name="partnerName" ng-model="production.partnerName" ng-blur = "creatCertificate()" ng-class = "{readOnly : upBtnFlag||isView}" ng-readonly = "upBtnFlag||isView" required maxlength="20" ng-pattern = "/^[\\u4e00-\\u9fa5\\][\\w]{0,}$/"/>\r\n\t                                <p ng-show="(showValid || mainform.partnerName.$dirty) && mainform.partnerName.$error.required" class="form-invalid-msg">请填写此项</p>\r\n\t                                <p ng-show="(showValid || mainform.partnerName.$dirty) && !mainform.partnerName.$error.required && mainform.partnerName.$error.pattern" class="form-invalid-msg">仅能由汉字、字母、数字和下划线组成</p>\r\n\t                            </span>\r\n\t                       </div>\r\n\t                       <div class="col-item">\r\n\t                            <span class="query-name"><i class="warning">*</i>计息方式:</span>\r\n\t                            <span class="query-value">\r\n\t                                <select ng-if = "!isView" name="partnerAdmin" ng-model="production.partnerAdmin" ng-class = "{readOnly : isView}" ng-readonly = "isView" ng-options="option.repayId as option.value for option in base.guaranteeLists"  required></select>\r\n\t                                <input ng-if = "isView" type="text"  ng-model="aproduction.partnerAdminName" ng-class = "{readOnly : isView}" ng-readonly = "isView"/>\r\n\t                                <p ng-show="(showValid || mainform.partnerAdmin.$dirty) && mainform.partnerAdmin.$error.required" class="form-invalid-msg">请选择此项</p>\r\n\t                            </span>\r\n\t                       </div>\r\n\t                    </li>\r\n\t                    <li class="query-item col-list">\r\n\t                        <div class="col-item">\r\n\t                            <span class="query-name"><i class="warning">*</i>机构管理员:</span>\r\n\t                            <span class="query-value">\r\n\t                                <select ng-if = "!isView" name="partnerAdmin" ng-model="production.partnerAdmin" ng-class = "{readOnly : isView}" ng-readonly = "isView" ng-options="option.groupId as option.groupName for option in base.groups" required></select>\r\n\t                                <input ng-if = "isView" type="text"  ng-model="production.partnerAdminName" ng-class = "{readOnly : isView}" ng-readonly = "isView"/>\r\n\t                                <p ng-show="(showValid || mainform.partnerAdmin.$dirty) && mainform.partnerAdmin.$error.required" class="form-invalid-msg">请选择此项</p>\r\n\t                            </span>\r\n\t                        </div>\r\n\t                        <div class="col-item">\r\n\t                            <span class="query-name"><i class="warning">*</i>apiCode:</span>\r\n\t                            <span class="query-value">\r\n\t                                <input name="apiCode" type="text" ng-model="production.apiCode" ng-class = "{readOnly : isView || upBtnFlag}" ng-readonly = "isView || upBtnFlag" required maxlength="20" ng-pattern = "/^[0-9]*$/"/>\r\n\t                                <p ng-show="(showValid || mainform.apiCode.$dirty) && mainform.apiCode.$error.required" class="form-invalid-msg">请填写此项</p>\r\n\t                                <p ng-show="(showValid || mainform.apiCode.$dirty) && !mainform.apiCode.$error.required && mainform.apiCode.$error.pattern" class="form-invalid-msg">仅能输入正整数</p>\r\n\t                            </span>\r\n\t                        </div>\r\n\t                    </li>\r\n\t                    <li class="query-item col-list">\r\n\t                        \r\n\t                        \r\n\t                        <div class="col-item">\r\n\t                        \t<span class="query-name"><i class="warning"  ng-if = "production.nature == \'内部\' ? \'\' : \'1\'">*</i>公有证书名称:</span>\r\n\t                            <span class="query-value">\r\n\t                                <input ng-if = "production.nature == \'内部\' ? \'\' : \'1\'" name="certName" type="text" ng-model="production.certName" placeholder="(自动生成)" ng-class = "{readOnly : true}" readonly = "readonly"  maxlength="150"/>\r\n\t                            </span>\r\n\t                        </div>\r\n\t                        <div class="col-item">\r\n\t                            <span class="query-name"><i class="warning">*</i>有无担保:</span>\r\n\t                            <span class="query-value">\r\n\t                                <select ng-if = "!isView" name="guarantee" ng-model="production.guarantee" ng-class = "{readOnly : isView}" ng-readonly = "isView" ng-options="option.repayId as option.value for option in base.guaranteeList" required></select>\r\n\t                                <input ng-if = "isView" type="text"  ng-model="production.guaranteeName" ng-class = "{readOnly : isView}" ng-readonly = "isView"/>\r\n\t                                <p ng-show="(showValid || mainform.guarantee.$dirty) && mainform.guarantee.$error.required" class="form-invalid-msg">请选择此项</p>\r\n\t                            </span>\r\n\t                        </div>\r\n\t                    </li>\r\n\r\n\t                    <li class="query-item col-list">\r\n\t                        <div class="col-item">\r\n\t                        \t<span class="query-name"><i class="warning"  ng-if = "production.nature == \'内部\' ? \'\' : \'1\'">*</i>私有证书名称:</span>\r\n\t                            <span class="query-value">\r\n\t                                <input ng-if = "production.nature == \'内部\' ? \'\' : \'1\'" ng-class = "{readOnly : true}" readonly = "readonly" placeholder="(自动生成)" name="pfxName" type="text" ng-model="production.pfxName" maxlength="50"/>\r\n\t                            </span>\r\n\t                        </div>\r\n\t                        <div class="col-item"></div>\r\n\t                    </li>\r\n\t                    \r\n\t                </ul>\r\n\t                <p class="formaction">\r\n\t                    <button ng-if="!production.id || production.status == 0 || upBtnFlag" class="back" ng-class = "{save : (upBtnFlag&&!mainform.$pristine) || (!upBtnFlag&&!isView)}" ng-click="save(mainform.$valid,mainform.$pristine)">保 存</button>\r\n\t                    <button class="save ml54" ng-click="back()">返 回</button>\r\n\t                </p>\r\n\t            </form>\r\n\t        </div>\r\n\t        <div class="inner-footer"></div>\r\n\t    </div>\r\n\t</div>\r\n</div>\r\n'}});