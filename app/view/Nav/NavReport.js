Ext.define('HatioBB.view.nav.NavReport', {
    extend: 'Ext.dataview.List',

    xtype: 'nav_report',

    requires: [
    'Ext.dataview.List',
	'HatioBB.view.chart.vehicle.VehicleHealth'
    ],

    config: {
        title: T('title.report_list'),

        disclosure: true,

        store: Ext.create('Ext.data.Store', {
			fields : ['reportId', 'desc'],
			data : [{
				reportId : 'dailyreport',
				name : 'Daily Report',
				desc : 'Daily Report'
			}, {
				reportId : 'dailyreport2',
				name : 'Daily Report2',
				desc : 'Daily Report2'
			}, {
				reportId : 'dailyreport3',
				name : 'Daily Report3',
				desc : 'Daily Report3'
			}, {
				reportId : 'monthlyreport',
				name : 'Monthly Report',
				desc : 'Monthly Report'
			}, {
				reportId : 'chart_v_health',
				name : 'Vehicle Health Report',
				desc : 'Vehicle Health Report'
			}, {
				reportId : 'ecodrivingreport',
				name : 'Eco-Driving Report',
				desc : 'Eco-Driving Report'
			}, {
				reportId : 'rpt_pie',
				name : 'Vehicle Stat. Report',
				desc : 'Vehicle Stat. Report'
			}, {
				reportId : 'rpt_pie',
				name : 'Driver Stat. Report',
				desc : 'Driver Stat. Report'
			}, {
				reportId : 'drivingreport',
				name : 'Driving Report',
				desc : 'Driving Report'
			}, {
				reportId : 'efficiencyreport',
				name : 'Efficiency Report',
				desc : 'Efficiency Report'
			}]
		}),

        itemTpl: '<div class="iconChart"><strong>{desc}</strong></div>'
    }
});
