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
				reportId : 'dailyreport',
				name : 'Daily Report',
				desc : 'Daily Report'
			}, {
				reportId : 'monthlyreport',
				name : 'Monthly Report',
				desc : 'Monthly Report'
			}, {
				reportId : 'chart_v_health',
				name : 'Vehicle Health Report',
				desc : 'Vehicle Health Report'
			}, {
				reportId : 'rpt_area',
				name : 'Echo Driving Report',
				desc : 'Echo Driving Report'
			}, {
				reportId : 'rpt_pie',
				name : 'Vehicle Stat. Report',
				desc : 'Vehicle Stat. Report'
			}, {
				reportId : 'rpt_pie',
				name : 'Driver Stat. Report',
				desc : 'Driver Stat. Report'
			}, {
				reportId : 'rpt_pie',
				name : 'Driving Report',
				desc : 'Driving Report'
			}, {
				reportId : 'rpt_pie',
				name : 'Efficiency Report',
				desc : 'Efficiency Report'
			}]
		}),

        itemTpl: '<div class="iconChart"><strong>{desc}</strong></div>'
    }
});
