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

        // grouped: true,

        store: 'VehicleMapStore',

        itemTpl: '<div class="oper"><strong>{id}</strong> {registration_number}</div>'
    }
});
