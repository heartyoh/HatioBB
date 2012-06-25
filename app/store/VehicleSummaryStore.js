Ext.define('HatioBB.store.VehicleSummaryStore', {
	extend : 'Ext.data.Store',

	config : {
		autoLoad : false,
		
		remoteFilter : true,

		pageSize : 1,

		fields : [ {
			name : 'vehicle',
			type : 'auto'
		}, {
			name : 'consumables',
			type : 'auto'
		}, {
			name : 'maint',
			type : 'auto'
		} ],

		proxy : {
			type : 'ajax',
			url : window.location.pathname.indexOf('/m/') === 0 ? '/vehicle/summary' : 'data/vehicle_summary.json',
			reader : {
				type : 'json',
				rootProperty : 'items',
				totalProperty : 'total',
				successProperty : 'success'
			}
		}
	}

});