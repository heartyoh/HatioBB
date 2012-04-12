Ext.define('HatioBB.controller.Report', {
    extend: 'Ext.app.Controller',

	requires : [ ],

    config: {
        refs: {
			content : '#content',
			navReport :'nav_report'
        },
        control: {
            'nav_report' : {
                itemtap: 'onItemTap',
				disclose : 'onDisclose'
            }
        }
    },

    onItemTap: function(view, index, target, record) {
        // Ext.Msg.alert('ItemTap', record.get('reportId') + ':' + record.get('desc'));
		this.getContent().removeAll();
		this.getContent().add({
			// xtype : 'sample'
			// xtype : 'content_col'
		});
    },


    onDisclose: function(record, item, index, e) {
        e.stopEvent();
        Ext.Msg.alert('Disclose', 'Disclose more info for ' + record.get('reportId'));
    }
});