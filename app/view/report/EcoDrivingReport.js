Ext.define('HatioBB.view.report.EcoDrivingReport', {
	extend : 'Ext.Carousel',
	
	xtype : 'ecodrivingreport',
	
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
		
/*		var run_store = Ext.getStore('EcoDrivingReportStore');
		
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
			url: window.location.pathname.indexOf('/m/') === 0 ? '/report/service' : 'data/eco_driving_report.json',
			method : 'GET',
			params : { 
				id : 'eco',
				type : 'ecoindex_ecorate',
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
	            labelFont: '20px Arial'
	        },
	
			store: Ext.create('Ext.data.JsonStore', {
			    fields: ['year', 'month', 'eco_index', 'eco_driving', 'yearmonth'],
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
                    fields: ['eco_index'],
                    title: T('label.eco_index') + '(%)',
                    minimum: 0
                },
                {
                    type: 'Numeric',
                    position: 'right',
                    fields: ['eco_driving'],
                    title: T('label.eco_driving') + '(%)',
                    minimum: 0
                }
            ],
            series: [
            {
                type: 'column',
                highlight: true,
                // fill: true,
                smooth: true,
                axis: 'left',
                xField: 'yearmonth',
                yField: ['eco_index'],
                title: T('label.eco_index')
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
                yField: 'eco_driving',
                title: T('label.eco_driving')
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
						'<th>'+ T('label.eco_index') +'</th>',
						'<th>'+ T('label.eco_driving') +'</th>',
					'</tr>',
					'<tpl for=".">',
					'<tr>',
						'<td class="alignCenter">{year}</td>',
						'<td class="alignCenter">{month}</td>',
						'<td class="alignCenter">{eco_index}</td>',
						'<td class="alignCenter">{eco_driving}</td>',
					'</tr>',
					'</tpl>',
				'</table>'
			]	
        };
	}
});
