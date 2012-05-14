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

		this.loadHandler = function(store, records, success) {
			chart.getStore().setData(records);
		};
		
		Ext.getStore('IncidentLogStore').on('load', this.loadHandler);
	},

	destroy : function() {
		Ext.getStore('IncidentLogStore').un('load', this.loadHandler);
		
		this.callParent(arguments);
	},
	
	buildChart : function() {
		var store = Ext.create('Ext.data.JsonStore', {
			fields : [
			'datetime',
			'accelate_x', 
			'accelate_y', 
			'accelate_z'
 			]
		});
		
		return {
			xtype : 'chart',
			itemId : 'chart',
            animate: true,
			legend : {
				position: {
	                portrait: 'bottom',
	                landscape: 'bottom'
	            },
	            labelFont: '20px Arial',
				itemSpacing:5,
				padding:0,
				boxStroke:"transparent",
				boxFill : "transparent"
			},
			store : store,
			axes : [ {
				title : T('title.acceleration'),
				type : 'Numeric',
				position : 'left',
				fields : [ 'accelate_x', 'accelate_y', 'accelate_z' ]
			}, {
					title : T('title.velocity'),
					type : 'Numeric',
					position : 'right',
					fields : [ 'velocity' ]
				}, {
				title : T('label.time'),
				type : 'Time',
				position : 'bottom',
				fields : [ 'datetime' ],
				dateFormat : 'H:i:s',
				step : [Ext.Date.SECOND, 1],
				label: {
                    rotate: {
                        degrees: 45
                    }
                }
			} ],
			series : [ {
				type : 'line',
	            highlight: {
	                size: 7,
	                radius: 7
	            },
	            fill: false,
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
	            fill: false,
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
	            fill: false,
	            smooth: true,
	            axis: 'left',
	            title: 'Accelate Z',

				xField : 'datetime',
				yField : 'accelate_z'
			}, {
				type : 'line',
	            highlight: {
	                size: 7,
	                radius: 7
	            },
	            fill: false,
	            smooth: true,
	            axis: 'right',
	            title: 'Velocity',

				xField : 'datetime',
				yField : 'velocity'
			} ]
		}
	}

});
