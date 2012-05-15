Ext.define('HatioBB.controller.Driver', {
    extend: 'Ext.app.Controller',

	requires : ['HatioBB.view.driver.Driver'],

    config: {
        refs: {
			navOper :'nav_driver',
			content : 'content',
			header : 'header'
        },
        control: {
            'nav_driver' : {
                itemtap: 'onItemTap',
				disclose : 'onDisclose'
            }
        }
    },

	showDriver: function(driver) {
		var view = this.getContent().getComponent('driver');
		if(!view) {
			this.getContent().removeAll();
			view = this.getContent().add({
				xtype : 'driver'
			});
		}
		this.getContent().setActiveItem(view);
		this.getHeader().clearActiveStatus();
		
		return view;
	},
	
    onItemTap: function(view, index, target, record) {
		this.showDriver(record);
    },

    onDisclose: function(record, item, index, e) {
        e.stopEvent();
        Ext.Msg.alert('Disclose', 'Disclose more info for ' + record.get('id'));
    }
});
