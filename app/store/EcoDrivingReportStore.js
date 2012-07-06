Ext.define('HatioBB.store.EcoDrivingReportStore', {
	extend : 'Ext.data.Store',

	config : {
		autoLoad : false,

		fields : [ {
			name : 'year',
			type : 'int'
		}, {
			name : 'month',
			type : 'int'
		}, {
			name : 'eco_index',
			type : 'float'
		}, {
			name : 'eco_driving',
			type : 'float'
		}, {
			name : 'yearmonth',
			type : 'string'
		}],

		proxy : {
			type : 'ajax',
			url : window.location.pathname.indexOf('/m/') === 0 ? '/report/service' : 'data/eco_driving_report.json',
			extraParams : {
				id : 'eco',
				type : 'ecoindex_ecorate',
				duration : '12'
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