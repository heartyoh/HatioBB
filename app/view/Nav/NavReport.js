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

        store: Ext.create('Ext.data.Store', {
			fields : ['reportId', 'desc'],
			data : [{
				reportId : 'chart_v_health',
				name : 'Vehicle Health',
				desc : 'Vehicle Health'
			}, {
				reportId : 'rpt_line',
				desc : 'Line Chart'
			}, {
				reportId : 'rpt_bar',
				desc : 'Bar Chart'
			}, {
				reportId : 'rpt_column',
				desc : 'Column Chart'
			}, {
				reportId : 'rpt_area',
				desc : 'Area Chart'
			}, {
				reportId : 'rpt_pie',
				desc : 'Pie Chart'
			}]
		}),

        itemTpl: '<div class="iconChart"><strong>{desc}</strong></div>'
    }
});
