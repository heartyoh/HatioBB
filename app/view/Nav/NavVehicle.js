Ext.define('HatioBB.view.nav.NavVehicle', {
    extend: 'Ext.dataview.List',

    xtype: 'nav_vehicle',

    requires: [
    'Ext.dataview.List'
    ],

    initialize: function() {
        this.callParent();

        this.getStore().load();
    },

    config: {
        title: 'Vehicles',

        disclosure: true,

        grouped: true,

        store: 'Vehicles',

        itemTpl: '<div class="oper"><strong>{vehicle_id}</strong> {reg_number}</div>'
    }
});
