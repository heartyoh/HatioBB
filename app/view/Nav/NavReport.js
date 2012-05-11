Ext.define('HatioBB.view.nav.NavReport', {
    extend: 'Ext.dataview.List',

    xtype: 'nav_report',

    requires: [
    'Ext.dataview.List',
	'HatioBB.view.chart.vehicle.VehicleHealth'
    ],

    config: {
        title: 'Reports',

        disclosure: true,

        // grouped: false,

        store: Ext.create('Ext.data.Store', {
			fields : ['reportId', 'desc'],
			data : [{
				reportId : 'chart_v_health',
				desc : 'Vehicle Health'
			}, {
				reportId : 'report1',
				desc : 'Report Type 1'
			}, {
				reportId : 'report2',
				desc : 'Report Type 2'
			}, {
				reportId : 'report3',
				desc : 'Report Type 3'
			}, {
				reportId : 'report4',
				desc : 'Report Type 4'
			}, {
				reportId : 'report5',
				desc : 'Report Type 5'
			}]
		}),

        itemTpl: '<div class="iconChart"><strong>{reportId}</strong> {desc}</div>'
    }
});
