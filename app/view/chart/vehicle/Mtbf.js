Ext.define('HatioBB.view.chart.vehicle.Mtbf', {
	extend : 'Ext.Panel',
	
	xtype : 'vehicle_chart_mtbf',
	
	requires: [
		'Ext.chart.Chart',
    	'Ext.chart.axis.Numeric',
    	'Ext.chart.axis.Category'
	],
		
	config : {
		title : T('report.mtbf'),
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
			fields : [ 'year', 'month_str', 'mtbf' ],
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

	getChart : function() {
		/* chart 가 문제가 없을 때까지는 아래처럼 해야한다. */
		if(!this.chart)
			this.chart = this.getAt(0);
		return this.chart;
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
		var fromDay = Ext.Date.add(today, Ext.Date.MONTH, -12);
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
				select : ['month_str', 'oos_cnt', 'run_time', 'mnt_time']
			},
			success: function(response) {		    	
			    var resultObj = Ext.JSON.decode(response.responseText);
			    if(resultObj.success) {
					var records = resultObj.items;
					Ext.each(records, function(record) {
						var oosCnt = record.oos_cnt;
						var mntTime = record.mnt_time;
						var runTime = record.run_time;
						var mtbf = runTime - mntTime;					
						mtbf = (mtbf && mtbf > 0) ? mtbf : 0;
						if(mtbf > 0) {					
							mtbf = (oosCnt && oosCnt > 0) ? (mtbf / oosCnt) : mtbf;
							mtbf = parseFloat((mtbf / (24 * 60)).toFixed(2));
						}						
						record.mtbf = mtbf
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
				fields : [ 'month_str', 'mtbf' ],
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
				fields: ['mtbf'],
				title: 'MTBF' + T('label.parentheses_day'),
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
                yField: 'mtbf',
                title: 'MTBF',
                label: {
					display: 'outside',
					'text-anchor': 'middle',
                    field: 'mtbf',
					orientation: 'horizontal',
					color: '#333'
                }
            }]
		};
	}
});