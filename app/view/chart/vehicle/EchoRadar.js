Ext.define('HatioBB.view.chart.vehicle.EchoRadar', {
	extend : 'Ext.Panel',
	
	xtype : 'chart_v_echo_radar',
	
	requires: [
	'Ext.chart.Chart',
    'Ext.chart.axis.Numeric',
    'Ext.chart.axis.Category'
	],
		
	config : {
		title : T('title.chart_v_echo_radar'),
		cls : 'grayBg',
		layout : 'fit'
	},

	constructor : function(config) {
		var self = this;
		
		this.callParent(arguments);	
		
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
		var store = Ext.getStore('VehicleRunStore');
		
		var thisYear = new Date().getFullYear();
		var thisMonth = new Date().getMonth() + 1;
		this.vehicle = HatioBB.setting.get('vehicle');
		this.fromYear = HatioBB.setting.get('fromYear') || (thisYear - 1);
		
		/* filter로 하지 않고, 파라미터로 해야 함 */
		var proxy = store.getProxy();
		proxy.config.extraParams.vehicle = this.vehicle;
		proxy.config.extraParams.from_year = this.fromYear;
		proxy.config.extraParams.to_year = thisYear;
		proxy.config.extraParams.from_month = 1;
		proxy.config.extraParams.to_month = thisMonth;
		
		store.load(function(records) {
			var groups = this.getGroups();
			var data = {
				consmpt : { name : T('label.consumption') },
				oos_cnt : { name : T('label.oos_count') },
				co2_emss : { name : T('label.co2_emission') },
				mnt_time : { name : T('label.maint_time') },
				mnt_cnt : { name : T('label.maint_count') },
				run_dist : { name : T('label.run_distance') },
				effcc : { name : T('label.fuel_efficiency') },
				run_time : { name : T('label.run_time') }
			};
			var fields = [];

			Ext.Array.each(groups, function(group) {
				var year = group.name.toString();
				var records = group.children;
				
				var totalRecordCnt = 0;
				var consmpt = 0;
				var oos_cnt = 0;
				var co2_emss = 0;
				var mnt_time = 0;
				var mnt_cnt = 0;
				var run_dist = 0;
				var effcc = 0;
				var run_time = 0;

				Ext.each(records, function(record) {
					if(record.get('vehicle'))
						totalRecordCnt += 1;

					if(record.get('consmpt'))
						consmpt += record.get('consmpt');

					if(record.get('oos_cnt'))
						oos_cnt += record.get('oos_cnt');

					if(record.get('co2_emss'))
						co2_emss += record.get('co2_emss');

					if(record.get('mnt_time'))
						mnt_time += record.get('mnt_time');

					if(record.get('mnt_cnt'))
						mnt_cnt += record.get('mnt_cnt');			

					if(record.get('run_dist'))
						run_dist += record.get('run_dist');			

					if(record.get('effcc'))
						effcc += record.get('effcc');			

					if(record.get('run_time'))
						run_time += record.get('run_time');			
				});

				consmpt = consmpt / 500 / totalRecordCnt;
				oos_cnt = oos_cnt / totalRecordCnt;
				co2_emss = co2_emss / 100 / totalRecordCnt;
				mnt_time = mnt_time / 10 / totalRecordCnt;
				mnt_cnt = mnt_cnt / totalRecordCnt;
				run_dist = run_dist / 500 / totalRecordCnt;
				effcc = effcc / totalRecordCnt;
				run_time = run_time / 500 / totalRecordCnt;

				data['consmpt'][year] = consmpt;
				data['oos_cnt'][year] = oos_cnt;
				data['co2_emss'][year] = co2_emss;
				data['mnt_time'][year] = mnt_time;
				data['mnt_cnt'][year] = mnt_cnt;
				data['run_dist'][year] = run_dist;
				data['effcc'][year] = effcc;
				//TODO Randomize 는 삭제되어야 한다.
				data['run_time'][year] = run_time * Math.random();
				
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