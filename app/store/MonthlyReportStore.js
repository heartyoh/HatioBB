Ext.define('HatioBB.store.MonthlyReportStore', {
	extend : 'Ext.data.Store',

	config : {
		autoLoad : false,

		fields : [ {
			name : 'driving',
			type : 'auto'
		}, {
			name : 'maint',
			type : 'auto'
		}, {
			name : 'consumable',
			type : 'auto'
		} ],

		proxy : {
			type : 'ajax',
			url : window.location.pathname.indexOf('/m/') === 0 ? '/report/service' : 'data/monthly_report.json',
			extraParams : {
				id : 'monthly_driving_log'
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