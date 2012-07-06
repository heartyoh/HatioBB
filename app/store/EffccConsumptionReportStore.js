Ext.define('HatioBB.store.EffccConsumptionReportStore', {
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
			name : 'effcc',
			type : 'float'
		}, {
			name : 'consmpt',
			type : 'float'
		}, {
			name : 'yearmonth',
			type : 'string'
		}],

		proxy : {
			type : 'ajax',
			url : window.location.pathname.indexOf('/m/') === 0 ? '/report/service' : 'data/efficiency_report.json',
			extraParams : {
				id : 'fuel',
				type : 'effcc_consmpt'
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