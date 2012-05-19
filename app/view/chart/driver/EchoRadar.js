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
		
		var chart = this.add(this.buildChart());
		
		this.on('painted', function() {
			HatioBB.setting.on('driver', this.refresh, this);
			this.refresh();
		});
		
		this.on('erased', function() {
			HatioBB.setting.un('driver', this.refresh, this);
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
		var store = Ext.getStore('DriverRunStore');
		
		if(HatioBB.setting.get('driver') === this.driver) 
			return;
			
		this.driver = HatioBB.setting.get('driver');
		
		/* filter로 하지 않고, 파라미터로 해야 함 */
		store.filter([{
			property : 'from_year',
			value : 2011
		}, {
			property : 'from_month',
			value : 6
		}, {
			property : 'to_year',
			value : 2012
		}, {
			property : 'to_month',
			value : 5
		}, {
			property : 'driver',
			value : this.driver
		}]);
		
		store.load(function(records) {
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

			var data = [
			    { 'name' : T('label.x_time', {x : T('label.eco_driving')}), 	'value' : ecoDrvTime },
			    { 'name' : T('label.fuel_efficiency'), 							'value' : efficiency },
			    { 'name' : T('label.x_time', {x : T('label.over_speeding')}), 	'value' : overSpdCnt },
			    { 'name' : T('label.x_count', {x : T('label.sudden_accel')}), 	'value' : sudAccelCnt },
			    { 'name' : T('label.x_count', {x : T('label.sudden_brake')}),	'value' : sudBrakeCnt },
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