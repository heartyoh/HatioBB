Ext.require('HatioBB.view.report.Report1');

Ext.define('HatioBB.controller.Report', {
    extend: 'Ext.app.Controller',

	requires : [  ],

    config: {
        refs: {
			content : '#content',
			navReport :'nav_report'
        },
        control: {
            'nav_report' : {
                itemtap: 'onItemTap'
            }
        }
    },

    onItemTap: function(view, index, target, record) {
		console
        this.showReport(record.get('reportId'));
    },

	showReport : function(report) {
		var view = this.getContent().getComponent(report);
		if(!view)
			view = this.getContent().add({
				xtype : report
			});
		this.getContent().setActiveItem(view);
		
		return view;
	}
});