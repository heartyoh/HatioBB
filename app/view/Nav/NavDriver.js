Ext.define('HatioBB.view.nav.NavDriver', {
    extend: 'Ext.dataview.List',

    xtype: 'nav_driver',

    requires: [
    'Ext.dataview.List'
    ],

    initialize: function() {
        this.callParent();
    },

    config: {
        title: 'Drivers',
        disclosure: true,

        store: 'DriverBriefStore',

        itemTpl: '<div class="iconDriver"><strong>{id}</strong> {name}</div>'
    }
});
