Ext.define('HatioBB.view.chart.driver.EchoRadar', {
	extend : 'Ext.Panel',
	
	xtype : 'chart_d_echo_radar',
	
	requires: [
	'Ext.chart.Chart',
    'Ext.chart.axis.Numeric',
    'Ext.chart.axis.Category'
	],
		
	config : {
		title : T('title.chart_d_echo_radar'),
		cls : 'grayBg',
		layout : 'fit'
	},

	constructor : function(config) {
		var self = this;
		
		this.callParent(arguments);	
		
		this.on('painted', function() {
			HatioBB.setting.on('driver', this.refresh, this);
			HatioBB.setting.on('fromYear', this.refresh, this);
			
			this.refresh();
		});
		
		this.on('erased', function() {
			HatioBB.setting.un('driver', this.refresh, this);
			HatioBB.setting.un('fromYear', this.refresh, this);
		});
	},

	refresh : function(store, records) {
		if(HatioBB.setting.get('driver') === this.driver
		&& HatioBB.setting.get('fromYear') === this.fromYear) 
			return;
			
		var self = this;
		var store = Ext.getStore('DriverRunStore');
		
		var thisYear = new Date().getFullYear();
		var thisMonth = new Date().getMonth() + 1;
		this.driver = HatioBB.setting.get('driver');
		this.fromYear = HatioBB.setting.get('fromYear') || (thisYear - 1);
		
		/* filter로 하지 않고, 파라미터로 해야 함 */
		var proxy = store.getProxy();
		proxy.config.extraParams.driver = this.driver;
		proxy.config.extraParams.from_year = this.fromYear;
		proxy.config.extraParams.to_year = thisYear;
		proxy.config.extraParams.from_month = 1;
		proxy.config.extraParams.to_month = thisMonth;
		
		store.load(function(records) {
			var groups = this.getGroups();
			var data = {
				ecoDrvTime : { name : T('label.x_time', {x : T('label.eco_driving')}) },
				efficiency : { name : T('label.fuel_efficiency') },
				overSpdCnt : { name : T('label.x_time', {x : T('label.over_speeding')}) },
				sudAccelCnt : { name : T('label.x_count', {x : T('label.sudden_accel')}) },
				sudBrakeCnt : { name : T('label.x_count', {x : T('label.sudden_brake')}) },
			};
			var fields = [];

			Ext.Array.each(groups, function(group) {
				var year = group.name.toString();
				var records = group.children;
				
				var totalRecordCnt = 0;
				var ecoDrvTime = 0;
				var efficiency = 0;
				var overSpdCnt = 0;
				var sudAccelCnt = 0;
				var sudBrakeCnt = 0;

				Ext.each(records, function(record) {
					if(record.get('driver'))
						totalRecordCnt += 1;

					if(record.get('eco_drv_time'))
						ecoDrvTime += record.get('eco_drv_time');

					if(record.get('effcc'))
						efficiency += record.get('effcc');

					if(record.get('ovr_spd_time'))
						overSpdCnt += record.get('ovr_spd_time');

					if(record.get('sud_accel_cnt'))
						sudAccelCnt += record.get('sud_accel_cnt');

					if(record.get('sud_brake_cnt'))
						sudBrakeCnt += record.get('sud_brake_cnt');			
				});

				ecoDrvTime = ecoDrvTime / totalRecordCnt;
				efficiency = efficiency / totalRecordCnt;
				overSpdCnt = overSpdCnt / totalRecordCnt;
				sudAccelCnt = sudAccelCnt / totalRecordCnt;
				sudBrakeCnt = sudBrakeCnt / totalRecordCnt;

				data['ecoDrvTime'][year] = ecoDrvTime;
				data['efficiency'][year] = efficiency;
				data['overSpdCnt'][year] = overSpdCnt;
				data['sudAccelCnt'][year] = sudAccelCnt;
				data['sudBrakeCnt'][year] = sudBrakeCnt;
				
				fields.push(year);
			});
			
			var storeData = [];
			for(var attr in data) {
				storeData.push(data[attr]);
			}

			if(self.chart)
				self.remove(self.chart);
			self.chart = self.add(self.buildChart(fields, storeData));
		});
	},
	
	buildChart : function(fields, data) {
		var store = Ext.create('Ext.data.JsonStore', {
			fields : Ext.Array.merge(fields, ['name']),
			data : data
		});
		
		var series = Ext.Array.map(fields, function(year) {
			return {
	            showInLegend: false,
	            showMarkers: true,
	            type: 'radar',
	            xField: 'name',
	            yField: year,
	            style: {
	                opacity: 0.4
	            },
	            markerConfig: {
	                radius: 3,
	                size: 5
	            }
			};
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
            series: series	
		}
	}
});