Ext.define('HatioBB.store.DriverSummaryStore', {
	extend : 'Ext.data.Store',

	config : {
		autoLoad : false,
		
		remoteFilter : true,

		pageSize : 1,

		fields : [ {
			name : 'id',
			type : 'string'
		}, {
			name : 'name',
			type : 'string'
		}, {
			name : 'division',
			type : 'string'
		}, {
			name : 'title',
			type : 'string'
		}, {
			name : 'social_id',
			type : 'string'
		}, {
			name : 'phone_no_1',
			type : 'string'
		}, {
			name : 'image_clip',
			type : 'string'
		}, {
			name : 'total_distance',
			type : 'float'
		}, {
			name : 'total_run_time',
			type : 'integer'
		}, {
			name : 'avg_effcc',
			type : 'float'
		}, {
			name : 'eco_index',
			type : 'integer'
		}, {
			name : 'eco_run_rate',
			type : 'integer'
		}, {
			name : 'run_time_of_month',
			type : 'integer'
		}, {
			name : 'run_dist_of_month',
			type : 'float'
		}, {
			name : 'consmpt_of_month',
			type : 'float'
		}, {
			name : 'effcc_of_month',
			type : 'float'
		}, {
			name : 'eco_drv_time_of_month',
			type : 'integer'
		}],

		proxy : {
			type : 'ajax',
			url : window.location.pathname.indexOf('/m/') === 0 ? '/driver/summary' : 'data/driver_summary.json',
			reader : {
				type : 'json',
				rootProperty : 'items',
				totalProperty : 'total',
				successProperty : 'success'
			}
		}
	}

});