Ext.define('HatioBB.view.report.EfficiencyReport', {
	extend : 'Ext.Carousel',
	
	xtype : 'efficiencyreport',
	
	requires: ['Ext.Carousel',
		'Ext.chart.Chart',
	    'Ext.chart.axis.Numeric',
	    'Ext.chart.axis.Category',
		'Ext.chart.series.Column',
		'Ext.chart.series.Line',
		'Ext.data.JsonStore'],
		
	config : {
	    direction : 'vertical',
		cls : 'grayBg'
	},
	
	constructor : function(config) {
		
		var self = this;
		
		config.items = [
			this.buildChart(),
			this.buildTable()
		];
		
		this.callParent(arguments);
		
		var run_store = Ext.getStore('EfficiencyReportStore');
		
		run_store.load({
			scope : this,
			callback: function(records, operation, success) {
				var data = [];
				for(var i = 0 ; i < records.length ; i++) {
					var item = records[i].data;
					data.push(item);
				}
				self.down('chart').getStore().setData(data);
				self.down('[itemId=report]').setData(data);
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
            legend: {
                position: {
                    portrait: 'bottom',
                    landscape: 'bottom'
                },
                labelFont: '17px Arial'
            },

			store: Ext.create('Ext.data.JsonStore', {
			    fields: ['year', 'month', 'effcc', 'consmpt'],
				data : []
			}),
			
            axes: [
                {
                    type: 'Category',
                    position: 'bottom',
                    fields: ['month'],
                    title: 'Month of the Year'
                },
                {
                    type: 'Numeric',
                    position: 'left',
                    fields: ['consmpt'],
                    title: 'Fuel Consumption',
                    minimum: 0
                },
                {
                    type: 'Numeric',
                    position: 'right',
                    fields: ['effcc'],
                    title: 'Fuel Efficiency',
                    minimum: 0
                }
            ],
            series: [
            {
                type: 'column',
                highlight: {
                    size: 7,
                    radius: 7
                },
                // fill: true,
                smooth: true,
                axis: 'left',
                xField: 'month',
                yField: ['consmpt'],
                title: 'Fuel Consumption'
            }, {
                type: 'line',
                highlight: {
                    size: 7,
                    radius: 7
                },
                fill: true,
                smooth: true,
                axis: 'right',
                xField: 'month',
                yField: 'effcc',
                title: 'Fuel Efficiency'
            }
            ]
		};
	},

	buildTable : function(){
		return {
            xtype : 'panel',
			itemId : 'report',
			cls : 'paddingAll15',
			data : {},
			tpl: [
				'<table class=dataGrid>',
					'<tr>',
						'<th>년/월</th>',
						'<th>effcc</th>',
						'<th>consmpt</th>',
					'</tr>',
					'<tpl for=".">',
					'<tr>',
						'<td class="alignCenter">{year}/{month}</td>',
						'<td class="alignCenter">{effcc}</td>',
						'<td class="alignCenter">{consmpt}</td>',
					'</tr>',
					'</tpl>',
				'</table>',
				
			]	
        };
	}
});
