import $ from 'jquery';
var dependArr = [
	require('./viewDetail.service').default.name
]
export default {
	module : angular.module('viewDetailCtrl',dependArr).controller('viewDetailController',['$scope','viewDetailService','$timeout','$state','util','$compile',controller]),
	template : require('./viewDetail.template.html')
}

function controller(_,service,$timeout,$state,util,$compile){
		'use strict';
		var o,cfg = {},timer;
//		var stateParam = JSON.parse(decodeURI($state.params.object));
		var cliceParam = location.href.slice(location.href.lastIndexOf('/')+1);
		var stateParam = JSON.parse(decodeURI(cliceParam));
		
		_.flager = !!localStorage.getItem('modifyAuthFlag') ? JSON.parse(localStorage.getItem('modifyAuthFlag')) : false;
//		_.flager = true;
        //params
        _.pageNo = 1;            //页数
        _.pageSize = 10;          //每页多少个
        _.count = '';
        
        _.swifts = [];    //流水数据
        _.loanMenInfo = [];
        _.productionNames = '';           //产品名称
        _.updateTimeStart = '';  		 //数据更新时间
        _.updateTimeEnd = '';            //数据更新时间
        _.creatProList = false;    //产品列表标示
        _.productionDataId = '';
        _.periodsRecord = [];
        
        _.selectOption = {
            "type" : "select",
            "name" : "Service",
            "value" : "10条",
            "values" : ["10条","20条","30条","40条","50条"]
        };
		
		var _nameList = [
	            {name: '百融前',key:'brBefore'},
	            {name: '百融后',key:'brAfter'},
	            {name: '资金方前',key:'zjBefore'},
	            {name: '资金方后',key:'zjAfter'},
	            {name: '资产方前',key:'zcBefore'},
	            {name: '资产方后',key:'zcAfter'},
	        ]
		
		var periodsInfo = [
			{name: '资金方',key:'billPeriods'},
			{name: '百融',key:'billPeriodsForBr'},
			{name: '资产方',key:'billPeriodsForZc'}
		]
		
		_.belongStateList = [
			{id:'' ,value:'请选择'},
			{id:'正常' ,value:'正常'},
			{id:'代偿' ,value:'代偿'},
			{id:'一次性还清' ,value:'一次性还清'},
			{id:'逾期' ,value:'逾期'},
			{id:'取消借款' ,value:'取消借款'},
		]
		
		function timeDateFilter(time,toTime){
			if(time && typeof time === 'number'){
				return toTime ? (new Date(time)).toLocaleString('chinese',{hour12:false}) : (new Date(time)).toLocaleDateString();
        	}
		}
		
		function fixedName(key){
			for(let i=0;i<periodsInfo.length;i++){
				if(key == periodsInfo[i].key) return periodsInfo[i];
			}
		}
		
		function setPeriodsDefaultValue(obj){
			if(!obj.status) obj.status = '正常';
		}
		
		/*显示-账单明细编辑信息*/
		_.editItemForm = function(index){
			_.itemFormParam = {remark:''};
			var handleEditList = [],
				billPeriodsData  = JSON.parse(JSON.stringify(_.billPeriodsData));
			for(let key in billPeriodsData){
				for(let i = 0,list = billPeriodsData[key]; i < list.length; i++){
					//select 设置默认值
//					setPeriodsDefaultValue(list[i]);
					if(typeof list[i]['billPeriods'] !== 'undefined'&& list[i]['billPeriods'] == index){
						for(let k in list[i]){
							if(/time|date|line/gi.test(k)){
								if(!!list[i][k] && typeof list[i][k].time !== 'undefined'){
									if(list[i][k].time === 0){
										list[i][k] = 0;
									}else{
										if(k === 'fineDate' || k === 'fineRepaidDate'){
											list[i][k] = timeDateFilter(list[i][k].time,true);
										}else{
											list[i][k] = timeDateFilter(list[i][k].time);
										}
									}
									
								}
							}
						}
						handleEditList.push({
							nameData : fixedName(key),
							data : list[i]
						})
						continue;
					}
				}
			}
			_.editList = rmNoUserVal(handleEditList);
			_.rawItemFormValue = JSON.stringify(_.editList);
			//找到指令自动创建的方法并调用返回Promise对象，并自动弹出遮罩；
			_['cloakCallback'+index]().then(saveItemForm);
		}
		setTimeout(function(){
			console.log(118,_)
		},2000)
		//校验提交-账单明细（此提交在指令里执行并返回错误信息）
		_.validateSubmit = function(err){
			if(err){
				switch(err.errorKey){
					case 'tiemError':
						return alert('输入时间格式有误，请检查！');
					case 'raw':
						return alert('保存值，未修改！');
					case 'remark':
						return alert('请填写备注！');
					default:
				}
				
			}
//			console.log(117,_.rawItemFormValue)
//			console.log(118,JSON.stringify(rmNoUserVal(_.editList)))
			return {
				tiemError:allTimeValidate(),
				raw : isRawHandle(_.rawItemFormValue,JSON.stringify(rmNoUserVal(_.editList))),
				remark : !_.itemFormParam.remark
			}
		}
		
		/*提交-各期明细账单信息*/
		function saveItemForm(bool){
			if(!bool) return;
			var editListStr = JSON.stringify(rmNoUserVal(_.editList));
			var editList = formatTime(JSON.parse(editListStr));
			editList.forEach(function(item){
				_.itemFormParam[item.nameData.key] = item.data;
			})
			service.editPeriodsInfo({jsonData:JSON.stringify(_.itemFormParam)}).then(function(data){
				if(data&&bool){
					alert(data.responseMsg);
					o.getUserInfoList();
				}
			})
		}
		
		function validateTime(time){
			if(time.indexOf(' ')) time = time.split(' ')[0];
			var tmpArr = time.split('/');
			var errFlag = tmpArr.every(function(num){
					return typeof  parseInt(num)  === 'number'&&!Number.isNaN( parseInt(num));
				});
			return time.indexOf('/') === -1 || tmpArr.length < 3 || !tmpArr[tmpArr.length - 1] || !errFlag;
		}
		
		/*校验-各期明细账单信息*/
		_.validateItemTime = function(evt,originObj,key){
			var elem = evt.target,
				elem2Style = elem.parentNode.style;
			if(!!elem.value){
				if(validateTime(elem.value)){
					_.tiemError = true;
					elem2Style.borderColor = '#f00';
				}else{
					elem2Style.borderColor = '#d2d2d2';
				}
			}else{
				if(key === 'fineDate' || key === 'fineRepaidDate'){
					originObj[key] = '1/1/3';
				}else{
					originObj[key] = '1/1/3';
				}
				elem2Style.borderColor = '#d2d2d2';
			}
		}
		
		_.handlePeriodsInp = function(num,originObj,key){
			if(!num) originObj[key] = 0;
		}
		
		function isRawHandle(val1,val2){
			return val1 == val2;
		}
		
		function allTimeValidate(){
			var eList = [];
			for(let i = 0 ; i < _.editList.length; i++){
				let data = _.editList[i].data;
				var e = Object.keys(data).some(function(key){
					if(/time|date|line/gi.test(key) && !!data[key]&&key !== 'createTime' && key !== 'updateTime' ){
						return validateTime(data[key]) ? true : false;
					}else{
						return false;
					} 
				})
				if(e) eList.push(e);
			}
			return eList.some(function(item){
				return item;
			})
		}
		
		//移除angular加入的属性
		function rmNoUserVal(data){
			function del(obj,key){
				for(let i in obj){
					if(i == key) delete obj[key];
				}
			}
			data.forEach(function(item){
				del(item,'$$hashKey');
				del(item.nameData,'$$hashKey');
				del(item.data,'$$hashKey');
			})
			return data;
		}
		
		/*保存时间格式化*/
		function formatTime(data){
			for(let i = 0; i < data.length ; i++){
				var data2 = data[i].data;
				for(let k in data2){
					var value = data2[k];
					if(/time|date|line/gi.test(k)){
						if(!!value){
							if(k === 'fineDate' || k === 'fineRepaidDate'){
								if(!!value.time) value = timeDateFilter(value.time,true);
								if(value.indexOf(':') === -1) value += ' 00:00:00';
							}
							if(typeof value !== 'string'){
								if(!!value.time) value = timeDateFilter(value.time);
							}
							if(value.indexOf('/') !== -1){
								data2[k] = value.replace(/\//g,'-');
							}
						}
					}
               }
			}
			console.log(233,data)
			return data;
		}
		
		
		//展示明细账单修改记录
		_.showModifyRecord = function(index){
			for(let i =0; i<_.periodsRecordArr.length; i++){
				if(_.periodsRecordArr[i].id == index){
					var data = _.periodsRecordArr[i].data;
					middleHandleTime(data);
				    _.periodsRecordDetail = {
				    	data : comparePeriodsVal(data),
				    	remark : _.periodsRecordArr[i]['remark']
				    }
				}
			}
			//弹出展示
			_.modifyRecordForm(true,true);
		}
		
		function middleHandleTime(data){
			var dataPool = [];
			for(let key in data){
				dataPool.push(data[key])
			}
			formatTime(dataPool);
		}
		
		//处理-明细账单修改过的值和原始值
		function comparePeriodsVal(periodData){
			let _data = JSON.parse(JSON.stringify(periodData))
			let tmpArr1 = [];
			for(let prop in _data){
				var value = _data[prop];
				tmpArr1.push([]);
				switch(prop.slice(0,2)){
					case 'br' :
						tmpArr1[0].push(_data[prop]);
						break;
					case 'zj' :
						tmpArr1[1].push(_data[prop]);
						break;
					case 'zc' :
						tmpArr1[2].push(_data[prop]);
						   break;
					default:
				}	
			}
			tmpArr1 = tmpArr1.filter(function(arr){
				if(arr.length > 0) return arr;
			})
			tmpArr1.forEach(function(arr){
				signChanegeVal(arr[0].data,arr[1].data);
			})
			function signChanegeVal(obj,obj2){
				for(let prop in obj){
					if(obj[prop] !== obj2[prop]){
						obj[prop] = {
							sign : true,
							val  : obj[prop]
						}
						obj2[prop] = {
							sign : true,
							val  : obj2[prop]
						}
					}else{
						obj[prop] = {
							sign : false,
							val  : obj[prop]
						}
						obj2[prop] = {
							sign : false,
							val  : obj2[prop]
						}
					}
				}
			}
			return _data;
		}
		
		
		/**
		 * 高度设置
		 */
		function resetDetailInfoHeight(num){
			var childSize = $(".detailInfo").eq(num).children().eq(0).children().size();
			$("#detailInfo").height(childSize * 32 +55);
			$(".innerAuto").eq(num).height(childSize * 32 + 17);
		}
		resetDetailInfoHeight(0);
		//计算容器宽度
		_.countDetaiInfoWrap = function(index){
			var count = 0;
			switch(index){
				case 0:
				case 2:
					count = _.billPeriodsData.billPeriods.length;
					break;
				case 1:
					count = _.billPeriodsData.billPeriodsForBr.length;
					break;
			}
			var detailWarpWidth = 340 * count;
			$(".innerWrapper").width(detailWarpWidth);
		}
		
		
		/**
		 * 查看当前用户是否有查看逾期用户信息权限（催收主管角色具有该权限）
		 */
		!function(){
			var jurisdictionList = [],
				menuList = [],
				jurisdictionList = util.ejson(localStorage.getItem('menu'));
				
			jurisdictionList.forEach(function(index){
				if(index.text === '账务信息' && index.children){
					menuList = index.children;
				}
			})
			menuList.forEach(function(index){
				if(index.text === '逾期用户信息' && stateParam.name === 'overdue'){
					_.receivableRole = !_.receivableRole;
				}
			})
		}()
		
		_.handleNum = function(num){
			if(num == '0' || num == '-0'){
				return 0;
			}else{
				return num.toFixed(2);
			}
		}
		
		var detailNavList = $('.navigation').children(),
			detailContentList = $('.detail_plan');
		detailNavList.eq(0).addClass('nav-select');
		detailContentList.eq(0).addClass('content-select')
		detailNavList.off('click').on('click',function(){
			$(this).addClass('nav-select').siblings().removeClass('nav-select');
			detailContentList.eq($(this).index()).addClass('content-select').siblings().removeClass('content-select');
			resetDetailInfoHeight($(this).index());
			_.countDetaiInfoWrap($(this).index());
		})
		
		
		_.deductRecord = function(item){
			if(!item.withholdDetail) return;
//			if(item.withholdStatus !== 'success') return;
			_.isShowReportDialog5 = true;
			_.alerShow = !_.alerShow;
			_.inputFlag = false;
			_.isDeductRecord = false;
			_.subInfo = '代扣金额记录';
			var withholdDetail = JSON.parse(item.withholdDetail);
			//显示代扣详情
//			return
			if(withholdDetail.detail){
				_.billPeriods3 = JSON.parse(withholdDetail.detail);
			}
		}
		_.closeDialog = function(){
			_.isShowReportDialog5 = false;
			_.alerShow = !_.alerShow;
			clearList();
		}
		
		_.overReceivable = function(){
			_.isShowReportDialog5 = true;
			_.alerShow = !_.alerShow;
			_.inputFlag = true;
			_.isDeductRecord = true;
			_.subInfo = '是否结束催收，若结束请填写结束详情';
			_.overReceivableFlag = true;
		}
		
		_.emitInform = function(){
//			var currentStatus = service.checkStatus();
//			if(currentStatus.status){
//				alert(currentStatus.msg);
//				return;
//			}
//			return;
			_.isShowReportDialog5 = true;
			_.alerShow = !_.alerShow;
			_.inputFlag = false;
			_.isDeductRecord = true;
			_.overReceivableFlag = false;
			_.subInfo = '是否发出代扣通知，请确认代扣金额';
			o.getUserInfoList();
		}
		
		_.checkInputMoney =  function(text){
			_.checkMoneyFlag = false;
			countMoney(text)
			if(!text){
				_.errorText = '';
				_.isError = false;
				return;
			};
			if(!/^\d+(\.\d+)?$/.test(text)){
				_.errorText = '金额必须为数字，请重新填写！';
				_.isError = true;
				_.checkMoneyFlag = true;
				return;
			}
			if((text > _.detailData.presentDueSum) ||  text <= 0){
				_.errorText = ('填写金额必须小于等于当前应偿未偿总金额且大于0！');
				_.isError = true;
				_.checkMoneyFlag = true;
				return;
			}
			_.errorText = '';
			_.isError = false;
			_.checkMoneyFlag = false;
		}
		
		/**
		 * 计算所还的金额 
		 */
		function countMoney(text){
			if(text == undefined || !/^\d+(\.\d+)?$/.test(text)) text = 0;
//			var inputMoney = text;
			var bill2 = JSON.parse(_.billPeriods2);
			for(var i = 0; i < bill2.length; i ++){
				var item = JSON.parse(bill2[i]);
				for(var k in item){
					if(item.hasOwnProperty(k)){
						if(typeof item[k] !== 'number') continue;
						if(text > 0){
							text -=  item[k];
							if(text >= 0){
								_.billPeriods3[i][k] = item[k];
							}else{
								_.billPeriods3[i][k] = item[k] + parseInt(text);
							}
						}
						else{
							_.billPeriods3[i][k] = 0;
						}
					}
				}
			}
//			console.log(_.billPeriods3)
		}
		
		
		/**
		 * 提交 结束催收/发出代扣通知
		 */
		_.submit = function(){
			if(_.overReceivableFlag){
				if(!_.subArea){
					alert('结束详情未填写!');
					return;
				}
				var cfg = {
					requestId : _.detailData.requestId,
					collEndDetail : _.subArea
				};
				service.emitInfo(cfg).then(function(data){
					alert(data.responseMsg);
					location.href = '#/overdue';
				},
				function(reason){
					alert(reason.responseMsg);
				})
			}
			else{
				if(_.checkMoneyFlag) return;
				
				if(!_.subArea){
					alert('代扣金额未填写!');
					return;
				}
				else{
					if(!confirm('是否发出扣款金额指令？'))return;
				} 
//				console.log(_.billPeriods3)
				var withDtail = {
						requestId : _.detailData.requestId,
						TotalAmount :_.detailData.presentDueSum,
						detail : JSON.stringify(_.billPeriods3)
					}
				var cfg = {
					requestId : _.detailData.requestId,
					withholdAmount : _.subArea,
					withholdDetail : JSON.stringify(withDtail)
				};
//				console.log(192,cfg)
				service.overReceivableFlag(cfg).then(function(data){
					alert(data.responseMsg);
					o.getUserInfoList();
					location.href = '#/overdue';
				},
				function(reason){
					alert(reason.responseMsg)
				})
			}
			
			_.alerShow = !_.alerShow;
			_.subInfo = '';
			_.subArea = '';
			_.isShowReportDialog5 = false;
		}
		
		
		_.cancel = function(){
			_.subArea = '';
			_.alerShow = !_.alerShow;
			_.isShowReportDialog5 = false;
			
			_.errorText = '';
			_.isError = false;
			_.checkMoneyFlag = false;
		}
		
		/**
		 * 查看案件详情
		 * 
		 * @param{id}
		 * earnFileSearchFlag 是否为进件查询    是的设为false   不是设为true
		 * pageName指令被不同页面调用，选填   页面名字 做判断处理
		 * {requestId:detailData.requestId,id:detailData.productionDataId,tellId:detailData.id}
		 */
		_.checkDetail = function(checkDetail){
			_.showOperNav();
//			_.tellId = checkDetail.id;
//			requestId : checkDetail.requestId,
			_.operatePage({
				param   : {id : checkDetail.productionDataId},
				earnFileSearchFlag : false,
				pageName : 'viewDetail'
			})
		}
		
		_.viewRunning = function(item){
			var param = {
				requestId : item.requestId,
				swiftNumberId : item.swiftNumber,
				name :　stateParam.name === 'loanInfo' ? 0 : 1
			}
			$state.go('financial.viewRunning',{'object' : encodeURI(JSON.stringify(param))})
		}
		
		_.goBack = function(){
			location.href = "#/financial/loan";
        }
		
		//代扣计算清零
		function clearList(){
			for(var j = 0; j < _.billPeriods3.length ; j ++){
				if(typeof _.billPeriods3[j] === 'string'){
		            _.billPeriods3[j] = JSON.parse(_.billPeriods3[j]);
				}
				for(var i in _.billPeriods3[j]){
					if(typeof _.billPeriods3[j][i] === 'string') continue;
					_.billPeriods3[j][i] = 0;
				}
	        }
		}
		
        //获取列表
        o = {
            laterQueryList : function(){
                var that = this;
                if(timer){
                    clearTimeout(timer);
                }
                timer = setTimeout(function(){
                    that.getUserInfoList();
                },200);
            },
            getUserInfoList : function(config){
                service.getViewDetailData({requestId:stateParam.requestId}).then(function(data){
	                	_.detailData = data.essential;    				//基本信息
	                	_.billPeriodsData = {
	                		billPeriods : data.billPeriods,
	                		billPeriodsForBr : data.billPeriodsForBr,
	                		billPeriodsForZc : data.billPeriodsForZc
	                	}
	                	
	                	_.periodsModifyRecord = [{id:456}]
	                	
	                	_.swifts = data.swifts;							//流水详情
	                	_.collection = data.collection;					//代扣通知操作明细
	                	_.collectionOver = data.collectionOver;			//结束催收记录明细
	                	
	                	var billPeriods2 = [];
	                	for(var i = 0; i < data.billPeriods.length; i++){
	                		var newArr = {};
	                		//此处按数据类型分开，不参与展示的用保存成属性值；
	                		newArr['presentTotDue'] = data.billPeriods[i].presentTotDue + '';
	                		if(data.billPeriods[i].presentTotDue - data.billPeriods[i].repaidTotMoney === 0 ||
	                			(data.billPeriods[i].presentLateFee === 0 && data.billPeriods[i].presentInt === 0 )){
	                			continue;
	                		}else{
	                			newArr['billPeriods'] = data.billPeriods[i].billPeriods + '';
	                		}
	                		newArr['presentServiceFee'] = data.billPeriods[i].presentLateManFee;
	                		newArr['presentLateManFee'] = data.billPeriods[i].presentLateManFee;
	                		newArr['presentLateFee'] = data.billPeriods[i].presentLateFee;
	                		newArr['presentInt'] = data.billPeriods[i].presentInt;
	                		newArr['presentPri'] = data.billPeriods[i].presentPri;
	                		billPeriods2.push(JSON.stringify(newArr))
	                	}
	                	
	                	var billPeriods3;
	                	_.billPeriods2 = billPeriods3 = JSON.stringify(billPeriods2);
	                	_.billPeriods3 = JSON.parse(billPeriods3);
	                	clearList();
	                	
	                	_.countDetaiInfoWrap(0)  
	                		
	                	_.showScroll = _.swifts.length > 5 ?  true : false;
	                },function(reason){
	                	alert(reason.responseMsg)
//	                	location.href='../view/login.html';
	                }
	            );
	            
	            
	            service.editPeriodsRecord({requestId:stateParam.requestId}).then(function(data){
	            },function(reason){
	            	_.periodsRecord = reason;
	            	var _data = JSON.parse(JSON.stringify(reason));
	            	_.periodsRecordArr = []
	            	for(let i =0;i<_data.length;i++){
	            		let periodsData = {};
	            		for(let k in _data[i]){
	            			for(let u = 0; u < _nameList.length;u++){
	            				var item = _nameList[u]
	            				var reg = new RegExp(item.key,'gi')
	            				if(reg.test(k)){
	            					periodsData[item.key] = {
	            						nameData : item,
	            						data : _data[i][k] ? JSON.parse(_data[i][k]) : _data[i][k]
	            					}
	            				}
	            			}
	            		}
	            		_.periodsRecordArr.push({
	            			id : i + 1,
	            			data : periodsData,
	            			remark : _data[i].remark
	            		})
	            	}
	            })
            },
            init : function(){
                this.getUserInfoList();
            }
        }
        o.init();
}
