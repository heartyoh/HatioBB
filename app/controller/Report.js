Ext.define('HatioBB.controller.Report', {
    extend: 'Ext.app.Controller',

	requires : [ 
		'HatioBB.view.report.AreaChart',
		'HatioBB.view.report.BarChart',
		'HatioBB.view.report.ColumnChart',
		'HatioBB.view.report.LineChart',
		'HatioBB.view.report.PieChart',
		'HatioBB.view.report.DailyReport',
		'HatioBB.view.report.DailyReport2',
		'HatioBB.view.report.DailyReport3',
		'HatioBB.view.report.MonthlyReport',
		'HatioBB.view.chart.vehicle.VehicleHealth',
		'HatioBB.view.report.EfficiencyReport',
		'HatioBB.view.report.EcoDrivingReport',
		'HatioBB.view.report.DrivingReport',
		'HatioBB.view.report.EffccConsumptionReport',
		'HatioBB.view.report.EcoDrivingHabitReport',
		'HatioBB.view.report.MaintTrendReport'
	 ],

    config: {
        refs: {
			content : 'content',
			header : 'header',
			navReport :'nav_report'
        },
        control: {
            'nav_report' : {
                itemtap: 'onItemTap'
            },
			'chart_v_health #xxx' : {
				itemtap : function(series, item) {
					Ext.Msg.alert('ItemTap', item);
					this.showReport('rpt_pie');
				}
			}
        }
    },

    onItemTap: function(view, index, target, record) {
        this.showReport(record.get('reportId'));
    },

	showReport : function(report) {
		var view = this.getContent().getComponent(report);
		if(!view) {
			this.getContent().removeAll();
			view = this.getContent().add({
				xtype : report
			});
		}
		this.getContent().setActiveItem(view);
		this.getHeader().clearActiveStatus();
		
		return view;
	}
});