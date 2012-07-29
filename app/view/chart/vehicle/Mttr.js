Ext.define('HatioBB.view.chart.vehicle.Mttr', {
	extend : 'Ext.Panel',
	
	xtype : 'vehicle_chart_mttr',
	
	requires: [
		'Ext.chart.Chart',
    	'Ext.chart.axis.Numeric',
    	'Ext.chart.axis.Category'
	],
		
	config : {
		title : T('report.mttr'),
		cls : 'grayBg',
		layout : {
			type : 'vbox',
			align : 'stretch'
		}
	},

	constructor : function(config) {
		var self = this;
		
		this.callParent(arguments);	
		
		this.chartStore = Ext.create('Ext.data.JsonStore', {
			fields : [ 'year', 'month_str', 'mttr' ],
			data : []
		});

		this.add(this.buildRunChart(this.chartStore));
		
		this.on('painted', function() {
			HatioBB.setting.on('vehicle', this.refresh, this);
			HatioBB.setting.on('fromYear', this.refresh, this);
			
			this.refresh();
		});
		
		this.on('erased', function() {
			HatioBB.setting.un('vehicle', this.refresh, this);
			HatioBB.setting.un('fromYear', this.refresh, this);
		});
	},
	
	refresh : function(store, records) {
		if(HatioBB.setting.get('vehicle') === this.vehicle
		&& HatioBB.setting.get('fromYear') === this.fromYear) 
			return;
			
		var self = this;
		this.vehicle = HatioBB.setting.get('vehicle');
		var today = new Date();
		var toYear = today.getFullYear();
		var toMonth = today.getMonth() + 1;		
		var fromDay = Ext.Date.add(today, Ext.Date.MONTH, -11);
		var fromYear = fromDay.getFullYear();
		var fromMonth = fromDay.getMonth() + 1;
						
		Ext.Ajax.request({
			url: window.location.pathname.indexOf('/m/') === 0 ? '/vehicle_run' : 'data/vehicle_run.json',
			method : 'GET',
			params : { 
				vehicle : self.vehicle,
				time_view : 'monthly',
				from_year : fromYear,
				to_year : toYear,
				from_month : fromMonth,
				to_month : toMonth,
				select : ['month_str', 'oos_cnt', 'mnt_time', 'mnt_cnt']
			},
			success: function(response) {		    	
			    var resultObj = Ext.JSON.decode(response.responseText);
			    if(resultObj.success) {
					var records = resultObj.items;
					Ext.each(records, function(record) {
						var oosCnt = record.oos_cnt;
						var mntTime = record.mnt_time;
						var runData = (oosCnt && mntTime) ? (mntTime / oosCnt) : 0;						
						runData = parseFloat(runData.toFixed(2));
						record.mttr = runData;
					});
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
	
	buildRunChart : function() {
		return {
			xtype : 'chart',
			itemId : 'report',
			store : Ext.create('Ext.data.JsonStore', {
				fields : [ 'month_str', 'mttr' ],
				data : []
			}),
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
            axes: [{
				type: 'Category',
				position: 'bottom',
				fields: ['month_str'],
				title: T('label.month')
			}, {
				type: 'Numeric',
				position: 'left',
				fields: ['mttr'],
				title: 'MTTR' + T('label.parentheses_min'),
				minimum : 0
			}],
            series: [{
                type: 'column',
                highlight: {
                    size: 7,
                    radius: 7
                },
                fill: true,
                smooth: true,
                axis: 'left',
                xField: 'month_str',
                yField: 'mttr',
                title: 'MTTR',
                label: {
					display: 'outside',
					'text-anchor': 'middle',
                    field: 'mttr',
					orientation: 'horizontal',
					color: '#333'
                }
            }]
		};
	}
});