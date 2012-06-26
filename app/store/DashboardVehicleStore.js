Ext.define('HatioBB.store.DashboardVehicleStore', {
	extend : 'Ext.data.Store',

	storeId : 'dashboard_vehicle_store',
	
	config : {
		fields : [
			{
				name : 'name',
				type : 'string'
			}, {
				name : 'summary',
				type : 'auto'
			}	
		],

		pageSize : 1000,

		proxy : {
			type : 'ajax',
			url : window.location.pathname.indexOf('/m/') === 0 ? '/report/service' : 'data/dashboard/health/vehicle.json',
			extraParams : {
				id : 'vehicle_health',
				health_type : 'health'
			},
			reader : {
				type : 'json',
				rootProperty : 'items'
			}
		}
	}

});