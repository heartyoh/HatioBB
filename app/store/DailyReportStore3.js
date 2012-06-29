Ext.define('HatioBB.store.DailyReportStore3', {
	extend : 'Ext.data.Store',

	config : {
		autoLoad : false,

		fields : [ {
			name : 'driver_id',
			type : 'string'
		}, {
			name : 'driver_name',
			type : 'string'
		}, {
			name : 'average_speed',
			type : 'float'
		}, {
			name : 'max_speed',
			type : 'int'
		}, {
			name : 'fuel_efficiency',
			type : 'float'
		}, {
			name : 'co2_emissions',
			type : 'float'
		}, {
			name : 'running_time',
			type : 'int'
		}, {
			name : 'eco_driving_time',
			type : 'int'
		}, {
			name : 'idle_time',
			type : 'int'
		}, {
			name : 'over_speed_time',
			type : 'int'
		}, {
			name : 'sudden_accel_count',
			type : 'int'
		}, {
			name : 'sudden_brake_count',
			type : 'int'
		}],

		proxy : {
			type : 'ajax',
			url : window.location.pathname.indexOf('/m/') === 0 ? '/report/service' : 'data/daily_report3.json',
			extraParams : {
				id : 'daily_driving_habit'
			},
			reader : {
				type : 'json',
				rootProperty : 'items',
				totalProperty : 'total',
				successProperty : 'success'
			}
		}
	}

});