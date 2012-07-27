Ext.define('HatioBB.store.VehicleRepairStore', {
	extend : 'Ext.data.Store',

	config : {
		autoLoad : false,
		
		remoteFilter : true,

		pageSize : 1,

		fields : [ {
			name : 'repair_date',
			type : 'date',
			dateFormat : 'time'
		}, {
			name : 'vehicle_id',
			type : 'string'
		}, {
			name : 'repair_time',
			type : 'string'
		}, {
			name : 'repair_mileage',
			type : 'string'
		}, {
			name : 'next_repair_date',
			type : 'date',
			dateFormat : 'time'
		}],

		sorters : [ {
			property : 'repair_date',
			direction : 'DESC'
		} ],
		
		proxy : {
			type : 'ajax',
			url : window.location.pathname.indexOf('/m/') === 0 ? '/repair' : 'data/vehicle_repair.json',
			extraParams : {
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