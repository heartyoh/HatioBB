Ext.define('HatioBB.view.chart.vehicle.Summary', {
	extend : 'Ext.Panel',
	
	xtype : 'chart_v_summary',
	
	requires: [
	'Ext.chart.Chart',
    'Ext.chart.axis.Numeric',
    'Ext.chart.axis.Category'
	],
		
	config : {
		title : T('title.chart_v_summary'),
		cls : 'grayBg',
		layout : 'fit'
	},

	constructor : function(config) {
		var self = this;
		
		this.callParent(arguments);	
		
		// var chart = this.add(this.buildChart());
		
		this.on('painted', function() {
			HatioBB.setting.on('vehicle', this.refresh, this);
			HatioBB.setting.on('fromYear', this.refresh, this);
			HatioBB.setting.on('summaryType', this.refresh, this);
			
			this.refresh();
		});
		
		this.on('erased', function() {
			HatioBB.setting.un('vehicle', this.refresh, this);
			HatioBB.setting.un('fromYear', this.refresh, this);
			HatioBB.setting.un('summaryType', this.refresh, this);
		});
	},

	getChart : function() {
		/* chart 가 문제가 없을 때까지는 아래처럼 해야한다. */
		if(!this.chart)
			this.chart = this.getAt(0);
		return this.chart;
	},
	
	refresh : function(store, records) {
		var self = this;
		var store = Ext.getStore('VehicleRunStore');
		
		if(HatioBB.setting.get('vehicle') === this.vehicle
		&& HatioBB.setting.get('fromYear') === this.fromYear
		&& HatioBB.setting.get('summaryType') === this.summaryType) 
			return;
			
		var thisYear = new Date().getFullYear();
		var thisMonth = new Date().getMonth() + 1;
		this.vehicle = HatioBB.setting.get('vehicle');
		this.fromYear = HatioBB.setting.get('fromYear') || (thisYear - 1);
		this.summaryType = HatioBB.setting.get('summaryType') || 'BarChart';
		
		/* filter로 하지 않고, 파라미터로 해야 함 */
		var proxy = store.getProxy();
		proxy.config.extraParams.vehicle = this.vehicle;
		proxy.config.extraParams.from_year = this.fromYear;
		proxy.config.extraParams.to_year = thisYear;
		proxy.config.extraParams.from_month = 1;
		proxy.config.extraParams.to_month = thisMonth;
		
		store.load(function(records) {
			var chart;
			switch(self.summaryType) {
				case 'BarChart' :
					chart = self.buildBarChart(this, records);
					break;
				case 'RadarChart' :
					chart = self.buildRadarChart(this, records);
					break;
				default :
					break;
			}
			
			if(self.chart)
				self.remove(chart);
			if(chart)
				self.chart = self.add(chart);
				
			// var groups = store.getGroups();
			// 
			// 
			// 
			// 
			// 
			// var totalRecordCnt = 0;
			// var consmpt = 0;
			// var oos_cnt = 0;
			// var co2_emss = 0;
			// var mnt_time = 0;
			// var mnt_cnt = 0;
			// var run_dist = 0;
			// var effcc = 0;
			// var run_time = 0;
			// 
			// Ext.each(records, function(record) {
			// 	if(record.get('vehicle'))
			// 		totalRecordCnt += 1;
			// 
			// 	if(record.get('consmpt'))
			// 		consmpt += record.get('consmpt');
			// 
			// 	if(record.get('oos_cnt'))
			// 		oos_cnt += record.get('oos_cnt');
			// 
			// 	if(record.get('co2_emss'))
			// 		co2_emss += record.get('co2_emss');
			// 
			// 	if(record.get('mnt_time'))
			// 		mnt_time += record.get('mnt_time');
			// 
			// 	if(record.get('mnt_cnt'))
			// 		mnt_cnt += record.get('mnt_cnt');			
			// 
			// 	if(record.get('run_dist'))
			// 		run_dist += record.get('run_dist');			
			// 
			// 	if(record.get('effcc'))
			// 		effcc += record.get('effcc');			
			// 
			// 	if(record.get('run_time'))
			// 		run_time += record.get('run_time');			
			// });
			// 
			// consmpt = consmpt / totalRecordCnt;
			// oos_cnt = oos_cnt / totalRecordCnt;
			// co2_emss = co2_emss / totalRecordCnt;
			// mnt_time = mnt_time / totalRecordCnt;
			// mnt_cnt = mnt_cnt / totalRecordCnt;
			// run_dist = run_dist / totalRecordCnt;
			// effcc = effcc / totalRecordCnt;
			// run_time = run_time / totalRecordCnt;
			// 
			// var data = [
			//     { 'name' : T('label.x_count', {x : T('label.consumption')}), 	'value' : consmpt },
			//     { 'name' : T('label.x_count', {x : T('label.oos')}), 			'value' : oos_cnt },
			//     { 'name' : T('label.x_count', {x : T('label.co2_emission')}), 	'value' : co2_emss },
			//     { 'name' : T('label.x_time', {x : T('label.maint_time')}), 	'value' : mnt_time },
			//     { 'name' : T('label.x_count', {x : T('label.maint_count')}),	'value' : mnt_cnt },
			//     { 'name' : T('label.x_count', {x : T('label.run_distance')}),	'value' : run_dist },
			//     { 'name' : T('label.fuel_efficiency'),							'value' : effcc },
			//     { 'name' : T('label.x_time', {x : T('label.run_time')}),	'value' : run_time },
			// ];
			// 
			// self.getChart().getStore().setData(data);
		});
	},
	
	buildBarChart : function(store, records) {
		var store = Ext.create('Ext.data.JsonStore', {
			fields : ['year', 'month', 'key', 'value'],
			data : []
		});
		
		return {
			xtype : 'chart',
			store : store,
            themeCls: 'bar1',
            theme: 'Demo',
            animate: true,
            shadow: false,
			toolbar : null,
            legend: {
                position: {
                    portrait: 'bottom',
                    landscape: 'bottom'
                },
                labelFont: '17px Arial'
            },
            axes: [
                {
                    type: 'Numeric',
                    position: 'bottom',
                    fields: ['2008', '2009', '2010'],
                    label: {
                        renderer: function (v) {
                            return v.toFixed(0);
                        }
                    },
                    title: 'Number of Hits',
                    minimum: 0
                },
                {
                    type: 'Category',
                    position: 'left',
                    fields: ['name'],
                    title: 'Month of the Year'
                }
            ],
            series: [
                {
                    type: 'bar',
                    xField: 'name',
                    yField: ['2008', '2009', '2010'],
                    axis: 'bottom',
                    highlight: true,
                    showInLegend: true
                }
            ]
		};
	},

	buildRadarChart : function() {
		var store = Ext.create('Ext.data.JsonStore', {
			fields : ['year', 'key', 'value'],
			data : []
		});

		return {
			xtype : 'chart',
			themeCls: 'radar1',
            theme: 'Demo',
            insetPadding: 30,
            shadow: true,
            animate: true,
            store: store,
            interactions: ['rotate', 'reset'],
			legend: {
                position: 'bottom'
            },
            axes: [{
                type: 'Radial',
                position: 'radial',
                label: {
                    display: true
                }
            }],
            series: [{
                showInLegend: false,
                showMarkers: true,
                type: 'radar',
                xField: 'key',
                yField: 'value',
                style: {
                    opacity: 0.4
                },
                markerConfig: {
                    radius: 3,
                    size: 5
                }
            }]		
		}
	}
});