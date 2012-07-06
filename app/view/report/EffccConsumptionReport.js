Ext.define('HatioBB.view.report.EffccConsumptionReport', {
	extend : 'Ext.Panel',
	
	xtype : 'effccconsumptionreport',
	
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

		/*var dashboardStore = Ext.getStore('EffccConsumptionReportStore');
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
		});	*/

		Ext.Ajax.request({
			url: window.location.pathname.indexOf('/m/') === 0 ? '/report/service' : 'data/efficiency_report.json',
			method : 'GET',
			params : { 
				id : 'fuel',
				type : 'effcc_consmpt',
				duration : 12
			},
			success: function(response) {		    	
			    var resultObj = Ext.JSON.decode(response.responseText);

			    if(resultObj.success) {
					var records = resultObj.items;
					self.down('chart').getStore().setData(records);

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
		    theme: 'Demo',
            animate: true,
            shadow: false,
			toolbar : null,
			flex : 1,

			store: Ext.create('Ext.data.JsonStore', {
			    fields: ['year', 'month', 'effcc', 'consmpt', 'yearmonth'],
				data : []
			}),
			
            axes: [
                {
                    type: 'Numeric',
                    position: 'bottom',
                    fields: ['consmpt'],
                    title: T('label.fuel_consumption') + '(ℓ)',
                    minimum: 0
                },
                {
                    type: 'Numeric',
                    position: 'left',
                    fields: ['effcc'],
                    title: T('label.fuel_efficiency') + '(km/ℓ)',
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
                xField: 'consmpt',
                yField: ['effcc']
            }
            ]
		};
	}

});
