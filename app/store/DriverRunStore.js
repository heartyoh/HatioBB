Ext.define('HatioBB.store.DriverRunStore', {
	extend : 'Ext.data.Store',

	config : {
		autoLoad : false,

		remoteFilter : true,

		groupField : 'year',

		fields : [ {
			name : 'driver',
			type : 'string'
		}, {
			name : 'year',
			type : 'integer'
		}, {
			name : 'month',
			type : 'integer'
		}, {
			name : 'month_str',
			type : 'string',
		}, {
			name : 'run_dist',
			type : 'float'
		}, {
			name : 'run_time',
			type : 'integer'
		}, {
			name : 'consmpt',
			type : 'float'
		}, {
			name : 'co2_emss',
			type : 'float'
		}, {
			name : 'effcc',
			type : 'float'
		}, {
			name : 'eco_index',
			type : 'integer'			
		}, {
			name : 'sud_accel_cnt',
			type : 'integer'
		}, {
			name : 'sud_brake_cnt',
			type : 'integer'
		}, {
			name : 'eco_drv_time',
			type : 'integer'
		}, {
			name : 'ovr_spd_time',
			type : 'integer'
		}, {
			name : 'idle_time',
			type : 'integer'
		}, {
			name : 'inc_cnt',
			type : 'integer'
		} ],

		sorters : [ {
			property : 'year',
			direction : 'ASC'
		},{
			property : 'month',
			direction : 'ASC'
		} ],	

		proxy : {
			type : 'ajax',
			url : window.location.pathname.indexOf('/m/') === 0 ? '/driver_run' : 'data/driver_run.json',
			extraParams : {
				select : [ 'driver', 'year', 'month', 'run_dist', 'run_time', 'consmpt', 'co2_emss', 'effcc', 'sud_accel_cnt', 'sud_brake_cnt', 'eco_drv_time', 'ovr_spd_time', 'inc_cnt' ]
			},
			reader : {
				type : 'json',
				rootProperty : 'items',
				totalProperty : 'total'
			}
		}
	}

});