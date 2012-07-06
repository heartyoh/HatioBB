Ext.define('HatioBB.view.report.EcoDrivingHabitReport', {
	extend : 'Ext.Panel',
	
	xtype : 'ecodrivinghabitreport',
	
	requires: [
		'Ext.chart.Chart',
        'Ext.chart.axis.Numeric',
        'Ext.chart.axis.Category',
        'Ext.chart.series.Pie',
		'Ext.chart.series.Scatter',
		'Ext.data.JsonStore'
	],
		
	config : {
		cls : 'grayBg',
		layout : 'fit'
	},

	constructor : function(config) {
		var self = this;
		
		config.items = [
			this.buildChart()
		];
		
		this.callParent(arguments);

		var dashboardStore = Ext.getStore('EcoDrivingHabitReportStore');

		dashboardStore.load({
			scope : this,
			callback: function(records, operation, success) {
				var data = [];
				for(var i = 0 ; i < records.length ; i++) {
					var item = records[i].data;
					data.push(item);
				}

				self.down('chart').getStore().setData(data);
			}
		});		
	},

	buildChart : function() {
		return {
			xtype : 'chart',
			itemId : 'xxx',
		    theme: 'Demo',
            animate: true,
            shadow: false,
			toolbar : null,
			flex : 1,

			store: Ext.create('Ext.data.JsonStore', {
			    fields: ['eco_index', 'sud_cnt'],
				data : []
			}),
			
            axes: [
                {
                    type: 'Numeric',
                    position: 'bottom',
                    fields: ['sud_cnt'],
                    title: T('label.sudden_accel') + '/' + T('label.sud_brake_cnt'),
                    minimum: 0
                },
                {
                    type: 'Numeric',
                    position: 'left',
                    fields: ['eco_index'],
                    title: T('label.eco_index'),
                    minimum: 0
                }
            ],
            series: [
            {
                type: 'scatter',
                // fill: true,
                smooth: true,
				markerConfig: {
					radius: 5,
					size: 5
				},
                axis: 'left',
				highlight: true,
                xField: 'sud_cnt',
                yField: ['eco_index']
            }
            ]
		};
	}

});
