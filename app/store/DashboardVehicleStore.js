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
			// url : 'dashboard/health/vehicle',
			url : 'data/dashboard/health/vehicle.json',
			extraParams : {
			},
			reader : {
				type : 'json',
				rootProperty : 'items'
			}
		}
	}

});