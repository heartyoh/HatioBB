Ext.define('HatioBB.view.chart.vehicle.EcoRadar', {
	extend : 'Ext.Panel',
	
	xtype : 'chart_v_eco_radar',
	
	requires: [
	'Ext.chart.Chart',
    'Ext.chart.axis.Numeric',
    'Ext.chart.axis.Category'
	],
		
	config : {
		title : T('title.chart_v_eco_radar'),
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
		
		store.load({
			params : {
				vehicle : this.vehicle,
				from_year : this.fromYear,
				to_year : thisYear,
				from_month : 1,
				to_month : thisMonth
			},
			callback : function(records) {
				var groups = this.getGroups();
				var data = {
					overSpdTime : { name : T('label.ovr_spd_time') },
					sudAccelCnt : { name : T('label.sud_accel_cnt') },
					sudBrakeCnt : { name : T('label.sud_brake_cnt') },
					idleTime : { name : T('label.idle_time') },					
					ecoDrvTime : { name : T('label.eco_drv_time') },
					efficiency : { name : T('label.fuel_efficiency') },
					ecoIndex : { name : T('label.eco_index') },
					co2Emss : { name : T('label.co2_emissions') }
				};
				var fields = [];

				Ext.Array.each(groups, function(group) {
					var year = group.name.toString();
					var records = group.children;

					var totalRecordCnt = 0;
					var ecoDrvTime = 0;
					var efficiency = 0;
					var overSpdTime = 0;
					var sudAccelCnt = 0;
					var sudBrakeCnt = 0;
					var ecoIndex = 0;
					var co2Emss = 0;
					var idleTime = 0;

					Ext.each(records, function(record) {
						if(record.get('vehicle'))
							totalRecordCnt += 1;

						if(record.get('eco_drv_time'))
							ecoDrvTime += record.get('eco_drv_time');

						if(record.get('effcc'))
							efficiency += record.get('effcc');

						if(record.get('ovr_spd_time'))
							overSpdTime += record.get('ovr_spd_time');

						if(record.get('sud_accel_cnt'))
							sudAccelCnt += record.get('sud_accel_cnt');

						if(record.get('sud_brake_cnt'))
							sudBrakeCnt += record.get('sud_brake_cnt');

						if(record.get('eco_index'))
							ecoIndex += record.get('eco_index');

						if(record.get('co2_emss'))
							co2Emss += record.get('co2_emss');

						if(record.get('idle_time'))
							idleTime += record.get('idle_time');		
					});

					ecoDrvTime = ecoDrvTime / totalRecordCnt;
					efficiency = efficiency / totalRecordCnt;
					overSpdTime = overSpdTime / totalRecordCnt;
					sudAccelCnt = sudAccelCnt / totalRecordCnt;
					sudBrakeCnt = sudBrakeCnt / totalRecordCnt;
					ecoIndex = ecoIndex / totalRecordCnt;
					co2Emss = co2Emss / totalRecordCnt;
					idleTime = idleTime / totalRecordCnt;

					data['ecoIndex'][year] = Math.floor(ecoIndex / 5);
					data['ecoDrvTime'][year] = ecoDrvTime;
					data['efficiency'][year] = efficiency;
					data['co2Emss'][year] = Math.floor(co2Emss / 10);
					data['overSpdTime'][year] = overSpdTime;
					data['sudAccelCnt'][year] = sudAccelCnt;
					data['sudBrakeCnt'][year] = sudBrakeCnt;
					data['idleTime'][year] = idleTime;

					fields.push(year);
				});

				var storeData = [];
				for(var attr in data) {
					storeData.push(data[attr]);
				}

				if(self.chart)
					self.remove(self.chart);
				self.chart = self.add(self.buildChart(fields, storeData));
			}
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