Ext.define('HatioBB.view.report.MaintTrendReport', {
	extend : 'Ext.Panel',
	
	xtype : 'mainttrendreport',
	
	requires: [
		'Ext.chart.Chart',
	    'Ext.chart.axis.Numeric',
	    'Ext.chart.axis.Category',
		'Ext.chart.series.Column',
		'Ext.chart.series.Line',
		'Ext.data.JsonStore'],
		
	config : {
	    cls : 'grayBg',
		layout : 'fit'
	},
	
	constructor : function(config) {
		
		var self = this;
		//var chartStore = Ext.create('Ext.data.Store', { fields : ["mnt_cnt", "PV-001", "PV-002", "PV-003", "PV-004", "PV-005"], data : [] });
		config.items = [
			this.buildChart()
		];
		
		this.callParent(arguments);
		
		Ext.Ajax.request({
			url: window.location.pathname.indexOf('/m/') === 0 ? '/report/service' : 'data/maint_trend_report.json',
			method : 'GET',
			params : { 
				id : 'repair_list',
				type : 'maint_trend'
			},
			success: function(response) {		    	
			    var resultObj = Ext.JSON.decode(response.responseText);

			    if(resultObj.success) {
					var records = resultObj.items;
					
					var retObj = self.buildChartStore(records);
					// var chartFieldList = retObj[0];
					// 				chartStore = retObj[1];
					
					//alert(chartFieldList);
					//alert(Ext.JSON.encode(chartStore.getData()));
							
					// self.down('chart').getStore().setData(chartFieldList);
					//self.down('chart').store = chartStore;
					// self.down('[itemId=report]').setData(chartFieldList);
					// var ch = self.down('chart');
					// 					var data = chartStore.getData();
					//alert(Ext.JSON.encode(data));
					self.down('chart').getStore().setData(retObj);

				} else {
				   	Ext.MessageBox.alert(T('label.failure'), resultObj.msg);
				}
			},
			failure: function(response) {
				Ext.MessageBox.alert(T('label.failure'), response.responseText);
			}
		});
	},
	
	buildChartStore : function(records) {

			var bottomFieldList = [];
			var fieldList = ['year'];
			var chartDataList = [];

			Ext.each(records, function(record) {
				var item = null;

				Ext.each(chartDataList, function(chartData) {
					if(chartData.year == record.year) {
						item = chartData;
					}				
				});

				if(!item) {
					item = { "year" : record.year };
					chartDataList.push(item);
				}

				if(!Ext.Array.contains(fieldList, record.vehicle)) {
					fieldList.push(record.vehicle);
					bottomFieldList.push(record.vehicle);
				}

				item[record.vehicle] = record.mnt_cnt;
			});

			//return [bottomFieldList, Ext.create('Ext.data.Store', { fields : fieldList, data : chartDataList })];
			
			return chartDataList;
		},

	buildChart : function(chartStore) {
		return {
			xtype : 'chart',
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

			store: Ext.create('Ext.data.Store', { fields : ["year", "PV-001", "PV-002", "PV-003", "PV-004", "PV-005"], data : [] }),
			interactions: [{
			type: 'togglestacked',

			}],
			
            axes: [
                {
                    type: 'Category',
                    position: 'left',
                    fields: ['year'],
                    title: T('label.year')
                },
                {
                    type: 'Numeric',
                    position: 'bottom',
                    fields: ["PV-001", "PV-002", "PV-003", "PV-004", "PV-005"],
                    title: T('label.maintenance_count'),
                    minimum: 0
                }
            ],
            series: [
            {
                type: 'bar',
                // fill: true,
                smooth: true,
				gutter: 80,
                axis: 'bottom',
				highlight: true,
                xField: 'year',
                yField: ["PV-001", "PV-002", "PV-003", "PV-004", "PV-005"]
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
