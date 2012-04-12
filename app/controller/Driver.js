Ext.define('HatioBB.controller.Driver', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
			navOper :'nav_driver'
        },
        control: {
            'nav_driver' : {
                itemtap: 'onItemTap',
				disclose : 'onDisclose'
            }
        }
    },

    onItemTap: function(view, index, target, record) {
        Ext.Msg.alert('ItemTap', record.get('id') + ':' + record.get('reg_number'));
    },


    onDisclose: function(record, item, index, e) {
        e.stopEvent();
        Ext.Msg.alert('Disclose', 'Disclose more info for ' + record.get('id'));
    }
});
