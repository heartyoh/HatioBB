Ext.define('HatioBB.view.report.DrivingReport', {
	extend : 'Ext.Carousel',
	
	xtype : 'drivingreport',
	
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
		
		var run_store = Ext.getStore('DrivingReportStore');
		
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
	            labelFont: '20px Arial'
	        },
	
			store: Ext.create('Ext.data.JsonStore', {
			    fields: ['year', 'month', 'run_dist', 'run_time', 'yearmonth'],
				data : []
			}),
			
	        axes: [
                {
                    type: 'Category',
                    position: 'bottom',
                    fields: ['yearmonth'],
                    title: T('label.month')
                },
                {
                    type: 'Numeric',
                    position: 'left',
                    fields: ['run_dist'],
                    title: T('label.run_dist'),
                    minimum: 0
                },
                {
                    type: 'Numeric',
                    position: 'right',
                    fields: ['run_time'],
                    title: T('label.run_time'),
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
                xField: 'yearmonth',
                yField: ['run_dist'],
                title: T('label.run_dist')
            }, {
                type: 'line',
                highlight: {
                    size: 7,
                    radius: 7
                },
                fill: true,
                smooth: true,
                axis: 'right',
                xField: 'yearmonth',
                yField: 'run_time',
                title: T('label.run_time')
            }
            ]
		};
	},

	buildTable : function(){
		return {
            xtype : 'panel',
			cls : 'paddingAll15',
			itemId : 'report',
			data : {},
			tpl: [
				'<table class=dataGrid>',
					'<tr>',
						'<th>'+ T('label.year') +'</th>',
						'<th>'+ T('label.month') +'</th>',
						'<th>'+ T('label.run_dist') +'</th>',
						'<th>'+ T('label.run_time') +'</th>',
					'</tr>',
					'<tpl for=".">',
					'<tr>',
						'<td class="alignCenter">{year}</td>',
						'<td class="alignCenter">{month}</td>',
						'<td class="alignCenter">{run_dist}</td>',
						'<td class="alignCenter">{run_time}</td>',
					'</tr>',
					'</tpl>',
				'</table>'
			]	
        };
	}
});
