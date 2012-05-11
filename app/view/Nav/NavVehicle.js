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
		cls : 'x-button-icon',

        disclosure: true,

        // grouped: true,

        store: 'VehicleMapStore',

        itemTpl: '<div class="iconVehicle"><strong>{id}</strong> {registration_number}</div>'
    }
});
