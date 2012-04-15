Ext.define('HatioBB.view.nav.NavDriver', {
    extend: 'Ext.dataview.List',

    xtype: 'nav_driver',

    requires: [
    'Ext.dataview.List'
    ],

    initialize: function() {
        this.callParent();

        this.getStore().load();
    },

    config: {
        title: 'Drivers',

        disclosure: true,

        grouped: true,

        store: 'Drivers',

        itemTpl: '<div class="oper"><strong>{driver_id}</strong> {name}</div>'
    }
});
