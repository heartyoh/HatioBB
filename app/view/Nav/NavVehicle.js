Ext.define('HatioBB.view.nav.NavVehicle', {
    extend: 'Ext.dataview.List',

    xtype: 'nav_vehicle',

    requires: [
    'Ext.dataview.List'
    ],

    initialize: function() {
        this.callParent();
    },

    config: {
        title: 'Vehicles',
		cls : 'x-button-icon',

        disclosure: true,

        store: 'VehicleMapStore',

        itemTpl: '<div class="iconVehicle"><strong>{id}</strong> {registration_number}</div>'
    }
});
