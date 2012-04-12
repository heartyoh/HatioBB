Ext.define('HatioBB.controller.Vehicle', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
			navOper :'nav_vehicle'
        },
        control: {
            'nav_vehicle' : {
                itemtap: 'onItemTap',
				disclose : 'onDisclose'
            }
        }
    },

    onItemTap: function(view, index, target, record) {
        Ext.Msg.alert('ItemTap', record.get('id') + ':' + record.get('name'));
    },


    onDisclose: function(record, item, index, e) {
        e.stopEvent();
        Ext.Msg.alert('Disclose', 'Disclose more info for ' + record.get('id'));
    }
});
