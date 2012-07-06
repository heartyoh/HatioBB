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
		
/*		var run_store = Ext.getStore('EfficiencyReportStore');
		
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
		});*/
		
		Ext.Ajax.request({
			url: window.location.pathname.indexOf('/m/') === 0 ? '/report/service' : 'data/efficiency_report.json',
			method : 'GET',
			params : { 
				id : 'fuel',
				type : 'effcc_trend',
				duration : 12
			},
			success: function(response) {		    	
			    var resultObj = Ext.JSON.decode(response.responseText);

			    if(resultObj.success) {
					var records = resultObj.items;
					self.down('chart').getStore().setData(records);
					self.down('[itemId=report]').setData(records);

				} else {
				   	Ext.MessageBox.alert(T('label.failure'), resultObj.msg);
				}
			},
			failure: function(response) {
				Ext.MessageBox.alert(T('label.failure'), response.responseText);
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
			    fields: ['year', 'month', 'effcc', 'consmpt', 'yearmonth'],
				data : []
			}),
			
            axes: [
                {
                    type: 'Category',
                    position: 'bottom',
                    fields: ['yearmonth'],
                    title: T('label.month'),
					label: {
						rotate: {
							degrees: 315
						}
					}
                },
                {
                    type: 'Numeric',
                    position: 'left',
                    fields: ['consmpt'],
                    title: T('label.fuel_consumption') + '(ℓ)',
                    minimum: 0
                },
                {
                    type: 'Numeric',
                    position: 'right',
                    fields: ['effcc'],
                    title: T('label.fuel_efficiency') + '(km/ℓ)',
                    minimum: 0
                }
            ],
            series: [
            {
                type: 'column',
                // fill: true,
                smooth: true,
                axis: 'left',
				highlight: true,
                xField: 'yearmonth',
                yField: ['consmpt'],
                title: T('label.fuel_consumption')
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
                yField: 'effcc',
                title: T('label.fuel_efficiency')
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
						'<th>'+ T('label.year') + '/' + T('label.month') +'</th>',
						'<th>'+ T('label.fuel_efficiency') +'</th>',
						'<th>'+ T('label.fuel_consumption') +'</th>',
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
