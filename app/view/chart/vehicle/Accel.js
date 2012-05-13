Ext.define('HatioBB.view.chart.vehicle.Accel', {
	extend : 'Ext.Panel',
	
	xtype : 'chart_v_accel',
	
	requires: [
	'Ext.chart.Chart',
    'Ext.chart.axis.Numeric',
    'Ext.chart.axis.Category',
	'Ext.chart.series.Line',
	],
		
	config : {
		title : T('title.chart_v_accel'),
		cls : 'grayBg',
		layout : 'fit'
	},

	constructor : function(config) {
		var self = this;
		
		this.callParent(arguments);	
		
		var chart = this.add(this.buildChart());
		
		Ext.getStore('IncidentLogStore').on('load', function(store, records, success) {
			chart.getStore().setData(records);
		});
	},

	buildChart : function() {
		var store = Ext.create('Ext.data.JsonStore', {
			fields : ['datetime', 'accelate_x', 'accelate_y', 'accelate_z' ]
		});
		
		return {
			xtype : 'chart',
			itemId : 'chart',
            animate: true,
			legend : {
				position: {
	                portrait: 'right',
	                landscape: 'bottom'
	            },
	            labelFont: '20px Arial',
				itemSpacing:5,
				padding:0,
				boxStroke:"transparent",
				boxFill : "transparent"
			},
			store : store, //'IncidentLogStore',
			axes : [ {
				// title : T('title.acceleration'),
				title : 'Accel',
				type : 'Numeric',
				position : 'left',
				fields : [ 'accelate_x', 'accelate_y', 'accelate_z' ],
				minimum : -100,
				maximum : 100,
				minorTickSteps: 1,
				roundToDecimal: false,
				decimals : 0
			}, {
				title : T('label.time'),
				type : 'Category',
				position : 'bottom',
				fields : [ 'datetime' ],
				dateFormat : 'M d g:i:s',
				step : [Ext.Date.SECOND, 1]
			} ],
			series : [ {
				type : 'line',
	            highlight: {
	                size: 7,
	                radius: 7
	            },
	            fill: true,
	            smooth: true,
	            axis: 'left',
	            title: 'Accelate X',

				xField : 'datetime',
				yField : 'accelate_x'
			}, {
				type : 'line',
	            highlight: {
	                size: 7,
	                radius: 7
	            },
	            fill: true,
	            smooth: true,
	            axis: 'left',
	            title: 'Accelate Y',

				xField : 'datetime',
				yField : 'accelate_y'
			}, {
				type : 'line',
	            highlight: {
	                size: 7,
	                radius: 7
	            },
	            fill: true,
	            smooth: true,
	            axis: 'left',
	            title: 'Accelate Z',

				xField : 'datetime',
				yField : 'accelate_z'
			} ]
		}
	}

});
