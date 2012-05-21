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
			var data = [];
			var fields = [];

			Ext.Array.each(groups, function(group) {
				var year = group.name;
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

				consmpt = consmpt / totalRecordCnt;
				oos_cnt = oos_cnt / totalRecordCnt;
				co2_emss = co2_emss / totalRecordCnt;
				mnt_time = mnt_time / totalRecordCnt;
				mnt_cnt = mnt_cnt / totalRecordCnt;
				run_dist = run_dist / totalRecordCnt;
				effcc = effcc / totalRecordCnt;
				run_time = run_time / totalRecordCnt;

				Ext.Array.each([
				    { 'year' : year, 'name' : T('label.x_count', {x : T('label.consumption')}), 	'value' : consmpt },
				    { 'year' : year, 'name' : T('label.x_count', {x : T('label.oos')}), 			'value' : oos_cnt },
				    { 'year' : year, 'name' : T('label.x_count', {x : T('label.co2_emission')}), 	'value' : co2_emss },
				    { 'year' : year, 'name' : T('label.x_time', {x : T('label.maint_time')}), 		'value' : mnt_time },
				    { 'year' : year, 'name' : T('label.x_count', {x : T('label.maint_count')}),		'value' : mnt_cnt },
				    { 'year' : year, 'name' : T('label.x_count', {x : T('label.run_distance')}),	'value' : run_dist },
				    { 'year' : year, 'name' : T('label.fuel_efficiency'),							'value' : effcc },
				    { 'year' : year, 'name' : T('label.x_time', {x : T('label.run_time')}),			'value' : run_time }
				], function(r) { data.push(r) });
				
				fields.push(year);
			});
			
			if(self.chart)
				self.remove(self.chart);
			self.chart = self.add(self.buildChart(fields));
			
			self.chart.getStore().setData(data);
		});
	},
	
	buildChart : function(fields) {
		var store = Ext.create('Ext.data.JsonStore', {
			fields : ['year', 'name', 'value'],
			data : []
		});
		var series = Ext.Array.each(fields, function(year) {
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
			}
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