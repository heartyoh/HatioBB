Ext.define('HatioBB.controller.Vehicle', {
    extend: 'Ext.app.Controller',

	requires : ['HatioBB.view.vehicle.Vehicle'],

    config: {
        refs: {
			navOper :'nav_vehicle',
			content : 'content',
			header : 'header'
        },
        control: {
            'nav_vehicle' : {
                itemtap: 'onItemTap',
				disclose : 'onDisclose'
            }
        }
    },

	showVehicle: function(vehicle) {
		var view = this.getContent().getComponent('vehicle');
		if(!view) {
			this.getContent().removeAll();
			view = this.getContent().add({
				xtype : 'vehicle'
			});
		}
		this.getContent().setActiveItem(view);
		this.getHeader().clearActiveStatus();
		
		return view;
	},
	
    onItemTap: function(view, index, target, record) {
		console.log(record);
		this.showVehicle(record);
    },

    onDisclose: function(record, item, index, e) {
        e.stopEvent();
        Ext.Msg.alert('Disclose', 'Disclose more info for ' + record.get('id'));
    }
});
