Ext.define('HatioBB.store.EfficiencyReportStore', {
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
		}],

		proxy : {
			type : 'ajax',
			url : window.location.pathname.indexOf('/m/') === 0 ? '/report/service' : 'data/efficiency_report.json',
			extraParams : {
				id : 'fuel',
				type : 'report'
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