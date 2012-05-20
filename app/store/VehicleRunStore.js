Ext.define('HatioBB.store.VehicleRunStore', {
	extend : 'Ext.data.Store',

	config : {
		autoLoad : false,

		remoteFilter : true,
		
		groupField : 'year',

		fields : [ {
			name : 'key',
			type : 'string'
		}, {
			name : 'vehicle',
			type : 'string'
		}, {
			name : 'year',
			type : 'integer',
		}, {
			name : 'month',
			type : 'integer',		
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
			name : 'oos_cnt',
			type : 'integer'
		}, {
			name : 'mnt_cnt',
			type : 'integer'
		}, {
			name : 'mnt_time',
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
			// url : 'vehicle_run',
			url : 'data/vehicle_run.json',
			reader : {
				type : 'json',
				rootProperty : 'items',
				totalProperty : 'total'
			}
		}
	}

});