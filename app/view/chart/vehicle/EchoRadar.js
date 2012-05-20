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
		
		var chart = this.add(this.buildChart());
		
		this.on('painted', function() {
			HatioBB.setting.on('vehicle', this.refresh, this);
			this.refresh();
		});
		
		this.on('erased', function() {
			HatioBB.setting.un('vehicle', this.refresh, this);
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
		
		if(HatioBB.setting.get('vehicle') === this.vehicle) 
			return;
			
		this.vehicle = HatioBB.setting.get('vehicle');
		
		/* filter로 하지 않고, 파라미터로 해야 함 */
		var proxy = store.getProxy();
		proxy.config.extraParams.vehicle = this.vehicle;
		proxy.config.extraParams.from_year = 2011;
		proxy.config.extraParams.to_year = 2012;
		proxy.config.extraParams.from_month = 6;
		proxy.config.extraParams.to_month = 5;
		
		store.load(function(records) {
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

			var data = [
			    { 'name' : T('label.x_count', {x : T('label.consumption')}), 	'value' : consmpt },
			    { 'name' : T('label.x_count', {x : T('label.oos')}), 			'value' : oos_cnt },
			    { 'name' : T('label.x_count', {x : T('label.co2_emission')}), 	'value' : co2_emss },
			    { 'name' : T('label.x_time', {x : T('label.maint_time')}), 	'value' : mnt_time },
			    { 'name' : T('label.x_count', {x : T('label.maint_count')}),	'value' : mnt_cnt },
			    { 'name' : T('label.x_count', {x : T('label.run_distance')}),	'value' : run_dist },
			    { 'name' : T('label.fuel_efficiency'),							'value' : effcc },
			    { 'name' : T('label.x_time', {x : T('label.run_time')}),	'value' : run_time },
			];
			
			self.getChart().getStore().setData(data);
		});
	},
	
	buildChart : function() {
		var store = Ext.create('Ext.data.JsonStore', {
			fields : ['name', 'value'],
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
                xField: 'name',
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