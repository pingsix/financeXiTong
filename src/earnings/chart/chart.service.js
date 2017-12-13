import $ from 'jquery';

import amcharts from '../../tools/plugins/AmChart/js/amcharts';
import serial from '../../tools/plugins/AmChart/js/serial';
import pie from '../../tools/plugins/AmChart/js/pie';

export default angular
	.module('chartSer',[])
	.factory('chartService',['util','ajax',service])

function service(util,ajax){
	return {
		setSelectedLi : function(current){
            var parent = util.parent(current,'ul');
                angular.element(parent).find('li').removeClass('selected');
                angular.element(current).parent().addClass('selected');
        },
        getDate : function(val,fn){
            fn && fn(val);
        },
        upService : function(){
        	return ajax.post();
        },
        downLoadFile : function(){
        	return ajax.post();
        },
        freezeCtrl : function(){
        	return ajax.post();
        },
        getLoanMenInfoList : function(cfg){
        	return ajax.post("/acc/accountpartner/getList.do",cfg);
        },
        rendChart : function(){
        	return {
        		serial : function(data){
        			  var chart = new AmCharts.AmSerialChart();
				      chart.dataProvider = data;
				      //json数据的key  
				      chart.categoryField = "name";
				      //不选择      
				      chart.rotate = false;
				      //值越大柱状图面积越大  
				      chart.depth3D = 20;
				      //柱子旋转角度角度
				      chart.angle = 30;
				      var mCtCategoryAxis = chart.categoryAxis;
				      mCtCategoryAxis.axisColor = "#efefef";
				      //背景颜色透明度
				      mCtCategoryAxis.fillAlpha = 0.5;
				      //背景边框线透明度
				      mCtCategoryAxis.gridAlpha = 0;
				      mCtCategoryAxis.fillColor = "#efefef";
				      var valueAxis = new AmCharts.ValueAxis();
				      //左边刻度线颜色  
				      valueAxis.axisColor = "#ccc";
				      //标题
				      valueAxis.title = "";
				      //刻度线透明度
				      valueAxis.gridAlpha = 0.2;
				      chart.addValueAxis(valueAxis);
				      var graph = new AmCharts.AmGraph();
				      graph.title = "value";
				      graph.valueField = "value";
				      graph.type = "column";
				      //鼠标移入提示信息
				      graph.balloonText = "测试数据[[category]] [[value]]";
				      //边框透明度
				      graph.lineAlpha = 0.3;
				      //填充颜色 
				      graph.fillColors = "#b9121b";
				      graph.fillAlphas = 1;
				
				      chart.addGraph(graph);
				
				      // CURSOR  --pointLight behivor is so cool, but had a mouseIsOver problem
//				      var chartCursor = new AmCharts.ChartCursor();
//				      chartCursor.cursorAlpha = 0;
//				      chartCursor.zoomable = true;
//				      chartCursor.categoryBalloonEnabled = true;
//				      chart.addChartCursor(chartCursor);
				
				      chart.creditsPosition = "top-right";
				
				      //显示在Main div中
				      chart.write("cylindrical");
        		},
        		pie : function(data){
        			var chartData = eval(data);
				        //饼状图
				    var chart = new AmCharts.AmPieChart();
				        chart.dataProvider = chartData;
				        //标题数据
				        chart.titleField = "name";
				        //值数据
				        chart.valueField = "value";
				        //边框线颜色
				        chart.outlineColor = "#fff";
				        //边框线的透明度
				        chart.outlineAlpha = .8;
				        //边框线的狂宽度
				        chart.outlineThickness = 1;
				        chart.depth3D = 20;
				        chart.angle = 30;
				        chart.write("pie");
				    }
        	}
        }
	}
}